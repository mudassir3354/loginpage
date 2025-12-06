import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Sparkles } from 'lucide-react';
import qrCode from '../assets/qr_code.png';

const Donate = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="relative bg-white/5 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl max-w-lg w-full text-center overflow-hidden"
            >
                {/* Background decorative elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl"></div>

                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
                        <Sparkles className="text-white" size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Support Us</h1>
                    <p className="text-gray-400 mb-8 text-lg">Your contribution helps us grow.</p>
                </motion.div>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="relative group mb-10 inline-block"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative p-4 bg-white rounded-xl">
                        <img src={qrCode} alt="Donation QR Code" className="w-56 h-56 object-contain" />
                    </div>
                </motion.div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400 bg-white/5 py-2 rounded-lg border border-white/5">
                        <CreditCard size={14} />
                        <span>Scan with any UPI app</span>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/dashboard')}
                        className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-xl border border-white/10 transition-all"
                    >
                        <ArrowLeft size={18} />
                        Back to Dashboard
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default Donate;
