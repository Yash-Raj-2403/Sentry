import React, { useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import { ShieldCheck, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate();

    const onLoad = (spline) => {
        setLoaded(true);
    };

    return (
        <div className="relative w-screen h-screen bg-[#0d0d11] text-white overflow-hidden font-sans">
            
            {/* Header / Navbar */}
            <header className="absolute top-0 left-0 w-full flex justify-between items-center p-8 z-50">
                {/* Left: Project Title */}
                <div className="flex items-center gap-4 select-none px-5 py-3 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl transition-transform hover:scale-105 duration-300">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-lg blur opacity-75"></div>
                        <div className="relative w-10 h-10 bg-gradient-to-tr from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg border border-white/20">
                            <ShieldCheck size={22} className="text-white" strokeWidth={2.5} />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black tracking-widest uppercase text-white font-sans leading-none drop-shadow-sm">
                            CyberHelm
                        </h1>
                        <span className="text-[0.65rem] font-bold tracking-[0.2em] text-purple-300 uppercase opacity-80">
                            Sentry System
                        </span>
                    </div>
                </div>

                {/* Right: Login Access */}
                <button 
                    onClick={() => navigate('/login')}
                    className="group relative px-6 py-2 rounded-full border border-white/10 bg-black/60 backdrop-blur-md shadow-xl transition-all hover:bg-black/80 hover:border-purple-500/50 hover:shadow-purple-500/20 flex items-center gap-2 overflow-hidden"
                >
                    <div className="absolute inset-0 w-0 bg-gradient-to-r from-purple-600/40 to-blue-600/40 transition-all duration-300 group-hover:w-full"></div>
                    <span className="relative z-10 font-medium tracking-wide text-white">Access Portal</span>
                    <Lock size={16} className="relative z-10 text-purple-400 group-hover:text-purple-300 transition-colors" />
                </button>
            </header>

            {/* Spline Background Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div style={{ 
                    width: 'calc(100% + 300px)', 
                    height: 'calc(100% + 300px)', 
                    transform: 'translate(-150px, -150px)',
                    position: 'relative'
                }}>
                    <Spline 
                        scene="https://prod.spline.design/4qRO9S4kaptqjRXc/scene.splinecode" 
                        onLoad={onLoad}
                        className={!loaded ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
                
                {/* Loading State */}
                {!loaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0d0d11] z-20">
                        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
            
            <LogoRemover />
        </div>
    )
}

const LogoRemover = () => {
    useEffect(() => {
        const interval = setInterval(() => {
            const logo = document.querySelector('#logo');
            if (logo) logo.remove();
            
            const splineViewers = document.querySelectorAll('spline-viewer');
            splineViewers.forEach(v => {
                 if(v.shadowRoot) {
                     const style = document.createElement('style');
                     style.textContent = '#logo { display: none !important; }';
                     if(!v.shadowRoot.querySelector('style[data-clean]')) {
                         style.setAttribute('data-clean', 'true');
                         v.shadowRoot.appendChild(style);
                     }
                 }
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    return null;
}

export default Landing;