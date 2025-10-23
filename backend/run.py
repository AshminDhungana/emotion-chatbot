from app import create_app, db
import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"


app = create_app()

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True, port=5000)

