import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, Menu, X, ArrowRight, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Incidents', to: '/incidents' },
  { label: 'Agents',    to: '/agents'    },
  { label: 'Reports',   to: '/reports'   },
];

export default function Header() {
  const [scrolled,       setScrolled]       = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen,   setUserMenuOpen]   = useState(false);

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

  const displayName = (user?.user_metadata?.full_name as string | undefined)
    ?? user?.email?.split('@')[0]
    ?? 'User';

  const avatarInitials = displayName
    .split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <header
      className="fixed top-0 w-full z-50 transition-all duration-300"
      style={{
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        background: scrolled
          ? 'rgba(8,8,24,0.85)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        padding: scrolled ? '14px 0' : '22px 0',
      }}>

      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 0 20px rgba(99,102,241,0.35)',
            }}>
            <ShieldCheck size={18} className="text-white" />
          </div>
          <span className="text-[18px] font-extrabold tracking-tight" style={{ color: '#e8ecff' }}>
            CyberHelm
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, to }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to}
                className="relative px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200"
                style={{
                  color: active ? '#e8ecff' : 'rgba(160,165,210,0.6)',
                  background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
                  border: active ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = '#e8ecff';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = 'rgba(160,165,210,0.6)';
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }
                }}>
                {label}
                {active && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                    style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(210,215,240,0.85)',
                }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  {avatarInitials}
                </div>
                <span className="text-[13px] font-medium max-w-[130px] truncate">{displayName}</span>
                <ChevronDown size={13} style={{ opacity: 0.5, transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden shadow-xl"
                  style={{ background: 'rgba(12,12,30,0.98)', border: '1px solid rgba(255,255,255,0.09)', backdropFilter: 'blur(20px)' }}>
                  <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="text-[12px] font-semibold truncate" style={{ color: '#e8ecff' }}>{displayName}</p>
                    <p className="text-[11px] truncate mt-0.5" style={{ color: 'rgba(120,125,175,0.6)' }}>{user.email}</p>
                  </div>
                  <button onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] transition-colors"
                    style={{ color: '#f43f5e' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(244,63,94,0.08)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
                    <LogOut size={13} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-[13px] font-semibold transition-colors"
                style={{ color: 'rgba(160,165,210,0.7)' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#e8ecff')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(160,165,210,0.7)')}>
                Log in
              </Link>
              <Link to="/register"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all duration-200 hover:scale-[1.03]"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  boxShadow: '0 0 20px -4px rgba(99,102,241,0.5)',
                }}>
                Get Started
                <ArrowRight size={14} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden p-2 rounded-xl transition-colors"
          style={{ color: 'rgba(180,185,220,0.8)', background: 'rgba(255,255,255,0.04)' }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full p-6 md:hidden shadow-xl"
          style={{ background: 'rgba(8,8,24,0.98)', borderBottom: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}>
          <nav className="flex flex-col gap-1 mb-6">
            {NAV_LINKS.map(({ label, to }) => (
              <Link key={to} to={to}
                className="px-4 py-3 rounded-xl text-[15px] font-semibold transition-colors"
                style={{
                  color: location.pathname === to ? '#e8ecff' : 'rgba(160,165,210,0.65)',
                  background: location.pathname === to ? 'rgba(99,102,241,0.1)' : 'transparent',
                }}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="border-t pt-5" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            {user ? (
              <button onClick={handleSignOut}
                className="flex items-center gap-2 text-[15px] font-semibold"
                style={{ color: '#f43f5e' }}>
                <LogOut size={16} /> Sign out
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" className="text-[15px] font-semibold"
                  style={{ color: 'rgba(160,165,210,0.7)' }}>Log in</Link>
                <Link to="/register"
                  className="w-full py-3.5 rounded-xl font-bold text-white text-[15px] flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  Get Started <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
