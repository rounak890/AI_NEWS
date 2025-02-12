import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    preferredPlatform: 'email',
    topics: {
      general: true,
      research: false,
      business: false,
      ethics: false,
    },
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        topics: {
          ...formData.topics,
          [name]: checked,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        // Handle successful response
        console.log('Registration successful');
        alert('Registration successful! Please check your email to confirm your account.');
         // Redirect to home page -------------------------- TO BE DONE
      } else {
        // Handle error response
        console.error('Registration failed');
        alert('An error occurred during registration. TRY AGAIN AFTER SOME TIME');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during registration.TRY AGAIN AFTER SOME TIME');
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
            name="name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Preferred Platform</label>
          <select
            name="preferredPlatform"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.preferredPlatform}
            onChange={handleChange}
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
                  name={topic}
                  checked={checked}
                  onChange={handleChange}
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
};

export default Register;