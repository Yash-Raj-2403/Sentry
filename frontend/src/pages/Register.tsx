import { useState } from 'react';
import {
  Shield, ArrowRight, Lock, Mail, User, Building, AlertCircle, Loader2, CheckCircle2,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password,
      options: {
        data: {
          full_name: formData.name.trim(),
          company: formData.company.trim(),
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Supabase sends an email confirmation by default.
    // If email confirmation is disabled in your project, the user is
    // immediately signed in — navigate directly to dashboard in that case.
    setConfirmed(true);
    setLoading(false);

    // Give the user 2 s to read the confirmation message, then redirect
    setTimeout(() => navigate('/dashboard', { replace: true }), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight mb-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield size={18} className="text-white" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">CyberHelm</span>
          </Link>
          <h2 className="text-2xl font-bold text-white mt-4">Create your account</h2>
          <p className="text-gray-400 mt-2 text-sm">Join the autonomic security revolution today.</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-xl">

          {/* Error banner */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success banner */}
          {confirmed && (
            <div className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span>Account created! Check your email to confirm, then you'll be redirected…</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-950/50 border border-gray-800 text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 pl-10 p-2.5 placeholder-gray-600 transition-all outline-none hover:border-gray-700"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Company</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building size={16} className="text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-gray-950/50 border border-gray-800 text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 pl-10 p-2.5 placeholder-gray-600 transition-all outline-none hover:border-gray-700"
                    placeholder="Acme Inc."
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Work Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-950/50 border border-gray-800 text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 pl-10 p-2.5 placeholder-gray-600 transition-all outline-none hover:border-gray-700"
                  placeholder="name@company.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-gray-950/50 border border-gray-800 text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 pl-10 p-2.5 placeholder-gray-600 transition-all outline-none hover:border-gray-700"
                  placeholder="Create a strong password (min. 6 chars)"
                  minLength={6}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={loading || confirmed}
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-blue-900/20 mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
