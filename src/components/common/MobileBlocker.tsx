import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

export const MobileBlocker: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Check if width is less than standard tablet landscape (1024px) or iPad portrait (768px)
      // For a complex 3D simulation game, we probably want at least iPad portrait width.
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <AnimatePresence>
      {isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030305] text-[#f5f5f7] p-8"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500 blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500 blur-[120px]" />
          </div>

          <div className="relative z-10 flex flex-col items-center max-w-md text-center">
            {/* Icons row */}
            <div className="flex items-center justify-center gap-6 mb-8 text-white/50">
              <Smartphone className="w-10 h-10 text-rose-500" />
              <div className="text-xl">➔</div>
              <Tablet className="w-12 h-12 text-emerald-400" />
              <Monitor className="w-14 h-14 text-emerald-400" />
            </div>

            <h1 className="text-3xl font-bold mb-4 tracking-tight">Screen Too Small</h1>
            
            <p className="text-lg text-slate-300 mb-6 leading-relaxed">
              NASA MissionForge is a complex 3D engineering simulation that requires a larger display.
            </p>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
              <p className="text-sm text-slate-400 mb-2 uppercase tracking-widest font-mono">Recommended Devices</p>
              <ul className="text-left text-slate-200 space-y-3 font-medium">
                <li className="flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-sky-400" /> Desktop / Laptop (Optimal)
                </li>
                <li className="flex items-center gap-3">
                  <Tablet className="w-5 h-5 text-emerald-400" /> Tablet (Landscape mode)
                </li>
              </ul>
            </div>

            <p className="text-xs text-slate-500 font-mono tracking-wider uppercase">
              Please switch to a larger device to continue your mission.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
