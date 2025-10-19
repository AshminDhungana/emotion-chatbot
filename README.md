# 🤖 Emotion-Chatbot

A web-based **Emotion Chatbot** that interacts with users while detecting and reflecting emotions in text. Users can either **log in** or chat anonymously. The chatbot runs on a **Seq2Seq model, facebook/blenderbot-400M** model, fine-tuned for emotion-aware dialogue.

---

## 🚀 Features

* 🧠 Emotion-aware text response generation
* 👤 Login/Register or Anonymous chat
* 💾 Chat history saved for logged-in users
* ⚡ Fast REST API using Flask
* 🌐 Responsive React frontend (SPA)
* 🧩 SQLite database integration
* 🪶 Lightweight and easy to deploy

---

## 🧰 Tech Stack

| Layer                 | Technology                                              |
| --------------------- | ------------------------------------------------------- |
| **Frontend**          | React + Vite, JavaScript, Tailwind CSS                  |
| **Backend**           | Python (Flask)                                          |
| **Database**          | SQLite                                                  |
| **ML Model**          | PyTorch (facebook/blenderbot-400M) & Emotion Classifier |
| **API Communication** | REST                                                    |

---

## 📁 Folder Structure

```
emotion-chatbot/
│
├── backend/                            # Flask backend                           
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                     # Entry point for backend
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── auth_routes.py          # Login/Register endpoints
│   │   │   └── chat_routes.py          # Chat API (emotion responses)
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── user_model.py           # SQLAlchemy model
│   │   ├── services/
│   │   │   ├── emotion_model.py        # ML model loader/inference
│   │   │   └── database.py             # DB connection config
│   │   └── utils/
│   │       └── preprocess.py           # Text cleaning utilities
│   ├── requirements.txt
│   ├── .env                            # Environment variables (DB_URL, SECRET_KEY)
│   └── run.py                          # Runs the Flask server
│
├── frontend/                           # React frontend (SPA)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.js
│   │   │   ├── Message.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── Navbar.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── .env                            # REACT_APP_API_URL=http://localhost:5000
│   └── README.md
│
├── docs/                               # Documentation assets
│   └── architecture-diagram.png
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## ⚙️ Setup Instructions

### 🧩 1. Clone the repository

```bash
git clone https://github.com/yourusername/emotion-chatbot.git
cd emotion-chatbot
```

### 🐍 2. Backend Setup (Python)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows

pip install -r requirements.txt
```

Set up your `.env` file:

```
FLASK_ENV=development
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///chatbot.db
```

Run the backend:

```bash
python run.py
```



### ⚛️ 3. Frontend Setup (React)

In another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file:

```
REACT_APP_API_URL=http://localhost:5000
```

Run the development server:

```bash
npm start
```

The React app will open at **[http://localhost:3000](http://localhost:3000)**

---

## 💬 Usage

1. Open the frontend in your browser
2. Log in or start chatting anonymously
3. The bot detects emotion in your message and responds accordingly
4. Logged-in users can view past chat sessions

---

## 🧠 Model Details

* **Base Model:** facebook/blenderbot-700M
* **Classification Model:** DistilRoBERTa-based text classification model
* **Framework:** Pytorch
* **Training:** Fine-tuned on emotion-labeled dialogue datasets

## 🧩 Future Roadmap

* 🔊 Voice chat integration
* 🌍 Multilingual emotion support
* ☁️ Deploy model to GPU cloud (Hugging Face / AWS / GCP)
* 📊 Analytics dashboard for emotion stats
* 🔒 OAuth login (Google/Facebook)

---

## 🧾 License

This project is licensed under the **MIT License**.

---

## 💡 Author

**Ashmin Dungana**
Built with ❤️ using Python, React, and Seq2Seq model
