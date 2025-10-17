from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
import torch
import re
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s', filename='chatbot.log')

class EmotionModel:
    def __init__(
        self,
        chat_model_name="facebook/blenderbot-400M-distill",
        emotion_model_name="j-hartmann/emotion-english-distilroberta-base"
    ):
        # Load BlenderBot for chat
        try:
            self.chat_tokenizer = AutoTokenizer.from_pretrained(chat_model_name)
            self.chat_model = AutoModelForSeq2SeqLM.from_pretrained(chat_model_name)
            self.chat_model.eval()
            logging.info(f"Loaded {chat_model_name} successfully")
        except Exception as e:
            logging.error(f"Failed to load {chat_model_name}: {e}")
            raise

        # Load emotion classifier
        try:
            self.emotion_classifier = pipeline(
                "text-classification",
                model=emotion_model_name,
                framework="pt",
                return_all_scores=False
            )
            logging.info(f"Loaded {emotion_model_name} successfully")
        except Exception as e:
            logging.error(f"Failed to load {emotion_model_name}: {e}")
            raise

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
            # Detect emotion to tailor the response
            emotion = self.detect_emotion(user_message)
            logging.debug(f"Detected emotion: {emotion}")

            # Define emotion-specific prompt adjustments
            emotion_prompts = {
                "joy": "Respond with enthusiasm and positivity to the user's message, mirroring their happy mood. Do not mention your own feelings.",
                "sadness": "Respond with empathy and comfort to the user's message, supporting their sad mood. Do not mention your own feelings.",
                "anger": "Respond with understanding and a soothing tone to the user's message, acknowledging their frustration. Do not mention your own feelings.",
                "fear": "Respond with calmness and support to the user's message, easing their anxiety. Do not mention your own feelings.",
                "surprise": "Respond with enthusiasm to the user's message, matching their surprise. Do not mention your own feelings.",
                "disgust": "Respond with a neutral, empathetic tone to the user's message, acknowledging their feelings. Do not mention your own feelings.",
                "neutral": "Respond in a friendly, conversational tone to the user's message."
            }
            emotion_instruction = emotion_prompts.get(emotion, "Respond in a friendly, conversational tone to the user's message.")

            # Build minimal prompt
            prompt = f"{emotion_instruction}\nUser: {user_message}\nBot: "
            if conversation_history:
                for msg in conversation_history[-2:]:  # Limit to last 2 exchanges
                    prompt = f"User: {msg['user']}\nBot: {msg['bot']}\n{prompt}"
            logging.debug(f"Prompt: {prompt}")

            # Encode input
            inputs = self.chat_tokenizer(
                prompt,
                return_tensors="pt",
                max_length=128,  # Reduced to avoid truncation issues
                truncation=True,
                padding=True
            )
            logging.debug(f"Input IDs shape: {inputs['input_ids'].shape}")

            # Ensure pad_token_id is set
            if self.chat_tokenizer.pad_token_id is None:
                self.chat_tokenizer.pad_token_id = self.chat_tokenizer.eos_token_id
                logging.debug("Set pad_token_id to eos_token_id")

            # Move inputs to same device as model
            device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            self.chat_model.to(device)
            inputs = {k: v.to(device) for k, v in inputs.items()}
            logging.debug(f"Inputs moved to device: {device}")

            # Generate response
            outputs = self.chat_model.generate(
                input_ids=inputs['input_ids'],
                attention_mask=inputs.get('attention_mask'),
                max_new_tokens=50,  # Reduced for faster, focused responses
                temperature=0.7,
                top_p=0.9,
                do_sample=True,
                pad_token_id=self.chat_tokenizer.pad_token_id,
                no_repeat_ngram_size=2  # Reduced to avoid over-constraint
            )
            logging.debug(f"Output shape: {outputs.shape}")

            # Decode and clean
            reply = self.chat_tokenizer.decode(outputs[0], skip_special_tokens=True)
            reply = reply[len(prompt):].strip()  # Explicitly remove prompt
            logging.debug(f"Raw reply: {reply}")

            # Clean up: remove excessive punctuation, keep emojis
            reply = re.sub(r'[.!?]{2,}', '.', reply)
            reply = re.sub(r'(\b\w+\b)( \1)+', r'\1', reply)

            # Check if response contradicts the emotion or is self-focused
            negative_keywords = ["sad", "sorry", "bad", "terrible", "awful", "upset"]
            positive_keywords = ["happy", "great", "awesome", "wonderful", "excited"]
            self_focused_keywords = ["i am feeling", "i feel", "i'm feeling"]
            is_negative = any(word in reply.lower() for word in negative_keywords)
            is_positive = any(word in reply.lower() for word in positive_keywords)
            is_self_focused = any(phrase in reply.lower() for phrase in self_focused_keywords)

            if emotion == "joy" and (is_negative or is_self_focused or not is_positive):
                reply = "That’s so great to hear! What’s making you happy today?"
                logging.debug("Rejected contradictory or self-focused reply for joy")
            elif emotion == "sadness" and (is_positive or is_self_focused):
                reply = "I’m really sorry you’re feeling down. Want to share more?"
                logging.debug("Rejected contradictory or self-focused reply for sadness")

            # Safety check: fallback if reply is empty or too short
            if len(reply) == 0 or len(reply.split()) < 3:
                if emotion == "joy":
                    reply = "That’s so great to hear! What’s making you happy today?"
                elif emotion == "sadness":
                    reply = "I’m really sorry you’re feeling down. Want to share more?"
                elif emotion == "anger":
                    reply = "I hear you, that sounds frustrating. Can I help in any way?"
                else:
                    reply = "I’m here to chat! Could you tell me a bit more?"
                logging.debug(f"Fallback reply used: {reply}")

            return reply

        except Exception as e:
            logging.error(f"Error in generate_response: {str(e)}")
            return "Sorry, something went wrong. Could you try again?"