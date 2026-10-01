import React from 'react';
import { motion } from 'framer-motion';
import { sounds } from '../../utils/soundEffects';

interface KidHowToPlaySectionProps {
  onPlayNow: () => void;
  onSelectPreset?: (presetName: string) => void;
}

export const KidHowToPlaySection: React.FC<KidHowToPlaySectionProps> = ({ 
  onPlayNow,
  onSelectPreset 
}) => {
  return (
    <section className="w-full max-w-5xl mx-auto my-12 px-4 sm:px-6">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#0071e3] dark:text-blue-400 text-xs font-medium mb-3">
          <span>Flight Instructions</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          How to Play in 3 Simple Steps
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Assemble your spacecraft in the orbital hangar, pilot through interplanetary space, and execute retrograde landing on New Eden.
        </p>
      </div>

      {/* Modern Asymmetric Card Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        {/* Step 1 & Step 2 (Left Column) */}
        <div className="md:col-span-7 space-y-4">
          {/* Step 01 */}
          <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#121217]/75 border border-black/5 dark:border-white/10 backdrop-blur-xl text-left shadow-sm transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-[#0071e3] dark:text-blue-400 font-medium text-xs">
                Step 1 · Orbital Assembly
              </span>
              <span className="text-xs text-[#86868b]">8 Subsystems</span>
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">
              Select Structural Chassis, Engines & Power
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Integrate solar wings, science sensors, and rocket boosters. Commander Nova-9 automatically verifies mass balance and fuel reserves.
            </p>
          </div>

          {/* Step 02 */}
          <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#121217]/75 border border-black/5 dark:border-white/10 backdrop-blur-xl text-left shadow-sm transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-medium text-xs">
                Step 2 · Transit & Piloting
              </span>
              <span className="text-xs text-[#86868b]">Real-Time Physics</span>
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">
              Throttle Up & Steer Through Deep Space
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Hold the Boost button or Spacebar to ignite main engines. Use directional keys to navigate clearance around hazardous asteroid clusters.
            </p>
          </div>
        </div>

        {/* Step 3 (Right Column) */}
        <div className="md:col-span-5 p-5 rounded-2xl bg-white/80 dark:bg-[#121217]/75 border border-black/5 dark:border-white/10 backdrop-blur-xl text-left flex flex-col justify-between shadow-sm transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium text-xs">
                Step 3 · Planetary Touchdown
              </span>
              <span className="text-xs text-[#86868b]">New Eden</span>
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">
              Retrograde Capture & Landing
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              When entering the target exoplanet capture corridor, execute the reverse engine burn to achieve stable orbit and deliver humanity's seed vault.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold block mb-0.5">Mission Outcome</span>
            Safe landing establishes human civilization on New Eden.
          </div>
        </div>
      </div>

      {/* Flight Controls Reference Bar (Apple Keyboard Keys) */}
      <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#121217]/60 border border-black/5 dark:border-white/10 backdrop-blur-xl mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
        <div>
          <div className="text-xs font-semibold text-slate-900 dark:text-white">
            Input Controls Specification
          </div>
          <div className="text-xs text-[#86868b]">
            Hardware keyboard, Chromebook, iPad touchscreen, and virtual joystick.
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-black/[0.04] dark:bg-white/[0.08] border border-black/10 dark:border-white/10 text-slate-800 dark:text-slate-200 font-medium">
            <kbd className="font-mono">W/A/S/D</kbd> or <kbd className="font-mono">Arrows</kbd> Yaw & Pitch
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[#0071e3] dark:text-blue-400 font-medium">
            <kbd className="font-mono">Spacebar</kbd> Boost
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-black/[0.04] dark:bg-white/[0.08] border border-black/10 dark:border-white/10 text-slate-800 dark:text-slate-200 font-medium">
            Touchpad on Mobile
          </span>
        </div>
      </div>

      {/* 1-Click Starter Presets */}
      <div className="mb-8 text-left">
        <div className="text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-3">
          Ready-to-Fly Configurations
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => {
              sounds.playSuccess();
              if (onSelectPreset) onSelectPreset('super-explorer');
              else onPlayNow();
            }}
            className="p-4 rounded-2xl bg-white/80 dark:bg-[#121217]/75 hover:bg-white dark:hover:bg-[#181822] border border-black/5 dark:border-white/10 text-left transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-xs text-slate-900 dark:text-white">
                Explorer Starship
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                Beginner
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              High fuel margin, reinforced hull plating, and balanced thrust ratio.
            </p>
          </button>

          <button
            onClick={() => {
              sounds.playSuccess();
              if (onSelectPreset) onSelectPreset('cosmic-dart');
              else onPlayNow();
            }}
            className="p-4 rounded-2xl bg-white/80 dark:bg-[#121217]/75 hover:bg-white dark:hover:bg-[#181822] border border-black/5 dark:border-white/10 text-left transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-xs text-slate-900 dark:text-white">
                Interceptor Dart
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-medium">
                High Speed
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              High specific-impulse ion propulsion with responsive pitch authority.
            </p>
          </button>

          <button
            onClick={() => {
              sounds.playSuccess();
              if (onSelectPreset) onSelectPreset('titan-haven');
              else onPlayNow();
            }}
            className="p-4 rounded-2xl bg-white/80 dark:bg-[#121217]/75 hover:bg-white dark:hover:bg-[#181822] border border-black/5 dark:border-white/10 text-left transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-xs text-slate-900 dark:text-white">
                Colony Transport
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
                Heavy Lift
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Reinforced payload bay carrying atmospheric seed vault modules.
            </p>
          </button>
        </div>
      </div>

      {/* Central Launch Action (Apple Blue Pill) */}
      <div className="flex flex-col items-center justify-center pt-2">
        <button
          onClick={() => {
            sounds.playSuccess();
            onPlayNow();
          }}
          className="px-8 py-3.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-sm shadow-xl shadow-blue-500/25 transition-all duration-200 flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Enter Hangar & Launch Mission</span>
          <span>→</span>
        </button>
        <span className="text-xs text-[#86868b] mt-2.5">
          2026 NASA Space Apps · Browser Native · Zero Installation Required
        </span>
      </div>
    </section>
  );
};
