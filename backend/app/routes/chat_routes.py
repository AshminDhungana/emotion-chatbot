from flask import Blueprint, request, jsonify
from app.services.emotion_model import detect_emotion_and_reply

chat_bp = Blueprint('chat', __name__)

@chat_bp.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "")

    if not message:
        return jsonify({"error": "Message is required"}), 400

    # Process the message
    emotion, response = detect_emotion_and_reply(message)

    return jsonify({
        "emotion": emotion,
        "response": response
    })
