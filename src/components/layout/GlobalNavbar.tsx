import React, { useState } from 'react';
import { 
  Rocket, 
  Compass, 
  Wrench, 
  Activity, 
  Award, 
  HelpCircle, 
  Sparkles, 
  BookOpen, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Zap,
  ChevronRight
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { useTheme } from '../../context/ThemeContext';
import { DESTINATIONS, MISSION_BRIEFS } from '../../data/missionsData';
import { EducationModal } from '../common/EducationModal';
import { NASAChallengeLinksModal } from '../common/NASAChallengeLinks';
import { StoryPrologueModal } from '../common/StoryPrologueModal';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { sounds } from '../../utils/soundEffects';

export const GlobalNavbar: React.FC = () => {
  const { 
    state, 
    setStep, 
    resources, 
    loadDemoMission, 
    resetMission, 
    canNavigateToStep 
  } = useMission();
  const { theme, toggleTheme } = useTheme();

  const [showEduModal, setShowEduModal] = useState(false);
  const [showNasaModal, setShowNasaModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sounds.enabled);

  const toggleAudio = () => {
    const next = sounds.toggleSound();
    setSoundEnabled(next);
  };

  const currentDestination = DESTINATIONS.find(d => d.id === state.destinationId);
  const currentBrief = MISSION_BRIEFS.find(b => b.id === state.briefId);

  // Main navigation stages
  const NAV_STEPS = [
    { id: 'start', label: 'Missions', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'destination', label: 'Worlds', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'hangar', label: 'Hangar', icon: <Wrench className="w-3.5 h-3.5" /> },
    { id: 'simulation', label: 'Launch', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'results', label: 'Debrief', icon: <Award className="w-3.5 h-3.5" /> },
  ] as const;

  const handleNavClick = (targetStep: typeof NAV_STEPS[number]['id']) => {
    sounds.playClick();
    if (targetStep === 'start') {
      setStep('start');
      return;
    }
    if (targetStep === 'destination') {
      setStep('destination');
      return;
    }
    if (targetStep === 'hangar') {
      if (!state.destinationId) {
        setStep('destination');
      } else {
        setStep('hangar');
      }
      return;
    }
    if (targetStep === 'simulation') {
      if (canNavigateToStep('simulation')) {
        setStep('simulation');
      } else {
        setStep('hangar');
      }
      return;
    }
    if (targetStep === 'results') {
      if (state.lastResult) {
        setStep('results');
      } else {
        sounds.playWarningBeep();
      }
      return;
    }
    setStep(targetStep);
  };

  return (
    <>
      <header className="h-14 sm:h-16 bg-[#030305]/95 border-b border-red-500/20 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-40 backdrop-blur-2xl select-none shadow-lg shadow-black/80 flex-shrink-0">
        {/* =========================================================================
            LEFT: BRAND LOGO & ACTIVE EXPEDITION DIRECTIVE
            ========================================================================= */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Logo Button (returns to home/start) */}
          <button
            onClick={() => {
              sounds.playClick();
              setStep('start');
            }}
            className="flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer"
            title="Return to MissionForge Home"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-red-800 flex items-center justify-center text-white shadow-md shadow-red-600/30 font-bold text-xs group-hover:scale-105 transition-transform">
              MF
            </div>
            <div>
              <div className="font-extrabold text-xs sm:text-sm tracking-tight text-white flex items-center gap-1.5">
                <span>Mission<span className="red-gradient-text">Forge</span></span>
                <span className="hidden md:inline-flex text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 font-mono font-medium">
                  NASA 2026
                </span>
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 hidden xs:block font-mono">
                Interstellar Lab
              </div>
            </div>
          </button>

          {/* Active Target Destination / Mission Badge (if equipped) */}
          {currentDestination && (
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-white/10">
              <div 
                className="w-2 h-2 rounded-full animate-pulse" 
                style={{ backgroundColor: currentDestination.color }} 
              />
              <span className="text-[11px] font-mono text-slate-300 font-semibold truncate max-w-[130px]">
                {currentDestination.name}
              </span>
            </div>
          )}
        </div>

        {/* =========================================================================
            CENTER: MAIN IMPORTANT NAV LINKS (ALWAYS ACCESSIBLE)
            ========================================================================= */}
        <nav className="flex items-center gap-1 sm:gap-1.5 bg-black/40 border border-white/10 p-1 rounded-full backdrop-blur-md">
          {NAV_STEPS.map((item) => {
            const isActive = state.currentStep === item.id || 
              (item.id === 'hangar' && ['spacecraft', 'payload', 'launch', 'systems', 'trajectory', 'review'].includes(state.currentStep));
            
            const isClickable = item.id === 'start' || item.id === 'destination' || 
              (item.id === 'hangar' && !!state.destinationId) ||
              (item.id === 'simulation' && !!state.trajectoryId) ||
              (item.id === 'results' && !!state.lastResult);

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                disabled={!isClickable && item.id !== 'hangar'}
                className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'red-gradient-btn text-white shadow-md shadow-red-600/30'
                    : isClickable
                    ? 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
                    : 'text-slate-600 cursor-not-allowed opacity-50'
                }`}
                title={`Go to ${item.label}`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* =========================================================================
            RIGHT: IMPORTANT RESOURCES & QUICK ACTION TOOLS
            ========================================================================= */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* NASA Challenge Resources Hub Link */}
          <button
            onClick={() => {
              sounds.playClick();
              setShowNasaModal(true);
            }}
            className="px-2.5 sm:px-3 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-white text-xs font-medium transition-all cursor-pointer flex items-center gap-1"
            title="Official NASA Space Apps Challenge Resources"
          >
            <span>NASA Hub</span>
            <ExternalLink className="w-3 h-3 hidden sm:inline" />
          </button>

          {/* Cadet Guide / Academy */}
          <button
            onClick={() => {
              sounds.playClick();
              setShowEduModal(true);
            }}
            className="px-2.5 sm:px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 hover:text-white text-xs font-medium transition-all cursor-pointer hidden md:flex items-center gap-1"
            title="Cadet Guide & Space Science Handbook"
          >
            <BookOpen className="w-3 h-3 text-cyan-400" />
            <span>Guide</span>
          </button>

          {/* Mission Lore / Story */}
          <button
            onClick={() => {
              sounds.playClick();
              setShowStoryModal(true);
            }}
            className="px-2.5 sm:px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 hover:text-white text-xs font-medium transition-all cursor-pointer hidden lg:flex items-center gap-1"
            title="Exodus Story Lore & Background"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Lore</span>
          </button>

          {/* Audio Sound Toggle */}
          <button
            onClick={toggleAudio}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 hover:text-white text-xs transition-all cursor-pointer"
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? (
              <span className="flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden xl:inline text-[11px]">Audio</span>
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden xl:inline text-[11px]">Muted</span>
              </span>
            )}
          </button>

          {/* Quick Reset / New Mission Modal */}
          {state.currentStep !== 'start' && (
            <button
              onClick={() => {
                sounds.playClick();
                setShowResetModal(true);
              }}
              className="p-1.5 sm:p-2 rounded-full border border-white/10 hover:border-red-500/40 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Reset / Start New Mission"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* =========================================================================
          GLOBAL MODALS ACCESSIBLE FROM ANY PAGE VIA NAVBAR
          ========================================================================= */}
      <EducationModal
        isOpen={showEduModal}
        onClose={() => setShowEduModal(false)}
        onStartDemo={() => {
          loadDemoMission();
          setShowEduModal(false);
          setStep('hangar');
        }}
      />

      <NASAChallengeLinksModal
        isOpen={showNasaModal}
        onClose={() => setShowNasaModal(false)}
      />

      <StoryPrologueModal
        isOpen={showStoryModal}
        onClose={() => setShowStoryModal(false)}
        onStartExodus={() => {
          sounds.playSuccess();
          setShowStoryModal(false);
          setStep('hangar');
        }}
      />

      <ConfirmationModal
        isOpen={showResetModal}
        title="Start New Mission?"
        message="This will reset your current spacecraft configuration and return to the mission selection hub."
        confirmLabel="Reset Mission"
        cancelLabel="Keep Building"
        onConfirm={() => {
          sounds.playSelect();
          resetMission();
          setShowResetModal(false);
        }}
        onCancel={() => setShowResetModal(false)}
      />
    </>
  );
};

export default GlobalNavbar;
