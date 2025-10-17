from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
import torch
import re
import logging
from huggingface_hub import model_info

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='chatbot.log'
)

class EmotionModel:
    def __init__(
        self,
        chat_model_name="facebook/blenderbot-400M-distill",
        emotion_model_name="j-hartmann/emotion-english-distilroberta-base"
    ):
        try:
            # Validate model identifiers
            try:
                model_info(chat_model_name)
                logging.info(f"Validated chat model: {chat_model_name}")
            except Exception as e:
                logging.error(f"Invalid chat model identifier: {chat_model_name}. Error: {e}")
                raise RuntimeError(f"Chat model {chat_model_name} is not a valid Hugging Face model.")

            try:
                model_info(emotion_model_name)
                logging.info(f"Validated emotion model: {emotion_model_name}")
            except Exception as e:
                logging.error(f"Invalid emotion model identifier: {emotion_model_name}. Error: {e}")
                raise RuntimeError(f"Emotion model {emotion_model_name} is not a valid Hugging Face model.")

            # Set device and check GPU memory
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            logging.info(f"Using device: {self.device}")
            if self.device.type == "cuda":
                gpu_memory = torch.cuda.get_device_properties(0).total_memory / 1e9
                logging.info(f"GPU memory available: {gpu_memory:.1f}GB")

            # Load BlenderBot for chat
            self.chat_tokenizer = AutoTokenizer.from_pretrained(chat_model_name)
            self.chat_model = AutoModelForSeq2SeqLM.from_pretrained(chat_model_name)
            self.chat_model.to(self.device)
            self.chat_model.eval()
            logging.info(f"Loaded chat model: {chat_model_name}")

            # Load emotion classifier
            self.emotion_classifier = pipeline(
                "text-classification",
                model=emotion_model_name,
                framework="pt",
                return_all_scores=False,
                device=0 if torch.cuda.is_available() else -1
            )
            logging.info(f"Loaded emotion model: {emotion_model_name}")

        except Exception as e:
            logging.error(f"Error initializing models: {e}")
            raise RuntimeError("Failed to load chatbot or emotion model. Check logs.")

    def detect_emotion(self, user_message):
        try:
            result = self.emotion_classifier(user_message)[0]
            return result['label'].lower()
        except Exception as e:
            logging.error(f"Error in detect_emotion: {e}")
            return "neutral"

    def generate_response(self, user_message, conversation_history=None):
        """
        Generate friendly, short, emotion-aware reply using BlenderBot.
        """
        try:
            emotion = self.detect_emotion(user_message)
            logging.debug(f"Detected emotion: {emotion}")

            # Simple emotion-based instructions
            prompts = {
                "joy": "Reply enthusiastically and positively to the user's message, mirroring their happy mood. Do not mention your own feelings.",
                "sadness": "Reply empathetically and comfortingly to the user's message, supporting their sad mood. Do not mention your own feelings.",
                "anger": "Reply calmly and soothingly to the user's message, acknowledging their frustration. Do not mention your own feelings.",
                "fear": "Reply reassuringly and calmly to the user's message, easing their anxiety. Do not mention your own feelings.",
                "surprise": "Reply excitedly and positively to the user's message, matching their surprise. Do not mention your own feelings.",
                "disgust": "Reply neutrally but empathetically to the user's message, acknowledging their feelings. Do not mention your own feelings.",
                "neutral": "Reply in a friendly conversational tone to the user's message."
            }
            instruction = prompts.get(emotion, prompts["neutral"])

            # Build prompt with BlenderBot-style separators
            prompt = f"{instruction}\n"
            if conversation_history:
                for msg in conversation_history[-2:]:
                    prompt += f"User: {msg['user']} __endoftext__ Bot: {msg['bot']} __endoftext__ "
            prompt += f"User: {user_message} __endoftext__ Bot: "
            logging.debug(f"Prompt: {prompt}")

            # Encode input
            inputs = self.chat_tokenizer(
                prompt,
                return_tensors="pt",
                max_length=128,
                truncation=True,
                padding=True
            ).to(self.device)
            logging.debug(f"Input IDs shape: {inputs['input_ids'].shape}")

            # Ensure pad_token_id is set
            if self.chat_tokenizer.pad_token_id is None:
                self.chat_tokenizer.pad_token_id = self.chat_tokenizer.eos_token_id
                logging.debug("Set pad_token_id to eos_token_id")

            # Generate response
            outputs = self.chat_model.generate(
                input_ids=inputs['input_ids'],
                attention_mask=inputs.get('attention_mask'),
                max_new_tokens=60,  # Increased slightly for more natural responses
                temperature=0.8,   # Slightly higher for diversity
                top_p=0.95,        # Relaxed for more natural output
                do_sample=True,
                pad_token_id=self.chat_tokenizer.pad_token_id,
                no_repeat_ngram_size=3  # Relaxed from 2
            )
            logging.debug(f"Raw output tokens: {outputs[0].tolist()}")  # Log raw tokens
            logging.debug(f"Output shape: {outputs.shape}")

            # Decode reply
            reply = self.chat_tokenizer.decode(outputs[0], skip_special_tokens=True)
            reply = reply.replace(prompt, "").strip()  # Remove prompt more reliably
            logging.debug(f"Raw reply: {reply}")

            # Basic cleanup
            reply = re.sub(r'[.!?]{2,}', '.', reply)
            reply = re.sub(r'(\b\w+\b)( \1)+', r'\1', reply)

            # Check for self-focused or contradictory responses
            negative_keywords = ["sad", "sorry", "bad", "terrible", "awful", "upset"]
            positive_keywords = ["happy", "great", "awesome", "wonderful", "excited"]
            self_focused_keywords = ["i am feeling", "i feel", "i'm feeling"]
            is_negative = any(word in reply.lower() for word in negative_keywords)
            is_positive = any(word in reply.lower() for word in positive_keywords)
            is_self_focused = any(phrase in reply.lower() for phrase in self_focused_keywords)

            if emotion == "joy" and (is_negative or is_self_focused or not is_positive):
                logging.debug("Rejected contradictory or self-focused reply for joy")
                reply = "That’s so great to hear! What’s making you happy today?"
            elif emotion == "sadness" and (is_positive or is_self_focused):
                logging.debug("Rejected contradictory or self-focused reply for sadness")
                reply = "I’m really sorry you’re feeling down. Want to share more?"
            elif emotion == "surprise" and (is_negative or is_self_focused):
                logging.debug("Rejected contradictory or self-focused reply for surprise")
                reply = "Wow! That’s surprising. Tell me more!"

            # Fallback if empty, too short, or too long
            if not reply or len(reply.split()) < 3 or len(reply.split()) > 15:
                fallback = {
                    "joy": "That’s so great to hear! What’s making you happy today?",
                    "sadness": "I’m really sorry you’re feeling down. Want to share more?",
                    "anger": "I hear you, that sounds frustrating. Can I help in any way?",
                    "fear": "I’m here for you. Could you tell me more?",
                    "surprise": "Wow! That’s surprising. Tell me more!",
                    "disgust": "I understand. Could you explain more?",
                    "neutral": "I’m here to chat! Could you tell me a bit more?"
                }
                reply = fallback.get(emotion, fallback["neutral"])
                logging.debug(f"Used fallback reply for emotion {emotion}: {reply}")

            return reply

        except Exception as e:
            logging.error(f"Chatbot model error: {str(e)}")
            return "Chatbot model is unavailable"