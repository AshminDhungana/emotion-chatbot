# 🤖 Emotion-Chatbot

A web-based **Emotion Chatbot** that interacts with users while detecting and reflecting emotions in text. Users can either **login** or chat anonymously. The chatbot is powered by a **small language model (~124M parameters)** using PyTorch/Keras, making it fast and lightweight while providing emotion-aware responses.

---

## Features

- Chat anonymously or login/register  
- Emotion-aware responses based on user input  
- Save chat history for logged-in users  
- Responsive and interactive frontend  
- Simple backend API with Python and SQL database  

---

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Python (Flask)  
- **Database:** SQLite   
- **Machine Learning:**  Tensorflow, Keras  
- **Model:** GPT-2 Small (~124M parameters) fine-tuned for emotion dialogues  

---

## Folder Structure

```
emotion-chatbot/
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   └── config.py
├── model/
│   └── gpt2-finetuned/
├── requirements.txt
└── README.md
```

---

## Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/emotion-chatbot.git
cd emotion-chatbot
```

2. **Create a virtual environment**
```bash
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up the database**
- Configure database credentials in `backend/config.py`
- Create necessary tables for users and chat history

5. **Start the backend server**
```bash
uvicorn backend.main:app --reload
```

6. **Open the frontend**
- Open `frontend/index.html` in a web browser or serve it using a local HTTP server

---

## Usage

1. Open the chatbot in your browser  
2. Choose to **login** or **chat anonymously**  
3. Type your message and get an emotion-aware response from the chatbot  
4. For logged-in users, chat history is saved and can be accessed later  

---

## Model

- Pretrained **GPT-2 Small (~124M parameters)**  
- Fine-tuned on **emotion-labeled dialogue datasets**  
- Emotion-aware response generation for more natural conversations  

```python
from transformers import GPT2Tokenizer, GPT2LMHeadModel

tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
model = GPT2LMHeadModel.from_pretrained("gpt2")
```

---

## Future Improvements

- Add advanced **emotion detection** for nuanced responses  
- Voice input/output support  
- Multi-language support  
- Analytics on user emotions and conversations  
- Deploy backend and model on a cloud server with GPU support  

---

## License

This project is licensed under the **MIT License**.

