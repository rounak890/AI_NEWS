import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Settings, Bell, Layout } from 'lucide-react';

export default function Dashboard() {
  const [preferences, setPreferences] = useState({
    name: '',
    email: '',
    preferredPlatform: 'email',
    topics: {
      general: true,
      research: false,
      business: false,
      ethics: false
    },
    format: 'detailed',
    frequency: 'daily'
  });

  useEffect(() => {
    loadUserPreferences();
  }, []);

  const loadUserPreferences = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('email', user.email)
        .single();

      if (error) {
        console.error('Error loading preferences:', error);
        return;
      }

      if (data) {
        setPreferences(data);
      }
    }
  };

  const savePreferences = async () => {
    const { error } = await supabase
      .from('user_preferences')
      .update(preferences)
      .eq('email', preferences.email);

    if (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences');
    } else {
      alert('Preferences saved successfully');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Settings className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Dashboard Settings</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Delivery Platform</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={preferences.preferredPlatform}
                onChange={(e) => setPreferences({...preferences, preferredPlatform: e.target.value})}
              >
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="telegram">Telegram</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Content Format</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={preferences.format}
                onChange={(e) => setPreferences({...preferences, format: e.target.value})}
              >
                <option value="detailed">Detailed</option>
                <option value="summary">Summary</option>
                <option value="bullet-points">Bullet Points</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Delivery Frequency</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={preferences.frequency}
                onChange={(e) => setPreferences({...preferences, frequency: e.target.value})}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                {/* <option value="instant">Instant (Breaking News)</option> */}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Topics</label>
            <div className="space-y-2">
              {Object.entries(preferences.topics).map(([topic, checked]) => (
                <label key={topic} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      topics: {
                        ...preferences.topics,
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
        </div>

        <div className="mt-6">
          <button
            onClick={savePreferences}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}