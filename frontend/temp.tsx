import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    preferredPlatform: 'email',
    topics: {
      general: true,
      research: false,
      business: false,
      ethics: false
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: Math.random().toString(36).slice(-8), // Generate random password
      });

      if (error) throw error;

      // Store user preferences
      const { error: profileError } = await supabase
        .from('user_preferences')
        .insert([
          {
            email: formData.email,
            name: formData.name,
            preferred_platform: formData.preferredPlatform,
            topics: formData.topics
          }
        ]);

      if (profileError) throw profileError;

      alert('Registration successful! Please check your email to confirm your account.');
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during registration.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold mb-6">Register for AI News Updates</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Preferred Platform</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.preferredPlatform}
            onChange={(e) => setFormData({...formData, preferredPlatform: e.target.value})}
          >
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="telegram">Telegram</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Topics of Interest</label>
          <div className="space-y-2">
            {Object.entries(formData.topics).map(([topic, checked]) => (
              <label key={topic} className="flex items-center">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setFormData({
                    ...formData,
                    topics: {
                      ...formData.topics,
                      [topic]: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700 capitalize">{topic}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Register
        </button>
      </form>
    </div>
  );
}