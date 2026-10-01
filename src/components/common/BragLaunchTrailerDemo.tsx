import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpaceCanvas } from '../3d/SpaceCanvas';
import { EarthScene } from '../3d/EarthScene';
import { RocketViewer } from '../3d/RocketViewer';
import { sounds } from '../../utils/soundEffects';

interface BragScene {
  id: number;
  title: string;
  tagline: string;
  status: string;
  telemetry: {
    alt: string;
    speed: string;
    hull: string;
    propellant: string;
  };
  novaMessage: string;
  badge: string;
}

const TRAILER_SCENES: BragScene[] = [
  {
    id: 0,
    title: 'The Call to Exodus',
    tagline: 'Earth atmosphere is spent. Martian shelter resources are depleting. Operation Exodus is authorized.',
    status: 'Mission Briefing Active',
    telemetry: {
      alt: '400 km LEO',
      speed: '7.8 km/s',
      hull: '100% Nominal',
      propellant: 'Ready for Integration'
    },
    novaMessage: 'Earth cradle is depleted. Construct our interstellar colony vessel for the New Eden voyage.',
    badge: 'Stage 1 · Briefing'
  },
  {
    id: 1,
    title: 'Modular Starship Hangar',
    tagline: 'Integrate structural bus chassis, high-impulse engines, solar arrays, and seed vault biomes.',
    status: 'Subsystem Assembly',
    telemetry: {
      alt: 'Orbital Dock 04',
      speed: '0.0 m/s',
      hull: '100% Reinforced',
      propellant: '12,500 m/s Delta-V'
    },
    novaMessage: 'Subsystem mass ratio verified. Specific impulse and power margin satisfy flight parameters.',
    badge: 'Stage 2 · Assembly'
  },
  {
    id: 2,
    title: 'Interstellar Cruise',
    tagline: 'Execute breakout burn, navigate deep-space asteroid fields, and collect scientific telemetry.',
    status: 'Transit Boost Nominal',
    telemetry: {
      alt: '1.42 AU Deep Space',
      speed: '42.6 km/s',
      hull: '98% Structural',
      propellant: '7,400 m/s Delta-V'
    },
    novaMessage: 'Asteroid cluster ahead. Hold throttle boost and adjust yaw vector to maintain clearance.',
    badge: 'Stage 3 · Cruise'
  },
  {
    id: 3,
    title: 'New Eden Orbital Arrival',
    tagline: 'Execute retrograde capture burn, align atmospheric corridor, and touch down on humanity new haven.',
    status: 'Orbital Capture Confirmed',
    telemetry: {
      alt: '0.0 m Surface',
      speed: '0.0 m/s',
      hull: '100% Secure',
      propellant: 'Mission Complete'
    },
    novaMessage: 'Retrograde burn nominal. Exoplanet New Eden reached. Colony seed vault safely delivered.',
    badge: 'Stage 4 · Touchdown'
  }
];

interface BragLaunchTrailerDemoProps {
  onPlayNow: () => void;
}

