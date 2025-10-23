from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os
from app.routes.chat_routes import chat_bp
from app.routes.auth_routes import auth_bp

from app.services.database import db

def create_app():
    app = Flask(__name__)
    load_dotenv()

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL", "sqlite:///chatbot.db")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv("SECRET_KEY", "supersecret")
    app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY", "jwtsecretkey")  

    # Initialize extensions
    db.init_app(app)
    CORS(app)
    jwt = JWTManager(app)

    # Simple route
    @app.route("/ping")
    def ping():
        return {"message": "pong"}

    # Import and register authentication routes
    app.register_blueprint(chat_bp)
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    

    return app
