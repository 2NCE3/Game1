import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpaceCanvas } from '../3d/SpaceCanvas';
import { GalaxySpaceScene } from '../3d/GalaxySpaceScene';
import { useMission } from '../../context/MissionContext';
import { useTheme } from '../../context/ThemeContext';
import { MISSION_BRIEFS, DESTINATIONS } from '../../data/missionsData';
import { EducationModal } from '../common/EducationModal';
import { NASAChallengeLinksModal } from '../common/NASAChallengeLinks';
import { StoryPrologueModal } from '../common/StoryPrologueModal';
import { SatellitesTrackerHUD } from '../common/SatellitesTrackerHUD';
import { sounds } from '../../utils/soundEffects';

export const StartScreen: React.FC = () => {
  const { setStep, selectBrief, loadDemoMission, selectDestination } = useMission();
  const { theme, toggleTheme } = useTheme();

  const [hoveredMissionId, setHoveredMissionId] = useState<string | null>('exodus-new-eden');
  const [showEduModal, setShowEduModal] = useState(false);
  const [showNasaLinksModal, setShowNasaLinksModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sounds.enabled);

  // Active hovered destination for 3D galaxy scene
  const activeDestinationId = hoveredMissionId 
    ? MISSION_BRIEFS.find(b => b.id === hoveredMissionId)?.targetDestinationId || 'new-eden'
    : 'new-eden';

  const handleSelectMission = (briefId: string) => {
    sounds.playSuccess();
    selectBrief(briefId);
  };

  const handleStartExodus = () => {
    sounds.playSuccess();
    selectBrief('exodus-new-eden');
    selectDestination('new-eden');
    setShowStoryModal(false);
    setStep('hangar');
  };

  const handleDemoMission = () => {
    sounds.playSelect();
    loadDemoMission();
    setStep('hangar');
  };

  const toggleAudio = () => {
    const newState = sounds.toggleSound();
    setSoundEnabled(newState);
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col lg:flex-row select-none bg-[#030305] text-[#f5f5f7]">
      {/* =========================================================================
          LEFT / BACKGROUND VIEWPORT: 3D GALAXY VIEW & DEEP SPACE
          ========================================================================= */}
      <div className="relative flex-1 h-[42vh] lg:h-full w-full overflow-hidden bg-[#030305]">
        {/* 3D Galaxy Canvas with OrbitControls */}
        <div className="absolute inset-0 z-0">
          <SpaceCanvas cameraPosition={[0, 4, 13]} fov={48} showStars={false}>
            <GalaxySpaceScene 
              highlightedDestination={activeDestinationId}
              onSelectDestination={(destId) => {
                const match = MISSION_BRIEFS.find(b => b.targetDestinationId === destId);
                if (match) {
                  setHoveredMissionId(match.id);
                }
              }}
            />
          </SpaceCanvas>
        </div>

        {/* Ambient Gradient Overlays for Cinematic Red Gradient Depth */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#030305] via-transparent to-[#030305]/40" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-transparent to-[#030305] opacity-90 hidden lg:block" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Top-Left Floating Minimal HUD */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex flex-col gap-2.5 pointer-events-auto">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/65 border border-red-500/25 backdrop-blur-md shadow-lg text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-bold text-white tracking-wide">3D GALAXY OBSERVATION</span>
            </div>
            
            <SatellitesTrackerHUD 
              onSelectDestination={(destId) => {
                const match = MISSION_BRIEFS.find(b => b.targetDestinationId === destId);
                if (match) {
                  setHoveredMissionId(match.id);
                }
              }}
            />
          </div>

          <div className="text-[11px] text-slate-400 font-mono hidden sm:block pl-1">
            Highlighted Target: <span className="text-red-400 font-bold uppercase">{activeDestinationId}</span> · NASA Deep Space Network Tracking Active
          </div>
        </div>

        {/* Bottom-Left 3D Space Controls Indicator */}
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-red-500/20 text-slate-400 text-xs">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>Interactive 3D Galaxy: Drag to Orbit · Scroll to Zoom</span>
        </div>
      </div>

      {/* =========================================================================
          RIGHT SIDE: MISSION SELECTION PANEL (BLACK THEME & RED GRADIENTS)
          ========================================================================= */}
      <div className="w-full lg:w-[480px] xl:w-[540px] h-[58vh] lg:h-full flex-shrink-0 z-20 flex flex-col bg-[#050508]/95 backdrop-blur-2xl border-t lg:border-t-0 lg:border-l border-red-500/20 shadow-2xl shadow-black relative overflow-hidden">
        {/* Subtle Background Glow Inside Panel */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Panel Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex-shrink-0 bg-[#050508]/60 relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono tracking-wider uppercase text-red-400 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              Mission Directives
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 font-mono">
              {MISSION_BRIEFS.length} Types Available
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5">
            Select Mission <span className="red-gradient-text">Type</span>
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Choose an expedition profile to calibrate the starship hangar, payload science instrumentation, and delta-v trajectory.
          </p>

          {/* Quick Launch Buttons */}
          <div className="grid grid-cols-2 gap-2.5 mt-4">
            <button
              onClick={handleStartExodus}
              className="red-gradient-btn px-3 py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-red-600/25 active:scale-[0.98]"
            >
              <span>Exodus Story Mode</span>
              <span className="text-xs">→</span>
            </button>
            <button
              onClick={handleDemoMission}
              className="px-3 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-red-500/40 text-slate-200 text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <span>Instant Demo Rocket</span>
              <span className="text-xs">⚡</span>
            </button>
          </div>
        </div>

        {/* Scrollable Mission Cards List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 scroll-smooth relative z-10">
          {MISSION_BRIEFS.map((brief) => {
            const dest = DESTINATIONS.find(d => d.id === brief.targetDestinationId);
            const isHovered = hoveredMissionId === brief.id;
            const isExodus = brief.id === 'exodus-new-eden';

            return (
              <motion.div
                key={brief.id}
                onMouseEnter={() => setHoveredMissionId(brief.id)}
                onClick={() => setHoveredMissionId(brief.id)}
                className={`relative rounded-2xl p-4 transition-all duration-200 cursor-pointer border ${
                  isExodus
                    ? isHovered
                      ? 'bg-gradient-to-br from-red-950/60 via-[#0a0508] to-[#12060c] border-red-500 shadow-lg shadow-red-600/25 ring-1 ring-red-500/50'
                      : 'bg-[#0a060a]/90 border-red-500/40 hover:border-red-500/70'
                    : isHovered
                    ? 'bg-white/[0.08] border-red-500/50 shadow-md shadow-red-950/40'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {/* Featured Badge for Exodus */}
                {isExodus && (
                  <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-rose-700 text-white font-mono text-[9px] font-bold tracking-wider uppercase shadow-sm">
                    Flagship Expedition
                  </div>
                )}

                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-sm tracking-tight text-white">
                        {brief.title}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase ${
                        brief.difficulty === 'COMPLEX' 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : brief.difficulty === 'MODERATE'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {brief.difficulty}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mb-2 font-mono">
                      <span>Target: {dest?.name || 'Solar Orbit'}</span>
                      <span>·</span>
                      <span className="text-red-400 font-semibold">${(brief.budget / 1000).toFixed(2)}B Budget</span>
                      <span>·</span>
                      <span>{brief.durationMonths} Mo</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3 line-clamp-2">
                  {brief.objective}
                </p>

                {/* Capabilities Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  {brief.requiredCapabilities.map((cap, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/5 text-[10px] text-slate-400 font-mono"
                    >
                      {cap}
                    </span>
                  ))}
                </div>

                {/* Direct Launch Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectMission(brief.id);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isHovered || isExodus
                      ? 'red-gradient-btn text-white shadow-md shadow-red-600/30'
                      : 'bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/10'
                  }`}
                >
                  <span>Equip & Launch Mission</span>
                  <span>→</span>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Panel Footer */}
        <div className="p-4 border-t border-white/10 bg-[#030305]/80 flex items-center justify-between text-xs text-slate-400 flex-shrink-0">
          <button
            onClick={() => setShowStoryModal(true)}
            className="hover:text-red-400 transition-colors cursor-pointer text-[11px]"
          >
            Mission Lore & Story Prologue
          </button>
          <button
            onClick={() => setShowNasaLinksModal(true)}
            className="text-red-400 hover:text-red-300 transition-colors cursor-pointer font-medium text-[11px] flex items-center gap-1"
          >
            <span>NASA Space Apps Resources</span>
            <span>↗</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          MODALS & OVERLAYS
          ========================================================================= */}
      <EducationModal
        isOpen={showEduModal}
        onClose={() => setShowEduModal(false)}
        onStartDemo={() => {
          handleDemoMission();
          setShowEduModal(false);
        }}
      />

      <NASAChallengeLinksModal
        isOpen={showNasaLinksModal}
        onClose={() => setShowNasaLinksModal(false)}
      />

      <StoryPrologueModal
        isOpen={showStoryModal}
        onClose={() => setShowStoryModal(false)}
        onStartExodus={handleStartExodus}
      />
    </div>
  );
};

export default StartScreen;
