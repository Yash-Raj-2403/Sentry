import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'scanner' | 'hexagon' | 'cyber';
  glowColor?: string;
  intensity?: 'low' | 'medium' | 'high';
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, variant = 'default', glowColor = '#3b82f6', intensity = 'medium', ...props }, ref) => {
    
    const glowMap = {
      low: '0 0 10px -5px',
      medium: '0 0 25px -5px',
      high: '0 0 50px -10px',
    };

    const borderGlow = {
      low: `1px solid ${glowColor}20`,
      medium: `1px solid ${glowColor}40`,
      high: `1px solid ${glowColor}80`,
    };

    const baseStyles = "relative bg-black/40 backdrop-blur-xl transition-all duration-300 overflow-hidden";
    
    const variants = {
      default: "rounded-2xl border border-white/10",
      scanner: "rounded-lg border-x-2 border-x-transparent border-y border-y-white/10 clip-path-polygon-[0_0,100%_0,100%_100%,0_100%] before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:via-white/5 before:to-transparent before:animate-scan",
      hexagon: "clip-path-hexagon bg-black/60", // Requires custom clip-path in CSS or inline
      cyber: "rounded-none border border-white/10 before:absolute before:-top-1 before:-left-1 before:w-3 before:h-3 before:border-t-2 before:border-l-2 before:border-white/50 after:absolute after:-bottom-1 after:-right-1 after:w-3 after:h-3 after:border-b-2 after:border-r-2 after:border-white/50",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        style={{
          boxShadow: `${glowMap[intensity]} ${glowColor}40`,
          borderColor: variant === 'default' ? `${glowColor}30` : undefined
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ 
          y: -5,
          boxShadow: `${glowMap[intensity]} ${glowColor}80` 
        }}
        {...props}
      >
        {/* Glow Gradient Overlay */}
        <div 
            className="absolute -inset-[100%] pointer-events-none opacity-20 mix-blend-overlay"
            style={{
                background: `radial-gradient(circle at 50% 50%, ${glowColor}, transparent 60%)`
            }}
        />
        
        {/* Helper decoration for cyber variant */}
        {variant === 'cyber' && (
            <>
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/10 rounded-bl-lg" />
            </>
        )}

        <div className="relative z-10">
            {children}
        </div>
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
