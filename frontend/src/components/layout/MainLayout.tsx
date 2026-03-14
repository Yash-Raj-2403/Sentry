import React, { useState } from 'react';
import { 
  ShieldAlert, Server, Shield, FileText, Settings, LogOut, 
  LayoutDashboard, Menu, Search, Bell, User, ChevronDown, X 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

function Sidebar({ active, onClose }: { active: string, onClose?: () => void }) {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard', path: '/dashboard' },
    { icon: ShieldAlert, label: 'Incidents', id: 'incidents', path: '/incidents' },
    { icon: Server, label: 'Network', id: 'network', path: '/network' },
    { icon: Shield, label: 'Agents', id: 'agents', path: '/agents' },
    { icon: FileText, label: 'Reports', id: 'reports', path: '/reports' },
    { icon: Settings, label: 'Settings', id: 'settings', path: '/settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-black/40 backdrop-blur-xl border-r border-white/5 z-50 flex flex-col h-full">
      <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
        <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Shield size={18} className="text-white" />
            </div>
            <span className="ml-3 font-bold text-lg tracking-tight text-white">CyberHelm</span>
        </div>
        {onClose && (
            <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
                <X size={24} />
            </button>
        )}
      </div>

      <nav className="flex-1 py-8 flex flex-col gap-2 px-3 overflow-y-auto">
        {menuItems.map((item) => {
           const isActive = active === item.id || (active === '' && item.id === 'dashboard');
           return (
            <Link
                key={item.id}
                to={item.path}
                onClick={onClose}
                className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                isActive
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
            >
                {isActive && (
                    <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-cyan-500/5"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
                <item.icon size={20} className={cn("relative z-10", isActive ? "animate-pulse-subtle" : "group-hover:scale-110 transition-transform")} />
                <span className="font-medium relative z-10">{item.label}</span>
                {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] relative z-10" />
                )}
            </Link>
           );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 shrink-0">
        <button className="flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const activeRoute = location.pathname.substring(1) || 'dashboard';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#05050A] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
            <>
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                />
                <motion.div
                    initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed inset-y-0 left-0 z-50 lg:hidden"
                >
                    <Sidebar active={activeRoute} onClose={() => setSidebarOpen(false)} />
                </motion.div>
            </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar active={activeRoute} />
      </div>

      <div className="lg:pl-64 min-h-screen flex flex-col relative z-10 transition-all duration-300">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 px-4 md:px-8 py-4 flex items-center justify-between backdrop-blur-md bg-[#05050A]/80 border-b border-white/5 h-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-400 hover:text-white">
                <Menu size={24} />
            </button>
            <div className="flex flex-col">
                <h1 className="text-xl font-bold text-white tracking-tight capitalize">{activeRoute}</h1>
                <p className="text-xs text-gray-500 hidden md:block">System Status: Optimal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative hidden md:block group">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-cyan-400 transition-colors" />
                 <input 
                    type="text" 
                    placeholder="Search intelligence..." 
                    className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all w-48 md:w-64 text-gray-300 placeholder:text-gray-600"
                 />
             </div>
             
             <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors text-gray-400 hover:text-white">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#05050A]" />
             </button>

             <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 p-[1px]">
                    <div className="w-full h-full rounded-full bg-[#05050A] flex items-center justify-center overflow-hidden">
                        <User size={16} className="text-cyan-400" />
                    </div>
                </div>
                <div className="hidden md:block text-sm">
                    <p className="font-semibold text-white leading-none">Admin</p>
                    <p className="text-xs text-gray-500 mt-0.5">Level 5</p>
                </div>
                <ChevronDown size={14} className="text-gray-500 hidden md:block" />
             </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
            {children}
        </main>
      </div>
    </div>
  );
}