import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [acceptanceKey, setAcceptanceKey] = useState('');
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setMsg('');
        try {
            await axios.post('http://localhost:3000/api/signup', { username, password, email, mobile, acceptanceKey });
            alert('Registration Successful! Please Login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    const handleGenerateKey = async () => {
        try {
            await axios.post('http://localhost:3000/api/request-key');
            alert('The acceptance key is generated please contact admin');
        } catch (err) {
            alert('Failed to generate key request.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <div className="w-full max-w-md p-8 backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20">
                <div className="flex justify-center mb-6">
                    <img src={logo} alt="Company Logo" className="h-24 w-auto drop-shadow-lg" />
                </div>
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6 text-center">
                    Create Account
                </h2>
                {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">{error}</div>}
                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-500"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-500"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Mobile Number</label>
                        <input
                            type="tel"
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-500"
                            placeholder="Enter mobile number"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-500"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-300">Acceptance Key</label>
                            <button type="button" onClick={handleGenerateKey} className="text-xs text-purple-400 hover:text-purple-300 underline cursor-pointer">
                                Generate Key
                            </button>
                        </div>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-500"
                            placeholder="Contact admin for key"
                            value={acceptanceKey}
                            onChange={(e) => setAcceptanceKey(e.target.value)}
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            You must enter a valid key provided by the admin.
                        </p>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-bold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900"
                    >
                        Sign Up
                    </button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
