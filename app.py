
"""
(A) User Authentication
@app.route('/register', methods=['POST']) → Register a new user
@app.route('/login', methods=['POST']) → Login with JWT token
@app.route('/logout', methods=['POST']) → Logout user
@app.route('/profile', methods=['GET']) → Get user details

(C) News Collection & Processing
@app.route('/fetch_news', methods=['POST']) → Start AI-based news collection
@app.route('/get_news', methods=['GET']) → Fetch processed news for a user
@app.route('/export_news', methods=['GET']) → Export news as PDF/JSON

(D) API Access for External Users
@app.route('/api/get_news', methods=['GET']) → API for users to fetch structured news
@app.route('/api/submit_query', methods=['POST']) → Users can request AI-processed news
(E) Admin Panel
@app.route('/admin/users', methods=['GET']) → List all users
@app.route('/admin/news', methods=['GET']) → View all AI-processed news
@app.route('/admin/stats', methods=['GET']) → Fetch SaaS analytics

"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from sqlalchemy import create_engine, Column, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from apscheduler.schedulers.background import BackgroundScheduler
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
import smtplib
import os
from sqlalchemy.dialects.postgresql import JSON
from loguru import logger
import json
from typing import Dict
from pydantic import BaseModel

class UserRegisterRequest(BaseModel):
    name : str
    email: str
    preferredPlatform : str
    topics : Dict[str,bool]
    


logger.add("app2.log", backtrace=True, diagnose=True)
app = FastAPI()
scheduler = BackgroundScheduler()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can specify ["http://localhost:5173"] instead of "*" for security
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)


# Database Setup
DATABASE_URL = "sqlite:///./users.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    email = Column(String, primary_key=True, unique=True)
    name = Column(String)
    platform = Column(String)
    topics = Column(JSON) 

from sqlalchemy import Integer, Float
class NewsArticle(Base):
    __tablename__ = "news_articles"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(String)
    virality_score = Column(Float)
    publish_date = Column(String)
    url = Column(String)

Base.metadata.create_all(bind=engine)

from dotenv import load_dotenv
import os

load_dotenv('.env')

# Email Configuration
conf = ConnectionConfig(
    MAIL_USERNAME= os.getenv("EMAIL"),
    MAIL_PASSWORD= os.getenv("MAIL_PASSWORD"),
    MAIL_FROM = os.getenv("EMAIL"),
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,  # Use STARTTLS
    MAIL_SSL_TLS=False,  # Not using SSL/TLS
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

# Store Users
# @app.post("/register")
# async def register_user(email: str):


@app.post("/register")
async def register_user(request: UserRegisterRequest):
    email = request.email
    name = request.name
    platform = request.preferredPlatform
    topics = request.topics

    logger.info(f"Registering user with email: {email}, {name}, {topics}, {platform}")
    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(email=email, name=name, platform=platform, topics=json.dumps(topics))
    db.add(new_user)
    db.commit()
    db.close()

    # SENDING EMAIL AFTER CONFIRMING REGISTRATION
    message = MessageSchema(
        subject="Welcome to AI News Service!",
        recipients=[email],
        body=f"Dear {name}, \nYou have successfully registered for AI News Service! \nThank You for registering. \n Regards \nRounak Gera",
        subtype="plain"
    )
    
    fm = FastMail(conf)
    await fm.send_message(message)

        
    return {"message": "Registered successfully!"}

import pandas as pd
import re
def load_news_from_csv(file_path: str = "CSV/processed_ai_news_articles.csv"):
    url_pattern = r"https?://[^\s]+"
    df = pd.read_csv(file_path)
    db = SessionLocal()

    # Delete all existing records in the news_articles table
    db.query(NewsArticle).delete()
    db.commit()

    for _, row in df.iterrows():
        url_lst = re.findall(url_pattern, str(row['FINAL']))
        if len(url_lst) == 0:
            url_ =  ""
        else:
            url_ = url_lst[0]
        
        news_article = NewsArticle(
            title=row['title'],
            content=row['FINAL'],
            virality_score=row['SCORE'],
            publish_date = str(row['publish_date']),
            url = url_
        )
        db.add(news_article)
    db.commit()
    db.close()


# Fetch News (Dummy Function)
from main import main
# async def fetch_ai_news():
#     logger.info("meow once")
#     main(logger)
#     load_news_from_csv(r"CSV/processed_ai_news_articles.csv")
#     return "Latest AI News: OpenAI releases new GPT model!"

import asyncio
from concurrent.futures import ThreadPoolExecutor

async def fetch_ai_news():
    logger.info("meow once")
    # main(logger)
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor() as pool:
        await loop.run_in_executor(pool, load_news_from_csv, "CSV/processed_ai_news_articles.csv")
    return "Latest AI News: OpenAI releases new GPT model!"


# Send Emails
async def send_emails():
    await fetch_ai_news()

    db = SessionLocal()
    users = db.query(User).all()
    news_articles = db.query(NewsArticle).order_by(NewsArticle.virality_score.desc()).all()
    db.close()
      
    
    # Create the news content to be sent
    # news_content = "Daily AI News:\n\n"
    # for article in news_articles:
    #     news_content += f"Title: {article.title}\n"
    #     news_content += f"Content: {article.content}\n"
    #     news_content += f"Virality Score: {article.virality_score}\n\n"

    news_content = """
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            h2 { color: #333; }
            ul { padding: 0; }
            li { margin-bottom: 20px; list-style: none; padding: 15px; border-bottom: 1px solid #ddd; }
            h3 { margin: 0; color: #007bff; }
            p { margin: 5px 0; color: #555; }
            strong { color: #222; }
            a { color: #007bff; text-decoration: none; font-weight: bold; }
        </style>
    </head>
    <body>
        <h2>📰 Daily AI News</h2>
        <ul>
    """

    for article in news_articles:
        news_content += f"""
            <li>
                <h3>{article.title}</h3>
                <p>{article.content}</p>
                <p><strong>Virality Score:</strong> {article.virality_score}</p>
                <p>Publish Date : {article.publish_date}</p>

            </li>
        """

    news_content += """
        </ul>
    </body>
    </html>
    """

    message = MessageSchema(
        subject="📰 Daily AI News",
        recipients=[user.email for user in users],
        body=news_content,
        subtype="html"  # Ensures correct rendering as HTML
    )

    fm = FastMail(conf)
    await fm.send_message(message)

def send_emails_wrapper():
    asyncio.run(send_emails())
    logger.info("Emails sent successfully!")

# Schedule Email Sending
scheduler.add_job(send_emails_wrapper, "interval", hours=24) 
scheduler.start()

@app.get("/")
async def home():
    return {"message": "Welcome to AI News Service!"}

@app.get("/test-email")
async def test_email():
    await send_emails()
    return {"message": "Test email sent!"}

@app.get("/users")
async def get_users():
    db = SessionLocal()
    users = db.query(User).all()
    db.close()
    
    return {"users": [[user.name, user.email,  user.platform, user.topics] for user in users]}

@app.get("/clear")
async def del_users():
    db = SessionLocal()
    users = db.query(User).all()
    for user in users:
        db.delete(user)

    db.commit()
    db.close()
    
    return {"Deleted ALL!!!!!!!!!"}


# function for displaying news on website
@app.get("/news")
async def get_news():
    db = SessionLocal()
    news_articles = db.query(NewsArticle).order_by(NewsArticle.virality_score.desc()).all()
    db.close()
    logger.info(f"Returning {len(news_articles)} news articles")
    
    return {"news": [{"title": article.title, "content": article.content, "virality_score": article.virality_score, "publish_date" : article.publish_date, "url" : article.url} for article in news_articles]}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))  # Default to 8000 if PORT is not set
    uvicorn.run(app, host="0.0.0.0", port=port)