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
    <section className="w-full max-w-5xl mx-auto my-8 px-4 sm:px-6">
      {/* Section Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
          <span>[CADET FLIGHT INSTRUCTIONS]</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight mb-2">
          HOW TO PLAY IN 3 STEPS
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans max-w-xl mx-auto">
          Assemble your spacecraft in the hangar, pilot through orbital space, and execute retrograde landing on New Eden.
        </p>
      </div>

      {/* 2-Column Asymmetric Architectural Grid (Banned 3-card-in-a-row) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        {/* Step 1 & Step 2 (Left Column - 7 cols) */}
        <div className="md:col-span-7 space-y-4">
          {/* Step 01 */}
          <div className="p-4 rounded-md bg-[#f8f7f4] dark:bg-[#111117] border border-slate-300 dark:border-white/10 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded-sm bg-amber-500/15 text-amber-700 dark:text-amber-400 font-mono font-bold text-[10px]">
                STEP [01] / HANGAR ASSEMBLY
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">8 Subsystems</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Select Structural Chassis, Engines & Power
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
              Integrate solar wings, science sensors, and rocket boosters. Commander Nova-9 automatically verifies mass balance and fuel reserves.
            </p>
          </div>

          {/* Step 02 */}
          <div className="p-4 rounded-md bg-[#f8f7f4] dark:bg-[#111117] border border-slate-300 dark:border-white/10 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded-sm bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 font-mono font-bold text-[10px]">
                STEP [02] / PILOTING & TRANSIT
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Real-Time Physics</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Throttle Up & Steer Through Deep Space
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
              Hold [SPACEBAR] or on-screen [BOOST] button to throttle engines. Use [W/A/S/D] or arrow keys to steer around asteroid clusters.
            </p>
          </div>
        </div>

        {/* Step 3 (Right Column - 5 cols) */}
        <div className="md:col-span-5 p-4 rounded-md bg-[#f8f7f4] dark:bg-[#111117] border border-slate-300 dark:border-white/10 text-left flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded-sm bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-[10px]">
                STEP [03] / ORBITAL TOUCHDOWN
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Final Target</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Retrograde Capture on New Eden
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed mb-3">
              When entering the target exoplanet SOI corridor, execute the reverse engine burn to achieve stable orbit and deliver humanity seed vault.
            </p>
          </div>

          <div className="p-2.5 rounded-sm bg-slate-200/80 dark:bg-[#181822] border border-slate-300 dark:border-white/10 text-[11px] font-mono text-slate-700 dark:text-slate-300">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold block mb-0.5">[MISSION OUTCOME]</span>
            Safe landing establishes human civilization on New Eden.
          </div>
        </div>
      </div>

      {/* Flight Controls Reference Bar */}
      <div className="p-3.5 rounded-md bg-slate-200/80 dark:bg-[#111117] border border-slate-300 dark:border-white/10 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
        <div>
          <div className="text-[11px] font-mono font-bold text-slate-900 dark:text-white">
            INPUT CONTROLS SPECIFICATION:
          </div>
          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
            Hardware keyboard, Chromebook, iPad touchscreen, and mobile virtual joypad.
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
          <span className="px-2 py-1 rounded-sm bg-[#f8f7f4] dark:bg-[#181822] border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200">
            [W/A/S/D] or [ARROWS] Yaw / Pitch
          </span>
          <span className="px-2 py-1 rounded-sm bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-400 font-bold">
            [SPACEBAR] Boost Throttle
          </span>
          <span className="px-2 py-1 rounded-sm bg-[#f8f7f4] dark:bg-[#181822] border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200">
            [TOUCH JOYSTICK] On-Screen Pad
          </span>
        </div>
      </div>

      {/* 1-Click Starter Presets */}
      <div className="mb-6 text-left">
        <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">
          READY-TO-FLY VEHICLE CONFIGURATIONS:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={() => {
              sounds.playSuccess();
              if (onSelectPreset) onSelectPreset('super-explorer');
              else onPlayNow();
            }}
            className="p-3 rounded-md bg-[#f8f7f4] dark:bg-[#111117] hover:bg-slate-200 dark:hover:bg-[#181822] border border-slate-300 dark:border-white/10 text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs font-mono text-slate-900 dark:text-white">
                [01] EXPLORER CONFIG
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                BEGINNER
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
              High fuel margin, resilient hull plating, and balanced thrust ratio.
            </p>
          </button>

          <button
            onClick={() => {
              sounds.playSuccess();
              if (onSelectPreset) onSelectPreset('cosmic-dart');
              else onPlayNow();
            }}
            className="p-3 rounded-md bg-[#f8f7f4] dark:bg-[#111117] hover:bg-slate-200 dark:hover:bg-[#181822] border border-slate-300 dark:border-white/10 text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs font-mono text-slate-900 dark:text-white">
                [02] INTERCEPTOR DART
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-mono font-bold">
                HIGH SPEED
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
              High specific-impulse ion propulsion with responsive pitch authority.
            </p>
          </button>

          <button
            onClick={() => {
              sounds.playSuccess();
              if (onSelectPreset) onSelectPreset('titan-haven');
              else onPlayNow();
            }}
            className="p-3 rounded-md bg-[#f8f7f4] dark:bg-[#111117] hover:bg-slate-200 dark:hover:bg-[#181822] border border-slate-300 dark:border-white/10 text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs font-mono text-slate-900 dark:text-white">
                [03] COLONY TRANSPORT
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-amber-500/20 text-amber-600 dark:text-amber-400 font-mono font-bold">
                HEAVY LIFT
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
              Reinforced payload bay carrying atmospheric seed vault pods.
            </p>
          </button>
        </div>
      </div>

      {/* Central Launch Action */}
      <div className="flex flex-col items-center justify-center pt-2">
        <button
          onClick={() => {
            sounds.playSuccess();
            onPlayNow();
          }}
          className="px-8 py-3.5 rounded-md bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-sm tracking-wider uppercase transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <span>ENTER HANGAR & LAUNCH MISSION</span>
          <span>[➔]</span>
        </button>
        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-2">
          [NASA SPACE APPS 2026] BROWSER RUNTIME / ZERO INSTALLATION
        </span>
      </div>
    </section>
  );
};
