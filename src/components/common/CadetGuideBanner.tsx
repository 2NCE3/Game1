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
      <div className="w-full bg-black/40 backdrop-blur-2xl border-b border-white/10 px-4 py-2 flex items-center justify-between text-xs font-sans text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-[#0071e3] font-semibold">Phase {stepNumber}/{totalSteps}:</span>
          <span className="text-white font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              toggleCadetMode();
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-300 transition-all cursor-pointer"
            title="Enable child-friendly Cadet Guide"
          >
            <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
            <span>Enable Cadet Mode</span>
          </button>
          <button
            onClick={handleNext}
            disabled={disableNext}
            className={`flex items-center gap-1 px-4 py-1 rounded-full text-white font-semibold transition-all ${
              disableNext ? 'bg-white/10 text-slate-500 cursor-not-allowed' : 'bg-[#0071e3] hover:bg-[#0077ed] cursor-pointer'
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
      className="w-full bg-black/60 backdrop-blur-2xl border-b border-white/10 shadow-lg flex flex-col z-30 select-none font-sans"
    >
      {/* Visual Step-by-Step Working Progress Ribbon (1 to 6) */}
      <div className="px-3 sm:px-6 pt-2 pb-2 border-b border-white/10 bg-white/[0.02] overflow-x-auto scrollbar-none">
        <div className="flex items-center justify-between min-w-[620px] max-w-5xl mx-auto gap-1.5">
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
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    isCurrent
                      ? 'bg-white text-black font-semibold shadow-sm scale-102'
                      : completed
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
                        : isClickable
                          ? 'bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                          : 'opacity-40 text-slate-500 cursor-not-allowed'
                  }`}
                  title={`Step ${s.num}: ${s.label}`}
                >
                  <span className="text-xs">{s.emoji}</span>
                  <span className="hidden sm:inline text-[11px]">
                    {s.num}. {s.shortLabel}
                  </span>
                  {completed && !isCurrent && (
                    <Check className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                  )}
                </button>

                {/* Arrow connector between steps */}
                {idx < DESIGN_STEPS.length - 1 && (
                  <span className={`text-[10px] ${idx < stepNumber - 1 ? 'text-emerald-400' : 'text-slate-600'}`}>
                    ➔
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Commander Nova Guidance & Actions Bar */}
      <div className="px-4 py-2.5 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Commander Nova Avatar & Kid-friendly question */}
        <div className="flex items-center gap-3">
          {/* Astronaut Avatar with Friendly Animation */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-center text-xl shadow-inner">
              👨‍🚀
            </div>
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-emerald-500 text-black text-[8px] font-bold tracking-tight">
              AI
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
                Step {stepNumber} of {totalSteps}: {title}
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Mission Guidance
              </span>
            </div>

            <h3 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5 mt-0.5 tracking-tight">
              <span>{childQuestion}</span>
            </h3>

            <p className="text-[11px] text-slate-300 font-sans mt-0.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>{childTip}</span>
            </p>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-white/10 shrink-0">
          {/* Magic Help Button */}
          <button
            onClick={handleAutoBalance}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/30 text-purple-200 text-xs font-medium transition-all active:scale-[0.98] cursor-pointer"
            title="Commander Nova will automatically balance mass, power, and fuel for you"
          >
            <Wand2 className="w-3.5 h-3.5 text-purple-300" />
            <span>Auto Recommend</span>
          </button>

          {/* Back Button */}
          {stepNumber > 1 && (
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 text-xs font-medium transition-all active:scale-[0.98] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          {/* Next Step Button (Apple Blue Pill) */}
          <button
            onClick={handleNext}
            disabled={disableNext}
            className={`flex items-center gap-1.5 px-5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all shadow-sm ${
              disableNext
                ? 'bg-white/10 text-slate-500 border border-white/10 cursor-not-allowed'
                : 'bg-[#0071e3] hover:bg-[#0077ed] text-white shadow-[#0071e3]/20 cursor-pointer active:scale-[0.98]'
            }`}
          >
            <span>{stepNumber === totalSteps ? 'Proceed to Launchpad' : 'Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
