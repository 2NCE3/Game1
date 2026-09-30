import React from 'react';
import { 
  FileText, 
  Compass, 
  Cpu, 
  Layers, 
  Rocket, 
  Activity, 
  Share2, 
  CheckCircle2, 
  Play, 
  Award,
  Lock,
  Check,
  Sparkles
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { ScreenStep } from '../../types/mission';
import { sounds } from '../../utils/soundEffects';

interface StepItem {
  id: ScreenStep;
  index: string;
  label: string;
  cadetLabel: string;
  icon: React.ElementType;
}

const STEPS: StepItem[] = [
  { id: 'brief', index: '01', label: 'BRIEF', cadetLabel: '1. Mission Goal 🎯', icon: FileText },
  { id: 'destination', index: '02', label: 'DESTINATION', cadetLabel: '2. Target World 🪐', icon: Compass },
  { id: 'hangar', index: '03', label: 'BUILD SHIP', cadetLabel: '3. Build Ship 🛠️', icon: Cpu },
  { id: 'review', index: '04', label: 'REVIEW', cadetLabel: '4. Ready Check ✔️', icon: CheckCircle2 },
  { id: 'simulation', index: '05', label: 'SIMULATION', cadetLabel: '5. Blast Off! 🎬', icon: Play },
  { id: 'results', index: '06', label: 'RESULTS', cadetLabel: '6. Score Card 🏆', icon: Award },
];

export const Sidebar: React.FC = () => {
  const { state, setStep, canNavigateToStep, cadetMode } = useMission();

  if (state.currentStep === 'start') {
    return null;
  }

  // Count completed steps
  let completedCount = 0;
  if (state.briefId) completedCount++;
  if (state.destinationId) completedCount++;
  // Hangar counts as done when all 8 sub-systems are configured
  const hangarComplete = !!state.busId && state.payloadIds.length > 0 && !!state.launchVehicleId 
    && !!state.powerSystemId && !!state.commsSystemId && !!state.propulsionSystemId 
    && !!state.thermalSystemId && !!state.trajectoryId;
  if (hangarComplete) completedCount++;
  if (state.status !== 'DRAFT') completedCount++;

  // Also handle legacy step navigation for Sidebar active highlighting
  const isHangarActive = state.currentStep === 'hangar' || state.currentStep === 'spacecraft' 
    || state.currentStep === 'payload' || state.currentStep === 'launch' 
    || state.currentStep === 'systems' || state.currentStep === 'trajectory';

  return (
    <aside className="w-60 bg-space-950/85 border-r border-slate-800/80 flex flex-col justify-between py-4 px-2 select-none z-30 backdrop-blur-sm">
      <div className="space-y-1">
        <div className="px-3 pb-2 mb-2 border-b border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-widest">
          <span>{cadetMode ? '🚀 CADET FLIGHT STEPS' : 'MISSION STEPS'}</span>
          <span className="text-nasa-cyan font-bold">
            {STEPS.findIndex(s => s.id === state.currentStep) + 1} / 10
          </span>
        </div>

        {STEPS.map((step) => {
          const isActive = step.id === 'hangar' ? isHangarActive : state.currentStep === step.id;
          const isAllowed = canNavigateToStep(step.id);
          const Icon = step.icon;

          let isCompleted = false;
          if (step.id === 'brief' && state.briefId) isCompleted = true;
          if (step.id === 'destination' && state.destinationId) isCompleted = true;
          if (step.id === 'hangar' && hangarComplete) isCompleted = true;
          if (step.id === 'review' && state.status !== 'DRAFT') isCompleted = true;
          if (step.id === 'simulation' && state.status === 'COMPLETE') isCompleted = true;
          if (step.id === 'results' && !!state.lastResult) isCompleted = true;

          return (
            <button
              key={step.id}
              disabled={!isAllowed}
              onClick={() => {
                if (isAllowed) {
                  sounds.playClick();
                  setStep(step.id);
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-nasa-orange/25 via-amber-500/10 to-transparent border-l-3 border-nasa-orange text-white shadow-sm font-bold'
                  : isAllowed
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70'
                    : 'text-slate-600 cursor-not-allowed opacity-45'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-nasa-cyan' : 'text-slate-500 group-hover:text-slate-400'}`} />
                <span className="truncate">
                  {cadetMode ? step.cadetLabel : `${step.index} ${step.label}`}
                </span>
              </div>

              <div className="shrink-0 ml-1">
                {isCompleted && !isActive ? (
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : !isAllowed ? (
                  <Lock className="w-3 h-3 text-slate-700" />
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom mission badge */}
      <div className="p-3 bg-space-900/80 border border-slate-800 rounded-xl text-[10px] font-mono text-slate-400 space-y-1.5">
        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-nasa-orange" />
            <span>PROGRESS</span>
          </span>
          <span className="text-emerald-400 font-bold">{completedCount} of 4 Ready</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-nasa-orange to-emerald-400 transition-all duration-300"
            style={{ width: `${(completedCount / 4) * 100}%` }}
          />
        </div>
        <div className="text-[9px] text-slate-500 pt-0.5">
          {cadetMode ? 'Step-by-step easy design mode' : 'NASA Flight Systems Architecture'}
        </div>
      </div>
    </aside>
  );
};
