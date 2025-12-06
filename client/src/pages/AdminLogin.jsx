import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:3000/api/login', { username, password });
            if (res.data.role !== 'admin') {
                setError('Access denied. Admins only.');
                return;
            }
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            navigate('/admin-dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-black">
            <div className="w-full max-w-md p-8 backdrop-blur-lg bg-black/40 rounded-2xl shadow-2xl border border-indigo-500/30">
                <div className="flex justify-center mb-6">
                    <img src={logo} alt="Logo" className="h-20 w-auto" />
                </div>
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2 text-center">
                    Admin Portal
                </h2>
                <p className="text-gray-400 text-center mb-6 text-sm">Restricted Access</p>

                {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Admin ID</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-gray-900/80 border border-indigo-900/50 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-600"
                            placeholder="Enter admin username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 bg-gray-900/80 border border-indigo-900/50 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-600"
                            placeholder="Enter admin password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900"
                    >
                        Access Database
                    </button>
                </form>
            </div>
        </div>
    );
}
