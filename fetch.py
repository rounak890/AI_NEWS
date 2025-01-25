import pandas as pd
import newspaper
from newspaper import Article, build
from datetime import datetime, timedelta

def fetch_recent_articles(url,recency_threshold, logger ,limit=5):
    """Fetches recent articles from a given news site URL, limiting to the specified number of articles."""
    paper = build(url, memoize_articles=False)
    recent_articles = []
    count = 0
    for item in paper.articles:
        if count >= limit:
            break
        try:
            article = Article(item.url)
            article.download()
            article.parse()
            if article.publish_date:
                article_date = article.publish_date.date()
                if article_date >= recency_threshold:
                    recent_articles.append({
                        "title": article.title,
                        "link": article.url,
                        "publish_date": article.publish_date,
                        "content": article.text
                    })
                    count += 1
        except Exception as e:
            logger.info(f"Error processing article {item.url}: {e}")
    return recent_articles