export const BragLaunchTrailerDemo: React.FC<BragLaunchTrailerDemoProps> = ({ onPlayNow }) => {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [viewMode, setViewMode] = useState<'trailer' | 'interactive3d'>('trailer');
  const [soundOn, setSoundOn] = useState(sounds.enabled);

  // Auto-advance trailer scenes when playing
  useEffect(() => {
    if (!isPlaying || viewMode !== 'trailer') return;
    const interval = setInterval(() => {
      setActiveSceneIndex(prev => (prev + 1) % TRAILER_SCENES.length);
      sounds.playSelect();
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, viewMode]);

  const currentScene = TRAILER_SCENES[activeSceneIndex];

  const handleNextScene = () => {
    sounds.playClick();
    setActiveSceneIndex(prev => (prev + 1) % TRAILER_SCENES.length);
  };

  const handlePrevScene = () => {
    sounds.playClick();
    setActiveSceneIndex(prev => (prev - 1 + TRAILER_SCENES.length) % TRAILER_SCENES.length);
  };

  const toggleSound = () => {
    const state = sounds.toggleSound();
    setSoundOn(state);
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 bg-white/80 dark:bg-[#121217]/75 backdrop-blur-2xl shadow-xl transition-all duration-200">
      {/* Top Trailer Banner Header (Apple Frosted Bar) */}
      <div className="px-5 py-3 bg-black/[0.02] dark:bg-white/[0.02] border-b border-black/5 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#0071e3] dark:text-blue-400 text-xs font-medium">
            Interactive Trailer
          </span>
          <span className="text-xs text-[#86868b] font-normal">
            2026 NASA Space Apps Challenge
          </span>
        </div>

        {/* View Switcher: Apple Segmented Pill */}
        <div className="flex items-center gap-2.5">
          <div className="bg-black/[0.05] dark:bg-white/[0.08] p-1 rounded-full flex items-center gap-1 text-xs">
            <button
              onClick={() => {
                sounds.playClick();
                setViewMode('trailer');
              }}
              className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer font-medium ${
                viewMode === 'trailer'
                  ? 'bg-white dark:bg-white text-black shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Reel
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setViewMode('interactive3d');
              }}
              className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer font-medium ${
                viewMode === 'interactive3d'
                  ? 'bg-white dark:bg-white text-black shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              3D Starship
            </button>
          </div>

          <button
            onClick={toggleSound}
            className="px-3 py-1.5 rounded-full border border-black/5 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
            title="Toggle Sound Effects"
          >
            {soundOn ? 'Audio: On' : 'Audio: Off'}
          </button>
        </div>
      </div>

      {/* Main Visual Display Window (16:9 Aspect Ratio) */}
      <div className="relative aspect-[16/9] w-full bg-[#06070a] overflow-hidden select-none">
        {/* Render 3D Background with Dynamic Globe Color per Slide */}
        <div className="absolute inset-0 z-0">
          {viewMode === 'interactive3d' ? (
            <SpaceCanvas cameraPosition={[0, 2, 8]} fov={45}>
              <RocketViewer 
                vehicle={{
                  id: 'launch-medium',
                  name: 'EXODUS STARSHIP',
                  tier: 'SUPER HEAVY',
                  payloadCapacity: 25000,
                  launchCost: 1200,
                  thrustKn: 12500,
                  heightM: 70,
                  reliability: 99,
                  description: 'Deep Space Interstellar Colony Vessel'
                }} 
              />
            </SpaceCanvas>
          ) : (
            <SpaceCanvas cameraPosition={[0, 0, 7.5]} fov={44}>
              <EarthScene sceneVariant={activeSceneIndex} />
            </SpaceCanvas>
          )}

          {/* Smooth Vignette */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        </div>

        {/* Live HUD Watermark / Badge (Top Left) */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-white text-xs font-medium">
            {currentScene.badge}
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 backdrop-blur-xl border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            {currentScene.status}
          </span>
        </div>

        {/* Telemetry HUD Panel (Top Right Apple Glass Card) */}
        <div className="absolute top-4 right-4 z-10 hidden sm:flex flex-col gap-1 p-3 rounded-2xl bg-black/50 backdrop-blur-2xl border border-white/10 text-right text-xs text-slate-300">
          <div className="text-[10px] text-[#86868b] tracking-wider uppercase border-b border-white/10 pb-1 font-medium">
            Telemetry Snapshot
          </div>
          <div>Altitude: <span className="text-white font-semibold telemetry-val">{currentScene.telemetry.alt}</span></div>
          <div>Velocity: <span className="text-white font-semibold telemetry-val">{currentScene.telemetry.speed}</span></div>
          <div>Integrity: <span className="text-emerald-400 font-semibold telemetry-val">{currentScene.telemetry.hull}</span></div>
          <div>Delta-V: <span className="text-[#2997ff] font-semibold telemetry-val">{currentScene.telemetry.propellant}</span></div>
        </div>

        {/* Commander Nova-9 AI Speech Bubble (Bottom Left Apple Glass) */}
        <div className="absolute bottom-16 sm:bottom-18 left-4 right-4 sm:right-auto sm:max-w-md z-10">
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="p-3.5 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/10 text-left flex items-start gap-3 shadow-xl"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0071e3] to-cyan-400 flex items-center justify-center text-white text-xs font-semibold shrink-0 shadow-sm">
              N9
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-semibold text-white">Commander Nova-9</span>
                <span className="text-[10px] text-[#86868b]">Autonomous Co-Pilot</span>
              </div>
              <p className="text-xs text-slate-200 font-normal leading-relaxed">
                "{currentScene.novaMessage}"
              </p>
            </div>
          </motion.div>
        </div>

        {/* Video Reel Control Bar (Floating Glass Scrubber Pill) */}
        <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between bg-black/60 backdrop-blur-2xl px-4 py-2 rounded-full border border-white/10 text-white text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                setIsPlaying(!isPlaying);
              }}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white cursor-pointer font-medium"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={handlePrevScene}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 transition-all cursor-pointer font-medium"
            >
              Previous
            </button>
            <button
              onClick={handleNextScene}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 transition-all cursor-pointer font-medium"
            >
              Next
            </button>
          </div>

          {/* Scene Scrubber Indices */}
          <div className="flex items-center gap-1.5">
            {TRAILER_SCENES.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveSceneIndex(idx);
                }}
                className={`w-6 h-6 rounded-full text-xs transition-all duration-200 cursor-pointer font-medium flex items-center justify-center ${
                  activeSceneIndex === idx 
                    ? 'bg-white text-black font-semibold shadow-sm' 
                    : 'bg-white/10 text-white/60 hover:text-white'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {/* Immediate Launch Action */}
          <button
            onClick={() => {
              sounds.playSuccess();
              onPlayNow();
            }}
            className="px-4 py-1.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-xs shadow-sm shadow-blue-500/25 transition-all cursor-pointer"
          >
            Enter Hangar →
          </button>
        </div>
      </div>

      {/* Slide Technical Specifications Bar */}
      <div className="p-5 bg-black/[0.01] dark:bg-white/[0.01] border-t border-black/5 dark:border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-left">
        <div>
          <div className="text-xs font-semibold text-[#0071e3] dark:text-[#2997ff] uppercase tracking-wider mb-1">
            Scene 0{currentScene.id + 1}: {currentScene.title}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 font-normal max-w-2xl leading-relaxed">
            {currentScene.tagline}
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playSuccess();
            onPlayNow();
          }}
          className="w-full md:w-auto px-6 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-xs shadow-md shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shrink-0 hover:scale-[1.02]"
        >
          <span>Build Starship & Launch</span>
          <span>→</span>
        </button>
      </div>

      {/* Structural Haired Specs Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-black/5 dark:divide-white/10 border-t border-black/5 dark:border-white/10 text-center py-3 bg-black/[0.02] dark:bg-white/[0.02] text-xs">
        <div className="p-2">
          <div className="font-semibold text-slate-900 dark:text-white text-sm">Real NASA Data</div>
          <div className="text-[#86868b] text-xs">Authentic Astrodynamics</div>
        </div>
        <div className="p-2">
          <div className="font-semibold text-slate-900 dark:text-white text-sm">Age 10+ Friendly</div>
          <div className="text-[#86868b] text-xs">Intuitive Visual Scales</div>
        </div>
        <div className="p-2">
          <div className="font-semibold text-slate-900 dark:text-white text-sm">60 FPS Real-Time</div>
          <div className="text-[#86868b] text-xs">Three.js Flight Canvas</div>
        </div>
        <div className="p-2">
          <div className="font-semibold text-slate-900 dark:text-white text-sm">Commander Nova-9</div>
          <div className="text-[#86868b] text-xs">AI Advisory Telemetry</div>
        </div>
      </div>
    </div>
  );
};
