import pandas as pd
from datetime import datetime, timedelta
from fetch import fetch_recent_articles
from summarize_and_score import process_ai_news_articles
from loguru import logger
from dotenv import load_dotenv
import os

load_dotenv('.env')
logger.add('app.log')

# List of AI news websites
ai_news_sites = [
    "https://www.artificialintelligence-news.com/",
    "https://venturebeat.com/category/ai/",
    "https://www.technologyreview.com/topic/artificial-intelligence/",
    "https://www.aitrends.com/",
    'https://techcrunch.com/category/artificial-intelligence/'
]

# Define the recency threshold (e.g., last 7 days)
days_threshold = 7
recency_threshold = datetime.now().date() - timedelta(days=days_threshold)

# Fetch recent articles from all sites
all_recent_articles = []
for site_url in ai_news_sites:
    logger.info(f"Fetching articles from {site_url}...")
    articles = fetch_recent_articles(site_url,recency_threshold, logger ,limit=5)
    all_recent_articles.extend(articles)

# Create a DataFrame and save to CSV
if all_recent_articles:
    df = pd.DataFrame(all_recent_articles)
    logger.info(df)
    # df_sorted = df.sort_values(by='publish_date', ascending=False)
    df.to_csv("CSV/recent_ai_news_articles.csv", index=False)
    logger.info("Recent articles saved to recent_ai_news_articles.csv")
else:
    logger.info("No recent articles found.")

# PREPROCESSING THE AI FETCHED DATA TO GET PROPER DELIVERABLE POSTS ALOG WITH VIRALITY SCORE
process_ai_news_articles(
    input_csv='CSV/recent_ai_news_articles.csv',
    output_csv='CSV/processed_ai_news_articles.csv',
    api_key= os.getenv("API_KEY"),
    logger = logger,
    model_name="gemini-2.0-flash-exp"
)
