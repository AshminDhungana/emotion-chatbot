from app.services.database import db

app = create_app()
db.init_app(app)

with app.app_context():
    db.create_all()
