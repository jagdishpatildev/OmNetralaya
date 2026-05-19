# Om Netralaya & Dental Clinic – Flask Website

## ✅ No API Key Required — Completely Free

This project uses **no paid APIs**. Reviews are served from the Flask backend — no billing ever.

## Setup

```bash
pip install -r requirements.txt
python app.py
```

Open **http://localhost:5000** — done!

## How Reviews Work

Reviews live in `app.py` → `REVIEW_DATA["reviews"]`. To add more, just append dict entries:
```python
{"author_name": "Name", "rating": 5, "relative_time_description": "1 week ago", "text": "Great!"}
```

## Structure
```
om-flask/
├── app.py                  ← Flask app (no API key)
├── requirements.txt
├── templates/index.html    ← Full website
└── static/
    ├── css/style.css
    ├── js/main.js
    └── images/
```
