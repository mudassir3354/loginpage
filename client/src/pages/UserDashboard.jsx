import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Heart, LogOut, User } from 'lucide-react';

// TypingEffect Component (defined in the same file for simplicity)
const TypingEffect = ({ text, delay = 0 }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            setStarted(true);
        }, delay);
        return () => clearTimeout(startTimeout);
    }, [delay]);

    useEffect(() => {
        if (!started) return;

        let index = 0;
        const timer = setInterval(() => {
            setDisplayedText((prev) => {
                if (index < text.length) {
                    return text.slice(0, index + 1);
                }
                return prev;
            });
            index++;
            if (index >= text.length) clearInterval(timer);
        }, 30); // Typing speed in ms

        return () => clearInterval(timer);
    }, [text, started]);

    return (
        <span className="text-gray-200 leading-relaxed text-lg font-mono">
            {displayedText}
            <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2 h-5 bg-cyan-500 ml-1 translate-y-1"
            />
        </span>
    );
};

const UserDashboard = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = localStorage.getItem('username');
        if (!user) {
            navigate('/login');
            return;
        }
        setUsername(user);

        fetchUpdates();
    }, [navigate]);

    const fetchUpdates = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/updates');
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching updates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        navigate('/login');
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-4 md:p-8 text-white">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-5xl mx-auto space-y-8"
            >
                {/* Header */}
                <motion.header
                    variants={itemVariants}
                    className="flex flex-col md:flex-row justify-between items-center bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl"
                >
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <div className="p-3 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full shadow-lg shadow-cyan-500/20">
                            <User size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-sm text-gray-400 font-medium uppercase tracking-wider">Welcome Back</h2>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                                {username}
                            </h1>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/donate')}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl font-semibold shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-shadow"
                        >
                            <Heart size={18} />
                            <span>Donate</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl font-semibold transition-colors"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </motion.button>
                    </div>
                </motion.header>

                {/* Main Content */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Updates Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Bell className="text-cyan-400" />
                            <h2 className="text-xl font-bold">Latest Updates</h2>
                        </div>

                        {loading ? (
                            <div className="flex justify-center p-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                            </div>
                        ) : messages.length > 0 ? (
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {messages.map((msg, index) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.2 }} // Increased stagger delay for better effect
                                            whileHover={{ scale: 1.02, x: 10 }}
                                            className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl hover:border-cyan-500/30 hover:bg-white/10 transition-all cursor-default group"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-bold rounded-full border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors">
                                                    NEWS
                                                </span>
                                                <span className="text-xs text-gray-500 font-mono">
                                                    {new Date(msg.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="min-h-[3rem]">
                                                {/* Pass delay to start typing after card reveal */}
                                                <TypingEffect text={msg.content} delay={(index * 200) + 500} />
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="text-center p-12 bg-white/5 rounded-xl border border-white/5 border-dashed text-gray-500">
                                No updates available yet.
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Stats / Extra (Visual Filler for now) */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-xl border border-white/10 p-6 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <h3 className="text-lg font-bold mb-4 relative z-10">Community Goal</h3>
                            <div className="h-4 bg-black/50 rounded-full overflow-hidden mb-2 relative z-10">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '75%' }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                />
                            </div>
                            <p className="text-sm text-gray-400 flex justify-between relative z-10">
                                <span>Progress</span>
                                <span className="text-white font-bold">75%</span>
                            </p>
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-white/10 p-6 rounded-2xl"
                        >
                            <h3 className="text-lg font-bold text-orange-200 mb-2">Support the project</h3>
                            <p className="text-sm text-gray-400 mb-4">Your contributions help us keep the servers running and updates coming!</p>
                            <button
                                onClick={() => navigate('/donate')}
                                className="w-full py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 rounded-lg border border-orange-500/30 transition-colors"
                            >
                                Contribute Now
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default UserDashboard;
