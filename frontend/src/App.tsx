import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TodayNews from './pages/TodayNews';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Deregister from './pages/Deregister';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/today" element={<TodayNews />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/deregister" element={<Deregister />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;