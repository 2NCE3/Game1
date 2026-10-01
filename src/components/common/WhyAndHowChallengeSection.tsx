import React from 'react';
import { sounds } from '../../utils/soundEffects';

interface WhyAndHowChallengeSectionProps {
  onOpenNasaModal: () => void;
}

export const WhyAndHowChallengeSection: React.FC<WhyAndHowChallengeSectionProps> = ({ onOpenNasaModal }) => {
  return (
    <section className="w-full max-w-5xl mx-auto my-12 px-4 sm:px-6">
      {/* Section Tag & Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#0071e3] dark:text-blue-400 text-xs font-medium mb-3">
          <span>Mission Architecture & Challenge Solution</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          Why MissionForge Solves the NASA Challenge
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Translating orbital mechanics, Tsiolkovsky rocket equations, and planetary data into an intuitive, accessible engineering simulator.
        </p>
      </div>

      {/* The Story & Crisis Context Card (Apple Frosted Glass) */}
      <div className="p-6 rounded-2xl bg-white/80 dark:bg-[#121217]/75 border border-black/5 dark:border-white/10 backdrop-blur-xl mb-6 text-left shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-black/5 dark:border-white/10">
          <span className="text-xs font-semibold text-[#0071e3] dark:text-blue-400 uppercase tracking-wider">
            Scenario Brief · Operation Exodus
          </span>
          <span className="text-xs text-[#86868b]">2026 Space Apps Challenge</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          Earth Depleted · Mars Exhausted · Voyage to New Eden
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          Earth's ecological buffer has collapsed and Martian colony reserves are critically depleted. As Chief Space Architect, the player designs and pilots humanity's interstellar colony vessel across 4.2 light-years to exoplanet New Eden.
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-black/5 dark:border-white/10 text-xs">
          <span className="text-[#86868b]">
            Target Challenge: Space Mission Design Game & Orbital Education
          </span>
          <button
            onClick={() => {
              sounds.playClick();
              onOpenNasaModal();
            }}
            className="text-[#0071e3] dark:text-blue-400 hover:underline font-semibold cursor-pointer flex items-center gap-1"
          >
            <span>Open NASA 2026 Reference Hub</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* 4 Technical Solutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Solution 01 */}
        <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#121217]/75 border border-black/5 dark:border-white/10 backdrop-blur-xl text-left shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#86868b]">Problem 01</span>
            <span className="text-xs font-medium text-rose-500">Math Barrier</span>
          </div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5">
            Rocket Equations Intimidate Students
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            The Tsiolkovsky equation is computed live behind color-coded mass and delta-v gauges. Cadets receive immediate visual confirmation when orbital velocity threshold is met.
          </p>
        </div>

        {/* Solution 02 */}
        <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#121217]/75 border border-black/5 dark:border-white/10 backdrop-blur-xl text-left shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#86868b]">Problem 02</span>
            <span className="text-xs font-medium text-amber-500">Passive Simulations</span>
          </div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5">
            Simulations Lack Interactive Feedback
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Cadets physically pilot the vehicle at 60 FPS, dodging tumbling asteroid instances and executing retrograde deceleration burns with real-time feedback.
          </p>
        </div>

        {/* Solution 03 */}
        <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#121217]/75 border border-black/5 dark:border-white/10 backdrop-blur-xl text-left shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#86868b]">Problem 03</span>
            <span className="text-xs font-medium text-blue-500">Missing Guidance</span>
          </div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5">
            Players Fail Without Context
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Commander Nova-9 continuously evaluates mass limits, power draws, and orbital safety margins, providing concise proactive recommendations.
          </p>
        </div>

        {/* Solution 04 */}
        <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#121217]/75 border border-black/5 dark:border-white/10 backdrop-blur-xl text-left shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#86868b]">Problem 04</span>
            <span className="text-xs font-medium text-emerald-500">Fictional Data</span>
          </div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5">
            Arcade Games Ignore Genuine Physics
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            All planetary bodies incorporate official NASA gravitational constants, atmospheric scales, and distance ratios, ensuring genuine educational transfer.
          </p>
        </div>
      </div>
    </section>
  );
};
