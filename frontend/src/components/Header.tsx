import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, Menu, X, ArrowRight, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Incidents', to: '/incidents' },
  { label: 'Agents', to: '/agents' },
  { label: 'Reports', to: '/reports' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  // Derive a short display name from the session
  const displayName = user?.user_metadata?.full_name as string | undefined
    ?? user?.email?.split('@')[0]
    ?? 'User';

  const avatarInitials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled
        ? 'bg-[#030305]/80 backdrop-blur-md border-white/10 py-4 shadow-lg shadow-blue-900/5'
        : 'bg-transparent border-transparent py-6'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white overflow-hidden shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform duration-300">
            <ShieldCheck size={20} className="relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">CyberHelm</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm font-medium transition-colors ${location.pathname === to ? 'text-cyan-400' : 'text-gray-400 hover:text-white'
                }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop right section */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            /* ── Signed-in user menu ── */
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-white text-sm"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                  {avatarInitials}
                </div>
                <span className="max-w-[130px] truncate font-medium">{displayName}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-[#0c0c18]/95 border border-white/10 rounded-2xl shadow-xl backdrop-blur-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/8">
                    <p className="text-xs font-semibold text-white truncate">{displayName}</p>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">{user.email}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── Signed-out (public) buttons ── */
            <>
              <Link to="/login" className="text-sm font-bold text-gray-300 hover:text-white transition-colors">
                Log in
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-200 transition-all shadow-lg shadow-white/5 flex items-center gap-2 group"
              >
                Get Started
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </>
          )}
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
        <div className="absolute top-full left-0 w-full bg-black/95 border-b border-white/10 p-6 md:hidden shadow-xl backdrop-blur-xl h-screen">
          <nav className="flex flex-col gap-4 mb-6">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`text-lg font-medium transition-colors ${location.pathname === to ? 'text-cyan-400' : 'text-gray-300 hover:text-white'
                  }`}
              >
                {label}
              </Link>
            ))}
            <hr className="border-white/10 my-2" />
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-lg font-medium text-red-400 hover:text-red-300 text-left"
              >
                <LogOut size={18} /> Sign out
              </button>
            ) : (
              <Link to="/login" className="text-lg font-bold text-gray-300 hover:text-white">
                Log in
              </Link>
            )}
          </nav>
          {!user && (
            <Link
              to="/register"
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20 text-lg"
            >
              Get Started <ArrowRight size={18} />
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
