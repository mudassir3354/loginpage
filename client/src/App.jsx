import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Donate from './pages/Donate';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-cyan-500 selection:text-white">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/donate" element={<Donate />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
