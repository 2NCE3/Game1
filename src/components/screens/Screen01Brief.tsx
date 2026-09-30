import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  DollarSign, 
  Weight, 
  Clock, 
  Target, 
  ArrowRight, 
  Check, 
  Sparkles,
  ShieldAlert,
  Star
} from 'lucide-react';
import { MISSION_BRIEFS } from '../../data/missionsData';
import { useMission } from '../../context/MissionContext';
import { MissionBrief } from '../../types/mission';
import { CadetGuideBanner } from '../common/CadetGuideBanner';
import { sounds } from '../../utils/soundEffects';

export const Screen01Brief: React.FC = () => {
  const { state, selectBrief, cadetMode, goToNextStep } = useMission();

  const getDifficultyColor = (diff: MissionBrief['difficulty']) => {
    switch (diff) {
      case 'STANDARD':
        return 'bg-emerald-950/60 border-emerald-600/40 text-emerald-400';
      case 'MODERATE':
        return 'bg-blue-950/60 border-blue-600/40 text-blue-400';
      case 'COMPLEX':
        return 'bg-amber-950/60 border-amber-600/40 text-amber-400';
      case 'EXTREME':
        return 'bg-red-950/60 border-red-600/40 text-red-400';
    }
  };

  const getCadetEmoji = (id: string) => {
    switch (id) {
      case 'lunar-polar': return '🌙';
      case 'mars-surface': return '🔴';
      case 'asteroid-survey': return '☄️';
      case 'earth-observation': return '🌍';
      default: return '🚀';
    }
  };

  const getCadetSummary = (id: string) => {
    switch (id) {
      case 'lunar-polar': return 'Fly to the Moon’s south pole and hunt for hidden ice in dark craters!';
      case 'mars-surface': return 'Travel to the Red Planet and search ancient riverbeds for clues of life!';
      case 'asteroid-survey': return 'Rendezvous with a mysterious spinning space rock rich in shiny metals!';
      case 'earth-observation': return 'Orbit high above our home planet to watch over weather, oceans, and ice caps!';
      default: return '';
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-space-950">
      {/* Friendly Cadet Step Banner */}
      <CadetGuideBanner
        currentStep="brief"
        stepNumber={1}
        totalSteps={8}
        title="Mission Objective"
        childQuestion="What space adventure do you want to embark on?"
        childTip="Beginner Tip: The Moon is the closest destination and easiest for your first flight!"
        onNext={goToNextStep}
        disableNext={!state.briefId}
      />

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-nasa-cyan uppercase tracking-widest mb-1">
              <FileText className="w-3.5 h-3.5 text-nasa-cyan" />
              <span>STEP 01 // SELECT MISSION TARGET</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide">
              {cadetMode ? 'Choose Your Space Mission 🎯' : 'MISSION BRIEF'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              {cadetMode 
                ? 'Click on any card below to pick your goal. Every mission gives you budget money and a rocket weight limit!'
                : 'Select an authorized NASA scientific exploration objective. Each mission profile establishes contractual funding and mass limits.'}
            </p>
          </div>
        </div>

        {/* Grid of Briefing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {MISSION_BRIEFS.map((brief) => {
            const isSelected = state.briefId === brief.id;
            const isRecommended = brief.id === 'lunar-polar';

            return (
              <motion.div
                key={brief.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  sounds.playSelect();
                  selectBrief(brief.id);
                }}
                className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-space-850/95 border-nasa-orange shadow-xl shadow-nasa-orange/20 ring-2 ring-nasa-orange'
                    : 'bg-space-900/70 border-slate-800 hover:border-slate-700 hover:bg-space-850/50'
                }`}
              >
                {/* Recommended Badge for Kids */}
                {isRecommended && cadetMode && (
                  <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-nasa-orange text-black font-mono font-black text-[10px] uppercase shadow-md flex items-center gap-1">
                    <Star className="w-3 h-3 fill-black" />
                    <span>RECOMMENDED FOR CADETS ⭐</span>
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-space-950 border border-slate-800 flex items-center justify-center text-2xl shadow-inner shrink-0">
                        {getCadetEmoji(brief.id)}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-nasa-cyan uppercase tracking-widest font-semibold">
                          TARGET: {brief.targetDestinationId.toUpperCase()}
                        </span>
                        <h3 className="font-display font-bold text-lg text-white tracking-wide">
                          {brief.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase border ${getDifficultyColor(brief.difficulty)}`}>
                        {brief.difficulty}
                      </span>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-nasa-orange text-white flex items-center justify-center shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Kid-Friendly Plain English Summary */}
                  {cadetMode ? (
                    <div className="p-3 rounded-xl bg-space-950/80 border border-slate-800/80 text-xs text-amber-200 font-sans leading-relaxed mb-4 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{getCadetSummary(brief.id)}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {brief.objective}
                    </p>
                  )}

                  {/* Key Constraints */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-space-950/70 border border-slate-800/80 rounded-xl font-mono text-xs mb-4">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">
                        {cadetMode ? '💰 Money' : 'BUDGET CAP'}
                      </span>
                      <span className="text-emerald-400 font-bold telemetry-val">
                        ${(brief.budget / 1000).toFixed(2)}B
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">
                        {cadetMode ? '⚖️ Max Weight' : 'MASS LIMIT'}
                      </span>
                      <span className="text-cyan-400 font-bold telemetry-val">
                        {brief.massLimit.toLocaleString()} kg
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">
                        {cadetMode ? '⏱️ Mission Time' : 'DURATION'}
                      </span>
                      <span className="text-amber-400 font-bold telemetry-val">
                        {brief.durationMonths} months
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Select Action */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {brief.requiredCapabilities.map((cap, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800/60 text-slate-300 border border-slate-700/50"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      selectBrief(brief.id);
                    }}
                    className={`px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 ${
                      isSelected
                        ? 'bg-nasa-orange text-white shadow-lg shadow-nasa-orange/25'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <span>{isSelected ? 'SELECTED ✓' : 'CHOOSE THIS MISSION'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
