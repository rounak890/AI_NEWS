import React, { useState } from 'react';

const Deregister = () => {
  const [email, setEmail] = useState('');
  const [confirm, setConfirm] = useState(false);
  
  const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confirm) {
      alert('Please confirm that you want to deregister.');
      return;
    }
    try {
        // console.log(JSON.stringify({ email }));
      const response = await fetch(`${API_BASE_URL}/deregister`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        alert('You have been successfully deregistered.');
        setEmail('');
        setConfirm(false);
      } else {
        alert('An error occurred during deregistration. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during deregistration. Please try again later.');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold mb-6">Deregister from AI News Updates</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="confirm"
            checked={confirm}
            onChange={() => setConfirm(!confirm)}
            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
          />
          <label htmlFor="confirm" className="ml-2 text-gray-700">I confirm that I want to deregister.</label>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Deregister
        </button>
      </form>
    </div>
  );
};

export default Deregister;
