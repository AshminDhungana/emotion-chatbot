def detect_emotion_and_reply(message):
    """
    Basic example of emotion detection and response generation.
    Replace this with your real model later.
    """
    message_lower = message.lower()

    if "happy" in message_lower or "good" in message_lower:
        return "happy", "I'm glad to hear that! 😊"
    elif "sad" in message_lower:
        return "sad", "I'm sorry you're feeling that way. I'm here for you. 💙"
    elif "angry" in message_lower:
        return "angry", "Take a deep breath... it’s okay to feel angry sometimes. 😤"
    else:
        return "neutral", "I see. Tell me more about it."
