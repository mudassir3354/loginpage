import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:3000/api/login', { username, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            localStorage.setItem('username', res.data.username);
            alert('Login Successful!');
            // Default redirects
            if (res.data.role === 'admin') navigate('/admin-dashboard');
            else navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <div className="w-full max-w-md p-8 backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20">
                <div className="flex justify-center mb-6">
                    <img src={logo} alt="Company Logo" className="h-24 w-auto drop-shadow-lg" />
                </div>
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-6 text-center">
                    Welcome Back
                </h2>
                {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">{error}</div>}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-500"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-500"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-900"
                    >
                        Sign In
                    </button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline">
                        Sign up
                    </Link>
                </div>
                <div className="mt-4 text-center text-xs text-gray-500">
                    <Link to="/admin-login" className="hover:text-gray-300">
                        Admin Portal
                    </Link>
                </div>
            </div>
        </div>
    );
}
