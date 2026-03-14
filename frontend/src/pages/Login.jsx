import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, User, Lock, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5, 
        ease: "easeOut",
        staggerChildren: 0.1 
      }
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen w-full bg-[#0d0d11] text-white flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse duration-[10s]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse duration-[15s]"></div>
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors z-20 group"
      >
        <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} />
        </div>
        <span className="text-sm font-medium tracking-wide">Return to Sentry</span>
      </motion.button>

      {/* Login Card */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-md mx-4 relative z-10"
      >
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-purple-900/20">
            
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
                    <ShieldCheck size={32} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
                    Sentry Login
                </h2>
                <p className="text-neutral-500 mt-2 text-sm">Authenticate to access the CyberHelm dashboard</p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
                
                <motion.div variants={itemVariants}>
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider ml-1 mb-2 block">
                        Identity
                    </label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                        <input 
                            type="email" 
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-12 py-3.5 outline-none focus:border-purple-500/50 focus:bg-white/10 focus:ring-4 focus:ring-purple-500/10 transition-all placeholder:text-neutral-600 text-sm font-medium"
                            placeholder="agent@cyberhelm.io"
                        />
                    </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider ml-1">
                            Passcode
                        </label>
                        <a href="#" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Forgot?</a>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                        <input 
                            type={showPassword ? "text" : "password"}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-12 py-3.5 outline-none focus:border-purple-500/50 focus:bg-white/10 focus:ring-4 focus:ring-purple-500/10 transition-all placeholder:text-neutral-600 text-sm font-medium"
                            placeholder="••••••••••••"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="pt-2">
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                        className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-bold text-sm tracking-wide shadow-lg shadow-purple-900/25 hover:shadow-purple-900/40 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Authenticating...
                            </>
                        ) : (
                            "Access System"
                        )}
                    </motion.button>
                </motion.div>

            </form>

            {/* Footer */}
            <motion.div variants={itemVariants} className="mt-8 text-center">
                <p className="text-xs text-neutral-600">
                    Protected by CyberHelm Sentry v2.4. Unauthorized access is prohibited.
                </p>
            </motion.div>
        
        </div>
      </motion.div>
    </div>
  );
};

export default Login;