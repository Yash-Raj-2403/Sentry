import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, ArrowRight, Lock, Mail, User, Building, AlertCircle, Loader2, CheckCircle2, Eye, EyeOff
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { GlassCard } from '../components/ui/GlassCard';

 export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData]   = useState({ name: '', company: '', email: '', password: '' });
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setLoading(true);
    const { error: authError } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password,
      options: { data: { full_name: formData.name.trim(), company: formData.company.trim() } },
    });
    if (authError) { setError(authError.message); setLoading(false); return; }
    setConfirmed(true); setLoading(false);
    setTimeout(() => navigate('/dashboard', { replace: true }), 2000);
  };

  return (
    <div className="min-h-screen w-full flex bg-cyber-dark text-gray-100 relative overflow-hidden font-sans selection:bg-cyan-500/30">
        
       {/* Background Effects */}
       <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03)_0%,transparent_100%)]" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
       </div>

       {/* Left Panel - Hidden on mobile */}
       <div className="hidden lg:flex w-1/2 relative z-10 flex-col justify-between p-12 lg:p-20 border-r border-white/5 bg-black/20 backdrop-blur-sm">
            <Link to="/" className="flex items-center gap-3 w-fit group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                    <Shield className="text-white fill-white/20" size={20} />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">CYBERHELM</span>
            </Link>

            <div className="max-w-lg">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl font-bold leading-tight mb-6"
                >
                    Join the autonomous <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                        security revolution.
                    </span>
                </motion.h1>
                <div className="space-y-6 text-lg text-gray-400">
                    <p>Deploy AI agents that understand your infrastructure and defend it in real-time.</p>
                </div>
            </div>

            <div className="flex gap-4">
                 {/* Decorative elements or testimonials could go here */}
            </div>
       </div>

       {/* Right Panel - Register Form */}
       <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
          <GlassCard className="w-full max-w-[480px] p-8" variant="scanline" intensity="medium">
             
             <div className="text-center mb-8">
                <div className="lg:hidden flex justify-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <Shield className="text-white fill-white/20" size={24} />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                <p className="text-gray-400 text-sm">Start your 14-day free trial. No credit card required.</p>
             </div>

             {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2 animate-pulse">
                    <AlertCircle size={16} />
                    {error}
                </div>
             )}
             
             {confirmed && (
                <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm p-3 rounded-lg flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    Account created! Check your email...
                </div>
             )}

             <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
                            <input 
                                type="text"
                               name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required 
                                placeholder="John Doe"
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Company</label>
                        <div className="relative group">
                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
                            <input 
                                type="text" 
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                required 
                                placeholder="Acme Inc."
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Work Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required 
                            placeholder="name@company.com"
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
                        <input 
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            placeholder="Min. 6 characters" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all pr-11"
                        />
                         <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading || confirmed}
                    className="w-full mt-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <>Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                </button>
             </form>
             
             <p className="text-center text-sm text-gray-500 mt-8">
                 Already have an account? <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">Sign in</Link>
             </p>
          </GlassCard>
       </div>
    </div>
  );
}
