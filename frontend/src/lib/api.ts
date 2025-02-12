import { supabase } from './supabase';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface RegisterPayload {
  name: string;
  email: string;
  preferredPlatform: string;
  topics: {
    [key: string]: boolean;
  };
}

interface NewsArticle {
  id: number;
  title: string;
  category: string;
  summary: string;
  timestamp: string;
}

export const api = {
  // Register user with external API
  async registerUser(userData: RegisterPayload) {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to register with news service');
    }

    return response.json();
  },

  // Fetch news articles
  async getNews(): Promise<NewsArticle[]> {
    const response = await fetch(`${API_BASE_URL}/news`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    return response.json();
  },
};