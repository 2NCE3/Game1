import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle, 
  Wand2, 
  GraduationCap,
  ChevronRight,
  Check
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { ScreenStep } from '../../types/mission';
import { sounds } from '../../utils/soundEffects';

interface CadetGuideBannerProps {
  currentStep: ScreenStep;
  stepNumber: number;
  totalSteps?: number;
  title: string;
  childQuestion: string;
  childTip: string;
  recommendedAction?: string;
  onNext?: () => void;
  onPrev?: () => void;
  disableNext?: boolean;
}

interface StepMeta {
  id: ScreenStep;
  num: number;
  label: string;
  shortLabel: string;
  emoji: string;
}

const DESIGN_STEPS: StepMeta[] = [
  { id: 'brief', num: 1, label: 'Mission Goal', shortLabel: 'Goal', emoji: '🎯' },
  { id: 'destination', num: 2, label: 'Target World', shortLabel: 'Planet', emoji: '🪐' },
  { id: 'hangar', num: 3, label: 'Build Ship', shortLabel: 'Build', emoji: '🛠️' },
  { id: 'review', num: 4, label: 'Launch Check', shortLabel: 'Launch', emoji: '✔️' },
  { id: 'simulation', num: 5, label: 'Blast Off', shortLabel: 'Fly', emoji: '🚀' },
  { id: 'results', num: 6, label: 'Score Card', shortLabel: 'Score', emoji: '🏆' },
];

