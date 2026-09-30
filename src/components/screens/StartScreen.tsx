import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SpaceCanvas } from '../3d/SpaceCanvas';
import { EarthScene } from '../3d/EarthScene';
import { useMission } from '../../context/MissionContext';
import { useTheme } from '../../context/ThemeContext';
import { EducationModal } from '../common/EducationModal';
import { NASAChallengeLinksModal, NASAChallengeFooterBar } from '../common/NASAChallengeLinks';
import { StoryPrologueModal } from '../common/StoryPrologueModal';
import { BragLaunchTrailerDemo } from '../common/BragLaunchTrailerDemo';
import { KidHowToPlaySection } from '../common/KidHowToPlaySection';
import { WhyAndHowChallengeSection } from '../common/WhyAndHowChallengeSection';
import { CadetFAQSection } from '../common/CadetFAQSection';
import { sounds } from '../../utils/soundEffects';

export const StartScreen: React.FC = () => {
  const { setStep, loadDemoMission, selectDestination, launchToPad } = useMission();
  const { theme, toggleTheme } = useTheme();
  
  const [showEduModal, setShowEduModal] = useState(false);
  const [showNasaLinksModal, setShowNasaLinksModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sounds.enabled);

  const handleStartMission = () => {
    sounds.playClick();
    setStep('destination');
  };

  const handleStartExodus = () => {
    sounds.playSuccess();
    selectDestination('new-eden');
    setShowStoryModal(false);
    setStep('hangar');
  };

  const handleDemoMission = () => {
    sounds.playSelect();
    loadDemoMission();
    setStep('hangar');
  };

  const handleSelectPreset = (presetName: string) => {
    sounds.playSuccess();
    loadDemoMission();
    setStep('hangar');
  };

  const toggleAudio = () => {
    const newState = sounds.toggleSound();
    setSoundEnabled(newState);
  };

  return (
    <div className="relative w-full h-full overflow-y-auto flex flex-col items-center justify-between select-none bg-[#f8f7f4] dark:bg-[#09090d] text-slate-900 dark:text-slate-100 transition-colors duration-150 scroll-smooth">
      {/* 3D Background with interactive Earth & Stars */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30 dark:opacity-80 transition-opacity duration-300">
        <SpaceCanvas cameraPosition={[0, 0, 7.5]} fov={42}>
          <EarthScene sceneVariant="depleted" />
        </SpaceCanvas>
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8f7f4] via-[#f8f7f4]/80 to-[#f8f7f4]/40 dark:from-[#09090d] dark:via-[#09090d]/70 dark:to-[#09090d]/80 pointer-events-none transition-colors duration-150" />
      </div>

      {/* Top Sticky Navigation Bar */}
      <header className="sticky top-0 z-30 w-full bg-[#f8f7f4]/95 dark:bg-[#09090d]/95 border-b border-slate-300 dark:border-white/10 transition-colors duration-150">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
          {/* Logo & NASA Challenge Tag */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-amber-500 flex items-center justify-center text-black font-mono font-black text-xs">
              MF
            </div>
            <div>
              <div className="font-display font-black text-xs sm:text-sm tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <span>MISSIONFORGE</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-sm bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                  [EXODUS TO NEW EDEN]
                </span>
              </div>
              <div className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">
                2026 NASA Space Apps Challenge
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={() => {
                sounds.playClick();
                toggleTheme();
              }}
              className="px-2.5 py-1 rounded-sm border border-slate-300 dark:border-white/15 bg-slate-200/80 dark:bg-[#181822] hover:bg-slate-300 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? '[LIGHT]' : '[DARK]'}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleAudio}
              className="px-2 py-1 rounded-sm border border-slate-300 dark:border-white/15 bg-slate-200/80 dark:bg-[#181822] hover:bg-slate-300 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
              title="Toggle Sound Effects"
            >
              {soundEnabled ? '[AUDIO: ON]' : '[AUDIO: OFF]'}
            </button>

            {/* NASA Challenge Resources Button */}
            <button
              onClick={() => {
                sounds.playClick();
                setShowNasaLinksModal(true);
              }}
              className="px-2.5 py-1 rounded-sm border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 font-bold transition-colors cursor-pointer hidden sm:inline"
            >
              [NASA HUB]
            </button>

            {/* Cadet Guide / Education */}
            <button
              onClick={() => {
                sounds.playClick();
                setShowEduModal(true);
              }}
              className="px-2.5 py-1 rounded-sm border border-slate-300 dark:border-white/15 bg-slate-200/80 dark:bg-[#181822] hover:bg-slate-300 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 transition-colors hidden md:inline cursor-pointer"
            >
              [GUIDE]
            </button>

            {/* Direct Play Header Button */}
            <button
              onClick={handleStartExodus}
              className="px-3 py-1 rounded-sm bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-wider transition-colors cursor-pointer ml-1"
            >
              [PLAY NOW ➔]
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-6xl px-4 sm:px-6 py-4 flex flex-col items-center">
        {/* Hero Title & Mission Statement */}
        <div className="text-center max-w-3xl mx-auto my-4 sm:my-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-sm bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
            <span>[2026 NASA SPACE APPS CHALLENGE ENTRY]</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-slate-900 dark:text-white mb-2">
            MISSION<span className="text-amber-500">FORGE</span>
          </h1>

          <p className="font-mono text-xs text-slate-500 tracking-[0.25em] uppercase mb-2 font-bold">
            DESIGN. DECIDE. LAUNCH. EXPLORE.
          </p>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans max-w-xl mx-auto leading-relaxed">
            Earth atmosphere is depleted. Mars resources are exhausted. Engineer humanity interstellar colony starship and navigate to exoplanet New Eden.
          </p>
        </div>

        {/* 1. BRAG LAUNCH TRAILER & DEMO REEL */}
        <div className="w-full mb-8">
          <BragLaunchTrailerDemo onPlayNow={handleStartExodus} />
        </div>

        {/* 2. HOW TO PLAY IN 3 STEPS */}
        <div className="w-full mb-8">
          <KidHowToPlaySection 
            onPlayNow={handleStartExodus} 
            onSelectPreset={handleSelectPreset}
          />
        </div>

        {/* 3. WHY AND HOW IT SOLVES THE CHALLENGE */}
        <div className="w-full mb-8">
          <WhyAndHowChallengeSection onOpenNasaModal={() => setShowNasaLinksModal(true)} />
        </div>

        {/* 4. FREQUENTLY ASKED QUESTIONS */}
        <div className="w-full mb-8">
          <CadetFAQSection />
        </div>
      </main>

      {/* NASA Space Apps Challenge Reference Footer */}
      <NASAChallengeFooterBar onOpenModal={() => setShowNasaLinksModal(true)} />

      {/* Education / Cadet Guide Modal */}
      <EducationModal
        isOpen={showEduModal}
        onClose={() => setShowEduModal(false)}
        onStartDemo={() => {
          handleDemoMission();
          setShowEduModal(false);
        }}
      />

      {/* Official NASA Challenge Links Modal */}
      <NASAChallengeLinksModal
        isOpen={showNasaLinksModal}
        onClose={() => setShowNasaLinksModal(false)}
      />

      {/* Exodus Story Prologue Modal */}
      <StoryPrologueModal
        isOpen={showStoryModal}
        onClose={() => setShowStoryModal(false)}
        onStartExodus={handleStartExodus}
      />
    </div>
  );
};

export default StartScreen;
