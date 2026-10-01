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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl select-none font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="w-full max-w-2xl bg-[#121217] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Operation Exodus · Mission Prologue</span>
            </span>
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="font-semibold text-2xl text-white tracking-tight">
            The Exodus to New Eden
          </h2>
          <p className="text-xs text-[#86868b] mt-1">
            Year 2184 · From the Ashes of Earth & the Dunes of Mars
          </p>
        </div>

        {/* Story Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Chapter 1: The Fall */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
            <span className="text-2xl shrink-0">🌍</span>
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">
                Chapter 1 · The Fall of Earth
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                Six decades ago, Earth's biosphere collapsed beneath runaway ecological crises. The survivors evacuated to the <strong>Ares Underground Colonies on Mars</strong>, seeking temporary shelter beneath the red dust.
              </p>
            </div>
          </div>

          {/* Chapter 2: The Mars Crisis */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
            <span className="text-2xl shrink-0">🪐</span>
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">
                Chapter 2 · The Martian Clocks Run Out
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                Mars was never meant to be permanent. Today, the Martian georeactors and life-support domes are degrading. With atmosphere leakage increasing and groundwater depleted, humanity is facing extinction.
              </p>
            </div>
          </div>

          {/* Chapter 3: The Discovery of New Eden */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
            <span className="text-2xl shrink-0">🌱</span>
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">
                Chapter 3 · The Beacon: New Eden
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                Last month, the Deep Horizon Space Telescope locked onto a miracle: <strong>New Eden (Proxima b)</strong>. High-resolution spectrographs confirm vast liquid oceans, a breathable nitrogen-oxygen atmosphere, and fertile soil.
              </p>
            </div>
          </div>

          {/* Player Mission Objective */}
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
            <div className="flex items-center gap-2 text-[#0071e3] dark:text-blue-400 font-semibold text-xs mb-2">
              <Rocket className="w-4 h-4" />
              <span>Directives for Chief Flight Commander:</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
              <li><strong>Design the Starship:</strong> Balance colony seeds, radiation shields, nuclear power, and propulsion in the Hangar.</li>
              <li><strong>Launch from Mars:</strong> Pilot the launch ascent through the Martian atmosphere and discard spent boosters.</li>
              <li><strong>Fly in 3D Cockpit:</strong> Steer through asteroid belts, manage cruise speed, and repel radiation flares.</li>
              <li><strong>Land on New Eden:</strong> Fire retro-thrusters to touch down safely and plant humanity's first new settlement.</li>
            </ul>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-5 bg-white/[0.02] border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 text-slate-300 text-xs font-medium cursor-pointer transition-colors"
          >
            Dismiss
          </button>

          <button
            onClick={() => {
              sounds.playSuccess();
              onStartExodus();
            }}
            className="px-6 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <span>Accept Mission & Enter Hangar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