export const CadetGuideBanner: React.FC<CadetGuideBannerProps> = ({
  currentStep,
  stepNumber,
  totalSteps = 6,
  title,
  childQuestion,
  childTip,
  recommendedAction,
  onNext,
  onPrev,
  disableNext = false,
}) => {
  const { 
    state, 
    cadetMode, 
    toggleCadetMode, 
    autoBalanceMission, 
    goToNextStep, 
    goToPrevStep, 
    setStep, 
    canNavigateToStep 
  } = useMission();

  const handleNext = () => {
    sounds.playClick();
    if (onNext) onNext();
    else goToNextStep();
  };

  const handlePrev = () => {
    sounds.playClick();
    if (onPrev) onPrev();
    else goToPrevStep();
  };

  const handleAutoBalance = () => {
    sounds.playSuccess();
    autoBalanceMission();
  };

  // Check which steps are completed
  const isStepCompleted = (stepId: ScreenStep) => {
    if (stepId === 'brief') return !!state.briefId;
    if (stepId === 'destination') return !!state.destinationId;
    if (stepId === 'hangar') return !!state.busId && state.payloadIds.length > 0 && !!state.launchVehicleId 
      && !!state.powerSystemId && !!state.commsSystemId && !!state.propulsionSystemId 
      && !!state.thermalSystemId && !!state.trajectoryId;
    if (stepId === 'spacecraft') return !!state.busId;
    if (stepId === 'payload') return state.payloadIds.length > 0;
    if (stepId === 'launch') return !!state.launchVehicleId;
    if (stepId === 'systems') return !!(state.powerSystemId && state.commsSystemId && state.propulsionSystemId);
    if (stepId === 'trajectory') return !!state.trajectoryId;
    if (stepId === 'review') return state.status !== 'DRAFT';
    if (stepId === 'simulation') return state.status === 'COMPLETE' || state.status === 'FAILED';
    if (stepId === 'results') return !!state.lastResult;
    return false;
  };

  if (!cadetMode) {
    // Compact bar when Cadet Mode is turned off
    return (
      <div className="w-full bg-space-900/70 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-nasa-cyan font-bold">PHASE {stepNumber}/{totalSteps}:</span>
          <span className="text-white font-semibold">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              toggleCadetMode();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Enable child-friendly Cadet Guide"
          >
            <GraduationCap className="w-3.5 h-3.5 text-nasa-orange" />
            <span>Enable Cadet Mode 👨‍🚀</span>
          </button>
          <button
            onClick={handleNext}
            disabled={disableNext}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-white font-bold transition-all ${
              disableNext ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-nasa-orange hover:bg-orange-500'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-gradient-to-r from-space-950 via-space-900 to-space-950 border-b-2 border-nasa-orange/40 shadow-xl flex flex-col z-30 select-none"
    >
      {/* Visual Step-by-Step Working Progress Ribbon (1 to 8) */}
      <div className="px-3 sm:px-6 pt-2.5 pb-2 border-b border-slate-800/80 bg-space-950/70 overflow-x-auto scrollbar-none">
        <div className="flex items-center justify-between min-w-[620px] max-w-5xl mx-auto gap-1">
          {DESIGN_STEPS.map((s, idx) => {
            const isCurrent = state.currentStep === s.id;
            const completed = isStepCompleted(s.id);
            const isClickable = canNavigateToStep(s.id);

            return (
              <React.Fragment key={s.id}>
                {/* Step Chip */}
                <button
                  disabled={!isClickable}
                  onClick={() => {
                    if (isClickable) {
                      sounds.playClick();
                      setStep(s.id);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-mono text-xs transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-r from-nasa-orange to-amber-500 text-white font-bold shadow-md shadow-nasa-orange/30 ring-2 ring-nasa-orange/50 scale-105'
                      : completed
                        ? 'bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/40'
                        : isClickable
                          ? 'bg-space-900/90 border border-slate-800 text-slate-400 hover:text-slate-200'
                          : 'opacity-40 text-slate-600 cursor-not-allowed'
                  }`}
                  title={`Step ${s.num}: ${s.label}`}
                >
                  <span className="text-sm">{s.emoji}</span>
                  <span className="hidden sm:inline font-sans text-[11px] font-semibold">
                    {s.num}. {s.shortLabel}
                  </span>
                  {completed && !isCurrent && (
                    <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                  )}
                </button>

                {/* Arrow connector between steps */}
                {idx < DESIGN_STEPS.length - 1 && (
                  <span className={`text-[10px] ${idx < stepNumber - 1 ? 'text-emerald-500' : 'text-slate-700'}`}>
                    ➔
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Commander Nova Guidance & Actions Bar */}
      <div className="px-4 py-3 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Commander Nova Avatar & Kid-friendly question */}
        <div className="flex items-center gap-3.5">
          {/* Astronaut Avatar with Friendly Animation */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-nasa-orange via-amber-500 to-red-600 p-0.5 shadow-lg shadow-nasa-orange/30">
              <div className="w-full h-full bg-space-950 rounded-[14px] flex items-center justify-center text-2xl hover:scale-110 transition-transform">
                👨‍🚀
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-emerald-500 text-black text-[9px] font-black font-mono">
              GUIDE
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-nasa-orange/20 border border-nasa-orange/50 text-nasa-orange text-[10px] font-mono font-bold uppercase tracking-wider">
                STEP {stepNumber} OF {totalSteps}: {title}
              </span>
              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                Commander Nova's Mission Briefing
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
              <span>{childQuestion}</span>
            </h3>

            <p className="text-xs text-amber-200/90 font-sans mt-0.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{childTip}</span>
            </p>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80 shrink-0">
          {/* Magic Help Button */}
          <button
            onClick={handleAutoBalance}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-950/70 hover:bg-purple-900/90 border border-purple-500/70 text-purple-200 text-xs font-mono font-bold transition-all shadow-md hover:scale-102"
            title="Commander Nova will automatically balance mass, power, and fuel for you!"
          >
            <Wand2 className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" />
            <span>HELP ME CHOOSE ✨</span>
          </button>

          {/* Back Button */}
          {stepNumber > 1 && (
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-mono font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          {/* Next Step Button (Big, Prominent, High Contrast) */}
          <button
            onClick={handleNext}
            disabled={disableNext}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg ${
              disableNext
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-nasa-orange via-orange-500 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-nasa-orange/30 cursor-pointer hover:scale-102 ring-2 ring-orange-400/40'
            }`}
          >
            <span>{stepNumber === totalSteps ? 'GO TO LAUNCHPAD' : 'NEXT STEP'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
