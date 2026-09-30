import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  Globe2, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  X, 
  MapPin, 
  AlertTriangle,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface StoryPrologueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartExodus: () => void;
}

export const StoryPrologueModal: React.FC<StoryPrologueModalProps> = ({
  isOpen,
  onClose,
  onStartExodus
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        className="w-full max-w-2xl bg-space-950 border-2 border-emerald-500/70 rounded-3xl shadow-2xl overflow-hidden ring-4 ring-emerald-500/20 flex flex-col max-h-[90vh]"
      >
        {/* Banner with Dramatic Sci-Fi Header */}
        <div className="p-6 bg-gradient-to-r from-red-950 via-space-900 to-emerald-950 border-b border-slate-800 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>OPERATION EXODUS // TRANSMISSION DECRYPTED</span>
            </span>
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-1 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide">
            THE EXODUS TO NEW EDEN 🌿
          </h2>
          <p className="text-xs text-slate-300 font-mono mt-1">
            Year 2184 // From the Ashes of Earth & the Dunes of Mars
          </p>
        </div>

        {/* Story Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
          {/* Chapter 1: The Fall */}
          <div className="p-4 rounded-2xl bg-red-950/30 border border-red-800/40 flex items-start gap-3">
            <span className="text-2xl shrink-0">🌍💥</span>
            <div>
              <h4 className="font-bold text-red-300 font-display text-sm mb-1">
                Chapter 1: The Fall of Earth
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                Six decades ago, Earth's biosphere collapsed beneath runaway climate disasters. The survivors evacuated to the <strong>Ares Underground Colonies on Mars</strong>, seeking temporary shelter beneath the red dust.
              </p>
            </div>
          </div>

          {/* Chapter 2: The Mars Crisis */}
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 flex items-start gap-3">
            <span className="text-2xl shrink-0">🔴⚠️</span>
            <div>
              <h4 className="font-bold text-amber-300 font-display text-sm mb-1">
                Chapter 2: The Martian Clocks Run Out
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                Mars was never meant to be permanent. Today, the Martian georeactors and life-support domes are degrading. With atmosphere leakage increasing and groundwater depleted, humanity is facing extinction.
              </p>
            </div>
          </div>

          {/* Chapter 3: The Discovery of New Eden */}
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-600/50 flex items-start gap-3">
            <span className="text-2xl shrink-0">🌱✨</span>
            <div>
              <h4 className="font-bold text-emerald-300 font-display text-sm mb-1">
                Chapter 3: The Beacon — "New Eden"
              </h4>
              <p className="text-slate-200 text-xs leading-relaxed">
                Last month, the Deep Horizon Space Telescope locked onto a miracle: <strong>NEW EDEN (Proxima b)</strong>. High-resolution spectrographs confirm vast liquid oceans, a breathable nitrogen-oxygen atmosphere, and lush green vegetation!
              </p>
            </div>
          </div>

          {/* Player Mission Objective */}
          <div className="p-4 rounded-2xl bg-space-900 border border-nasa-cyan/40">
            <div className="flex items-center gap-2 text-nasa-cyan font-mono font-bold text-xs mb-2">
              <Rocket className="w-4 h-4" />
              <span>YOUR ORDERS, CHIEF FLIGHT COMMANDER:</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-200 font-sans list-disc list-inside">
              <li><strong>Design the Starship:</strong> Balance colony seeds, radiation shields, nuclear power, and propulsion in the Hangar.</li>
              <li><strong>Launch from Mars:</strong> Pilot the launch ascent through the Martian atmosphere and discard spent boosters.</li>
              <li><strong>Fly in 3D Cockpit:</strong> Steer through asteroid belts, manage cruise speed, and repel radiation flares.</li>
              <li><strong>Land on New Eden:</strong> Fire retro-thrusters to touch down safely and plant humanity's first new settlement!</li>
            </ul>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-5 bg-space-900 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-mono text-xs cursor-pointer"
          >
            DISMISS
          </button>

          <button
            onClick={() => {
              sounds.playSuccess();
              onStartExodus();
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer ring-2 ring-emerald-300"
          >
            <span>ACCEPT MISSION & ENTER HANGAR</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
