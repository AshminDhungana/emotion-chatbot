from flask import Blueprint, request, jsonify, session
from werkzeug.utils import secure_filename
from app.services.emotion_model import EmotionModel

chat_bp = Blueprint("chat", __name__)

# Load the model once at startup with error handling
try:
    model = EmotionModel()
except Exception as e:
    model = None
    print(f"Failed to load EmotionModel: {e}")

@chat_bp.route("/api/chat", methods=["POST"])
def chat():
    # Check if model is loaded
    if model is None:
        return jsonify({"error": "Chatbot model is unavailable"}), 500

    # Validate JSON payload
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid JSON payload"}), 400

    # Extract and sanitize user message
    user_message = data.get("message", "").strip()
    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    # Basic sanitization (e.g., limit length to prevent abuse)
    if len(user_message) > 500:
        return jsonify({"error": "Message too long (max 500 characters)"}), 400

    try:
        # Initialize session-based conversation history
        if "conversation_history" not in session:
            session["conversation_history"] = []

        # Detect emotion and generate response
        emotion = model.detect_emotion(user_message)
        reply = model.generate_response(user_message, session["conversation_history"])

        # Update conversation history (limit to 10 exchanges)
        session["conversation_history"].append({"user": user_message, "bot": reply})
        if len(session["conversation_history"]) > 10:
            session["conversation_history"].pop(0)
        session.modified = True  # Mark session as modified

        # Return JSON response
        return jsonify({
            "emotion": emotion,
            "reply": reply
        })

    except Exception as e:
        # Log error (in production, use proper logging)
        print(f"Chat error: {str(e)}")
        return jsonify({"error": "An error occurred while processing your message"}), 500