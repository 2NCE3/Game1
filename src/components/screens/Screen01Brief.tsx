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

      <div className="flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full overflow-y-auto">
        {/* Header (Minimalist Apple Typography) */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#0071e3] font-medium mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Step 1 · Mission Profile</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {cadetMode ? 'Select Your Mission' : 'Mission Directives'}
            </h2>
            <p className="text-[#86868b] text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed font-normal">
              Select an authorized NASA exploration objective. Each profile establishes contractual funding and mass constraints.
            </p>
          </div>
        </div>

        {/* Grid of Briefing Cards (Minimal Frosted Glass Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {MISSION_BRIEFS.map((brief) => {
            const isSelected = state.briefId === brief.id;
            const isRecommended = brief.id === 'lunar-polar';

            return (
              <motion.div
                key={brief.id}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
                onClick={() => {
                  sounds.playSelect();
                  selectBrief(brief.id);
                }}
                className={`relative p-5 sm:p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between backdrop-blur-xl ${
                  isSelected
                    ? 'bg-blue-500/10 border-[#0071e3] shadow-lg shadow-blue-500/15 ring-1 ring-[#0071e3]'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06]'
                }`}
              >
                {/* Recommended Badge */}
                {isRecommended && cadetMode && (
                  <div className="absolute -top-2.5 left-5 px-2.5 py-0.5 rounded-full bg-[#0071e3] text-white font-medium text-[10px] shadow-sm flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-white" />
                    <span>Recommended</span>
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-xl shadow-inner shrink-0">
                        {getCadetEmoji(brief.id)}
                      </div>
                      <div>
                        <span className="text-[11px] text-[#0071e3] font-medium capitalize">
                          Target: {brief.targetDestinationId.replace('-', ' ')}
                        </span>
                        <h3 className="font-semibold text-base sm:text-lg text-white tracking-tight">
                          {brief.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase border ${getDifficultyColor(brief.difficulty)}`}>
                        {brief.difficulty}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#0071e3] text-white flex items-center justify-center shadow-sm">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Plain English Summary */}
                  {cadetMode ? (
                    <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 leading-relaxed mb-4 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span>{getCadetSummary(brief.id)}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {brief.objective}
                    </p>
                  )}

                  {/* Key Constraints (Apple Card Metrics) */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs mb-4">
                    <div>
                      <span className="text-[10px] text-[#86868b] uppercase tracking-wider block font-medium">
                        {cadetMode ? 'Budget' : 'Budget Cap'}
                      </span>
                      <span className="text-emerald-400 font-semibold telemetry-val">
                        ${(brief.budget / 1000).toFixed(2)}B
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#86868b] uppercase tracking-wider block font-medium">
                        {cadetMode ? 'Max Mass' : 'Mass Limit'}
                      </span>
                      <span className="text-[#2997ff] font-semibold telemetry-val">
                        {brief.massLimit.toLocaleString()} kg
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#86868b] uppercase tracking-wider block font-medium">
                        {cadetMode ? 'Duration' : 'Duration'}
                      </span>
                      <span className="text-amber-400 font-semibold telemetry-val">
                        {brief.durationMonths} mo
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Select Action */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {brief.requiredCapabilities.map((cap, idx) => (
                      <span 
                        key={idx}
                        className="px-2.5 py-0.5 rounded-full text-[10px] bg-white/[0.06] text-slate-300 border border-white/10 font-medium"
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
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 shrink-0 ${
                      isSelected
                        ? 'bg-[#0071e3] hover:bg-[#0077ed] text-white shadow-md shadow-blue-500/25'
                        : 'bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/10'
                    }`}
                  >
                    <span>{isSelected ? 'Selected' : 'Select'}</span>
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
