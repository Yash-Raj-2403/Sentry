import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Menu, X, ArrowRight } from 'lucide-react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-[#030305]/80 backdrop-blur-md border-white/10 py-4 shadow-lg shadow-blue-900/5' 
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white overflow-hidden shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform duration-300">
             <ShieldCheck size={20} className="relative z-10" />
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Sentry.ai</span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Platform</Link>
          <Link to="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Solutions</Link>
          <Link to="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Developers</Link>
          <Link to="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Pricing</Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-sm font-bold text-gray-300 hover:text-white transition-colors">
            Log in
          </Link>
          <Link to="/register" className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-200 transition-all shadow-lg shadow-white/5 flex items-center gap-2 group">
            Get Started
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-black/95 border-b border-white/10 p-6 md:hidden shadow-xl animate-in slide-in-from-top-2 duration-200 backdrop-blur-xl h-screen">
          <nav className="flex flex-col gap-4 mb-6">
            <Link to="#" className="text-lg font-medium text-gray-300 hover:text-white">Platform</Link>
            <Link to="#" className="text-lg font-medium text-gray-300 hover:text-white">Solutions</Link>
            <Link to="#" className="text-lg font-medium text-gray-300 hover:text-white">Developers</Link>
            <Link to="#" className="text-lg font-medium text-gray-300 hover:text-white">Pricing</Link>
            <hr className="border-white/10 my-2" />
            <Link to="/login" className="text-lg font-bold text-gray-300 hover:text-white">Log in</Link>
          </nav>
          <Link to="/register" className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20 text-lg">
            Get Started <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </header>
  );
}
