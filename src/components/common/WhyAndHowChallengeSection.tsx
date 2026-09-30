import React from 'react';
import { sounds } from '../../utils/soundEffects';

interface WhyAndHowChallengeSectionProps {
  onOpenNasaModal: () => void;
}

export const WhyAndHowChallengeSection: React.FC<WhyAndHowChallengeSectionProps> = ({ onOpenNasaModal }) => {
  return (
    <section className="w-full max-w-5xl mx-auto my-10 px-4 sm:px-6">
      {/* Section Tag & Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
          <span>[MISSION ARCHITECTURE & CHALLENGE SOLUTION]</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight mb-2">
          WHY MISSIONFORGE SOLVES THE NASA CHALLENGE
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans max-w-2xl mx-auto">
          Translating complex orbital mechanics, Tsiolkovsky equations, and planetary data into an intuitive, accessible engineering simulator.
        </p>
      </div>

      {/* The Story & Crisis Context Card */}
      <div className="p-5 rounded-md bg-[#f8f7f4] dark:bg-[#111117] border border-slate-300 dark:border-white/10 mb-6 text-left">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200 dark:border-white/10">
          <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            [SCENARIO BRIEF] OPERATION EXODUS
          </span>
          <span className="text-[10px] font-mono text-slate-500">2026 Space Apps Challenge</span>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
          Earth Depleted / Mars Expiring / Mission to New Eden
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans leading-relaxed mb-3">
          In this mission storyline, Earth ecological buffer has collapsed and Martian colony reserves are critically depleted. As Chief Space Architect, the player designs and pilots humanity interstellar colony vessel across 4.2 light-years to exoplanet New Eden.
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-white/10 text-xs font-mono">
          <span className="text-slate-500 text-[11px]">
            Target Challenge: Space Mission Design Game & Orbital Education
          </span>
          <button
            onClick={() => {
              sounds.playClick();
              onOpenNasaModal();
            }}
            className="text-amber-600 dark:text-amber-400 hover:underline font-bold text-[11px] cursor-pointer"
          >
            [OPEN NASA 2026 REFERENCE HUB ➔]
          </button>
        </div>
      </div>

      {/* 4 Technical Solutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Solution 01 */}
        <div className="p-4 rounded-md bg-[#f8f7f4] dark:bg-[#111117] border border-slate-300 dark:border-white/10 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-slate-500">PROBLEM 01</span>
            <span className="text-[10px] font-mono text-red-600 dark:text-red-400">MATH BARRIER</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Rocket Equations Intimidate Young Students
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
            The Tsiolkovsky equation is computed live behind color-coded mass and delta-v gauges. Cadets receive immediate visual confirmation when orbital velocity threshold is met.
          </p>
        </div>

        {/* Solution 02 */}
        <div className="p-4 rounded-md bg-[#f8f7f4] dark:bg-[#111117] border border-slate-300 dark:border-white/10 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-slate-500">PROBLEM 02</span>
            <span className="text-[10px] font-mono text-red-600 dark:text-red-400">PASSIVE LOGS</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Simulations Lack Interactive Tactile Feedback
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
            Cadets physically pilot the vehicle at 60 FPS, dodging tumbling asteroid instances and executing retrograde deceleration burns with real-time feedback.
          </p>
        </div>

        {/* Solution 03 */}
        <div className="p-4 rounded-md bg-[#f8f7f4] dark:bg-[#111117] border border-slate-300 dark:border-white/10 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-slate-500">PROBLEM 03</span>
            <span className="text-[10px] font-mono text-red-600 dark:text-red-400">NO GUIDANCE</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Players Fail Without Clear Engineering Context
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
            Commander Nova-9 co-pilot continuously evaluates mass limits, power draws, and orbital safety margins, providing concise proactive recommendations.
          </p>
        </div>

        {/* Solution 04 */}
        <div className="p-4 rounded-md bg-[#f8f7f4] dark:bg-[#111117] border border-slate-300 dark:border-white/10 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-slate-500">PROBLEM 04</span>
            <span className="text-[10px] font-mono text-red-600 dark:text-red-400">FICTIONAL DATA</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Arcade Games Ignore Genuine Planetary Physics
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
            All planetary bodies incorporate official NASA gravitational constants, atmospheric scales, and distance ratios, ensuring genuine educational transfer.
          </p>
        </div>
      </div>
    </section>
  );
};
