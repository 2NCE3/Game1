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
    title: 'THE CRISIS / CALL TO EXODUS',
    tagline: 'Earth atmosphere is spent. Martian shelter resources are depleting. Operation Exodus is authorized.',
    status: 'MISSION BRIEFING ACTIVE',
    telemetry: {
      alt: '400 km LEO',
      speed: '7.8 km/s',
      hull: '100% NOMINAL',
      propellant: 'READY FOR INTEGRATION'
    },
    novaMessage: 'Chief Cadet, Earth cradle is depleted. Construct our interstellar colony vessel for the New Eden voyage.',
    badge: 'STAGE 01 / BRIEFING'
  },
  {
    id: 1,
    title: 'MODULAR LOW-POLY HANGAR',
    tagline: 'Integrate structural bus chassis, high-impulse engines, solar arrays, and seed vault biomes.',
    status: 'SUBSYSTEM INTEGRATION',
    telemetry: {
      alt: 'ORBITAL DOCK 04',
      speed: '0.0 m/s',
      hull: '100% REINFORCED',
      propellant: '12,500 m/s DELTA-V'
    },
    novaMessage: 'Subsystem mass ratio analyzed. Specific impulse and power margin satisfy mission flight parameters.',
    badge: 'STAGE 02 / ASSEMBLY'
  },
  {
    id: 2,
    title: 'INTERSTELLAR ASTEROID CRUISE',
    tagline: 'Execute breakout burn, navigate deep-space asteroid fields, and collect scientific telemetry.',
    status: 'WARP BOOST ENGAGED',
    telemetry: {
      alt: '1.42 AU DEEP SPACE',
      speed: '42.6 km/s',
      hull: '98% STRUCTURAL',
      propellant: '7,400 m/s DELTA-V'
    },
    novaMessage: 'Dense asteroid cluster ahead. Hold throttle boost and adjust yaw vector to maintain clearance.',
    badge: 'STAGE 03 / CRUISE'
  },
  {
    id: 3,
    title: 'NEW EDEN ORBIT & TOUCHDOWN',
    tagline: 'Execute retrograde capture burn, align atmospheric corridor, and touch down on humanity new haven.',
    status: 'ORBITAL CAPTURE CONFIRMED',
    telemetry: {
      alt: '0.0 m SURFACE',
      speed: '0.0 m/s',
      hull: '100% SECURE',
      propellant: 'MISSION SUCCESS'
    },
    novaMessage: 'Retrograde burn nominal. Exoplanet New Eden reached. Civilization colony seed vault safely delivered.',
    badge: 'STAGE 04 / TOUCHDOWN'
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
    <div className="w-full max-w-5xl mx-auto rounded-lg overflow-hidden border border-slate-300 dark:border-white/10 bg-[#f8f7f4] dark:bg-[#09090d] shadow-sm transition-colors duration-150">
      {/* Top Trailer Banner Header */}
      <div className="px-4 py-2.5 bg-slate-200/80 dark:bg-[#111117] border-b border-slate-300 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-sm bg-amber-500/15 border border-amber-500/40 text-amber-600 dark:text-amber-400 text-[10px] font-mono font-bold tracking-widest uppercase">
            [MISSION TRAILER]
          </span>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            2026 NASA Space Apps Challenge
          </span>
        </div>

        {/* View Switcher: Cinematic Trailer vs Free 3D Orbit */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-300/80 dark:bg-[#181822] p-0.5 rounded flex items-center gap-1 text-[11px] font-mono">
            <button
              onClick={() => {
                sounds.playClick();
                setViewMode('trailer');
              }}
              className={`px-2.5 py-1 rounded-sm transition-all cursor-pointer font-bold ${
                viewMode === 'trailer'
                  ? 'bg-amber-500 text-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              [REEL]
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setViewMode('interactive3d');
              }}
              className={`px-2.5 py-1 rounded-sm transition-all cursor-pointer font-bold ${
                viewMode === 'interactive3d'
                  ? 'bg-cyan-500 text-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              [3D MODEL]
            </button>
          </div>

          <button
            onClick={toggleSound}
            className="px-2 py-1 rounded-sm border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 text-[11px] font-mono hover:bg-slate-300 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Toggle Sound Effects"
          >
            {soundOn ? '[AUDIO: ON]' : '[AUDIO: OFF]'}
          </button>
        </div>
      </div>

      {/* Main Visual Display Window (16:9 Aspect Ratio) */}
      <div className="relative aspect-[16/9] w-full bg-[#040711] overflow-hidden select-none">
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

          {/* Hairline grid and border */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        </div>

        {/* Live HUD Watermark / Badge (Top Left) */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-sm bg-black/80 border border-white/15 text-white font-mono text-[11px] font-bold uppercase tracking-wider">
            {currentScene.badge}
          </span>
          <span className="px-2.5 py-1 rounded-sm bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold">
            [{currentScene.status}]
          </span>
        </div>

        {/* Telemetry HUD Panel (Top Right) */}
        <div className="absolute top-3 right-3 z-10 hidden sm:flex flex-col gap-1 p-2.5 rounded-sm bg-black/85 border border-white/15 text-right font-mono text-[11px] text-slate-300">
          <div className="text-[9px] text-slate-500 uppercase tracking-widest border-b border-white/10 pb-0.5">
            TELEMETRY SNAPSHOT
          </div>
          <div>ALT: <span className="text-white font-bold">{currentScene.telemetry.alt}</span></div>
          <div>VEL: <span className="text-amber-400 font-bold">{currentScene.telemetry.speed}</span></div>
          <div>HULL: <span className="text-emerald-400 font-bold">{currentScene.telemetry.hull}</span></div>
          <div>PROP: <span className="text-cyan-400 font-bold">{currentScene.telemetry.propellant}</span></div>
        </div>

        {/* Commander Nova-9 AI Speech Bubble (Bottom Left) */}
        <div className="absolute bottom-14 sm:bottom-16 left-3 right-3 sm:right-auto sm:max-w-md z-10">
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="p-3 rounded-sm bg-black/90 border border-amber-500/40 text-left flex items-start gap-2.5"
          >
            <div className="w-8 h-8 rounded-sm bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 text-xs font-mono font-bold shrink-0">
              N-9
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-bold text-amber-400 font-mono uppercase">COMMANDER NOVA-9</span>
                <span className="text-[9px] text-slate-400 font-mono">[AUTONOMOUS CO-PILOT]</span>
              </div>
              <p className="text-xs text-slate-200 font-sans leading-relaxed">
                "{currentScene.novaMessage}"
              </p>
            </div>
          </motion.div>
        </div>

        {/* Video Reel Control Bar (Bottom Overlay) */}
        <div className="absolute bottom-2.5 left-3 right-3 z-10 flex items-center justify-between bg-black/85 px-3 py-1.5 rounded-sm border border-white/15 text-white text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                sounds.playClick();
                setIsPlaying(!isPlaying);
              }}
              className="px-2 py-0.5 rounded-sm bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
            >
              {isPlaying ? '[PAUSE]' : '[PLAY]'}
            </button>
            <button
              onClick={handlePrevScene}
              className="px-2 py-0.5 rounded-sm bg-white/5 hover:bg-white/15 text-slate-300 transition-colors cursor-pointer"
            >
              [PREV]
            </button>
            <button
              onClick={handleNextScene}
              className="px-2 py-0.5 rounded-sm bg-white/5 hover:bg-white/15 text-slate-300 transition-colors cursor-pointer"
            >
              [NEXT]
            </button>
          </div>

          {/* Scene Scrubber Indices */}
          <div className="flex items-center gap-1">
            {TRAILER_SCENES.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveSceneIndex(idx);
                }}
                className={`px-1.5 py-0.5 rounded-sm text-[10px] transition-all cursor-pointer font-bold ${
                  activeSceneIndex === idx 
                    ? 'bg-amber-500 text-black' 
                    : 'bg-white/10 text-slate-400 hover:text-white'
                }`}
              >
                0{idx + 1}
              </button>
            ))}
          </div>

          {/* Immediate Launch Action */}
          <button
            onClick={() => {
              sounds.playSuccess();
              onPlayNow();
            }}
            className="px-3 py-1 rounded-sm bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
          >
            [ENTER HANGAR]
          </button>
        </div>
      </div>

      {/* Slide Technical Specifications Bar */}
      <div className="p-4 bg-slate-100 dark:bg-[#111117] border-t border-slate-300 dark:border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-left">
        <div>
          <div className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider mb-0.5">
            [SCENE 0{currentScene.id + 1}/04] {currentScene.title}
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-sans max-w-2xl leading-normal">
            {currentScene.tagline}
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playSuccess();
            onPlayNow();
          }}
          className="w-full md:w-auto px-5 py-2.5 rounded-sm bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>BUILD ROCKET & FLY</span>
          <span>[➔]</span>
        </button>
      </div>

      {/* Structural Haired Specs Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-300 dark:divide-white/10 border-t border-slate-300 dark:border-white/10 text-center py-2.5 bg-slate-200/50 dark:bg-[#0d0d12] text-xs font-mono">
        <div className="p-1.5">
          <div className="font-bold text-amber-600 dark:text-amber-400 text-sm">100% NASA</div>
          <div className="text-slate-500 dark:text-slate-400 text-[10px]">Real Planetary Science</div>
        </div>
        <div className="p-1.5">
          <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">CADET 10+</div>
          <div className="text-slate-500 dark:text-slate-400 text-[10px]">High Scannability</div>
        </div>
        <div className="p-1.5">
          <div className="font-bold text-cyan-600 dark:text-cyan-400 text-sm">60 FPS 3D</div>
          <div className="text-slate-500 dark:text-slate-400 text-[10px]">Instanced Meshes</div>
        </div>
        <div className="p-1.5">
          <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">AI COMPANION</div>
          <div className="text-slate-500 dark:text-slate-400 text-[10px]">Commander Nova-9</div>
        </div>
      </div>
    </div>
  );
};
