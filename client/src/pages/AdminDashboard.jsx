import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function AdminDashboard() {
    const [keys, setKeys] = useState([]);
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('keys'); // keys, users, updates
    const navigate = useNavigate();

    useEffect(() => {
        fetchKeys();
        fetchUsers();
    }, []);

    const fetchKeys = async () => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/admin-login');

        try {
            const res = await axios.get('http://localhost:3000/api/admin/keys', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setKeys(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('http://localhost:3000/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleBan = async (userId, isBanned) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:3000/api/admin/ban',
                { userId, isBanned: !isBanned },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchUsers(); // Refresh list
        } catch (err) {
            console.error(err);
            alert('Error updating user status');
        }
    };

    const handlePostUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!message.trim()) return;

        try {
            await axios.post('http://localhost:3000/api/admin/updates',
                { content: message },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('');
            alert('Update posted successfully');
        } catch (err) {
            console.error(err);
            alert('Error posting update');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/admin-login');
    };

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <img src={logo} alt="Logo" className="h-16 w-auto" />
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            Admin <span className="text-indigo-500">Dashboard</span>
                        </h1>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-gray-800 rounded-lg p-1 flex">
                            <button onClick={() => setActiveTab('keys')} className={`px-4 py-2 rounded-md ${activeTab === 'keys' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}>Keys</button>
                            <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-md ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}>Users</button>
                            <button onClick={() => setActiveTab('updates')} className={`px-4 py-2 rounded-md ${activeTab === 'updates' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}>Updates</button>
                        </div>
                        <button onClick={handleLogout} className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/50 rounded-lg hover:bg-red-600/30 transition-colors">
                            Logout
                        </button>
                    </div>
                </div>

                {activeTab === 'keys' && (
                    <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
                        <div className="p-6 border-b border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-200">Acceptance Keys</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-900/50 text-gray-400 text-sm uppercase tracking-wider">
                                        <th className="px-6 py-4">Key Code</th>
                                        <th className="px-6 py-4">Used By</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Created At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700 text-gray-300">
                                    {keys.map((key) => (
                                        <tr key={key.id} className="hover:bg-gray-700/50">
                                            <td className="px-6 py-4 font-mono text-cyan-400">{key.key_value}</td>
                                            <td className="px-6 py-4">
                                                {key.is_used ? (
                                                    <div>
                                                        <div className="font-bold">{key.used_by_username}</div>
                                                        <div className="text-xs text-gray-400">{key.used_by_email}</div>
                                                    </div>
                                                ) : <span className="italic text-gray-500">Unclaimed</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs border ${key.is_used ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                                                    {key.is_used ? 'Used' : 'Active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{new Date(key.created_at).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
                        <div className="p-6 border-b border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-200">User Management</h3>
                        </div>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-900/50 text-gray-400 text-sm uppercase tracking-wider">
                                    <th className="px-6 py-4">Username</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700 text-gray-300">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-700/50">
                                        <td className="px-6 py-4">{user.username}</td>
                                        <td className="px-6 py-4">{user.email || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs border ${user.is_banned ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                                                {user.is_banned ? 'Banned' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleBan(user.id, user.is_banned)}
                                                className={`px-3 py-1 rounded text-sm ${user.is_banned ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white transition`}
                                            >
                                                {user.is_banned ? 'Unban' : 'Ban'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'updates' && (
                    <div className="bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-200 mb-4">Post Global Update</h3>
                        <form onSubmit={handlePostUpdate}>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-white resize-none h-32 focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="Write a message to all users..."
                            ></textarea>
                            <div className="mt-4 flex justify-end">
                                <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                                    Post Update
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
