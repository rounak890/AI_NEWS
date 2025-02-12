import React, { useState, useEffect } from 'react';
import { Newspaper, Tag, Clock } from 'lucide-react';

export default function TodayNews() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/news");
        const data = await response.json();

        if (data.news) {
          setNews(
            data.news.map((item, index) => ({
              id: index + 1, // Assign a sequential ID
              title: item.title,
              category: "AI News", // Adjust if API provides category
              summary: item.content,
              timestamp: new Date().toISOString(), // Use actual timestamp if available
              virality_score: item.virality_score
            }))
          );
          
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <Newspaper className="h-6 w-6 text-blue-600" />
        <h1 className="text-3xl font-bold">Today's AI News</h1>
      </div>

      <div className="space-y-6">
        {news.length === 0 ? (
          <p className="text-gray-600">Loading news...</p>
        ) : (
          news.map((item) => (
            <article key={item.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Tag className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">{item.category}</span> {/* Replace with actual category {item.category} */}
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <Clock className="h-4 w-4" />
                  <time className="text-sm">
                    {new Date(item.timestamp).toLocaleString()}
                  </time>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
              <p className="text-gray-600">{item.summary}</p>
              
              <div className="mt-4">
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  Read more →
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
