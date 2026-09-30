import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  Activity, 
  Clock, 
  Compass, 
  Radio, 
  Zap, 
  Fuel, 
  Thermometer, 
  Wifi, 
  AlertTriangle, 
  ShieldAlert, 
  FastForward, 
  Play, 
  Square,
  ChevronRight,
  Terminal,
  Sparkles,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { DESTINATIONS } from '../../data/missionsData';
import { SpaceCanvas } from '../3d/SpaceCanvas';
import { LaunchSimulationScene } from '../3d/LaunchSimulationScene';
import { sounds } from '../../utils/soundEffects';
import { LaunchMinigame } from '../game/LaunchMinigame';
import { CockpitView3D } from '../game/CockpitView3D';
import { PlanetLanderGame } from '../game/PlanetLanderGame';
import { LowPolyWorldGame } from '../game/LowPolyWorldGame';
import { ErrorBoundary } from '../common/ErrorBoundary';

export const Screen09Simulation: React.FC = () => {
  const { 
    state, 
    telemetry, 
    eventLogs, 
    countdownNumber, 
    simSpeed, 
    setSimSpeed, 
    abortSimulation,
    activeDecision,
    resolveDecision,
    cadetMode,
    setStep
  } = useMission();

  const [activeView, setActiveView] = useState<'launch_pad' | 'lowpoly_world' | 'launch_minigame' | 'cockpit_3d' | 'planet_lander'>('launch_pad');

  const destination = DESTINATIONS.find(d => d.id === state.destinationId) || DESTINATIONS[0];

  const timelineSteps = [
    { label: 'PAD LIFTOFF', at: 0, tag: '[01/07]' },
    { label: 'STAGE SEPARATION', at: 15, tag: '[02/07]' },
    { label: 'ORBIT INSERTION', at: 30, tag: '[03/07]' },
    { label: 'TRANS-INJECTION', at: 45, tag: '[04/07]' },
    { label: 'CRUISE & CORRECTION', at: 65, tag: '[05/07]' },
    { label: 'DESTINATION ARRIVAL', at: 85, tag: '[06/07]' },
    { label: 'SCIENCE RETURN', at: 100, tag: '[07/07]' },
  ];

  // Play sound when active decision pops up
  useEffect(() => {
    if (activeDecision) {
      sounds.playAlert();
    }
  }, [activeDecision]);

  // Child-friendly commentary from Commander Nova based on progress
  const getCadetCommentary = () => {
    const p = telemetry.distanceProgressPercent;
    if (countdownNumber !== null && countdownNumber > 0) {
      return `T-${countdownNumber} SECONDS: All systems verified nominal. Final count for liftoff.`;
    }
    if (p < 15) {
      return `LIFTOFF: Booster engines at full thrust. Vehicle climbing through initial flight corridor.`;
    }
    if (p < 30) {
      return `Stage separation confirmed. First-stage booster jettisoned. Orbital insertion burn active.`;
    }
    if (p < 50) {
      return `Trans-injection engine burn. Spacecraft outbound toward ${destination.name}. Solar arrays deployed.`;
    }
    if (p < 75) {
      return `Interplanetary cruise phase. Flight computers transmitting continuous telemetry to Ground Control.`;
    }
    if (p < 95) {
      return `Approaching target orbital capture at ${destination.name}. Deceleration thrusters firing on vector.`;
    }
    return `Science operations successful. High-resolution multispectral instruments active and logging data.`;
  };

  if (activeView === 'lowpoly_world') {
    return (
      <div className="relative w-full h-full flex flex-col bg-space-950">
        {/* Navigation Switcher Header */}
        <div className="h-10 bg-space-950/95 border-b border-slate-800/80 px-4 flex items-center justify-between text-xs font-mono z-30">
          <div className="flex items-center gap-2">
            <span className="text-nasa-cyan font-bold flex items-center gap-1.5">
              <span className="text-[10px] px-1 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">[3D]</span>
              <span>LOW-POLY PLANET ODYSSEY</span>
            </span>
            <span className="text-slate-400 hidden sm:inline">| Surface Base to Interplanetary Spaceflight ({destination.name})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveView('launch_pad');
              }}
              className="px-2.5 py-1 rounded-sm bg-blue-950/80 border border-blue-500/50 hover:bg-blue-900 text-blue-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              <Rocket className="w-3 h-3 text-blue-400" />
              <span>LAUNCH PAD</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveView('launch_minigame');
              }}
              className="px-2.5 py-1 rounded-sm bg-orange-950/80 border border-orange-500/50 hover:bg-orange-900 text-orange-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              <span>ASCENT PILOT</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveView('cockpit_3d');
              }}
              className="px-2.5 py-1 rounded-sm bg-cyan-950/80 border border-cyan-500/50 hover:bg-cyan-900 text-cyan-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              <span>3D COCKPIT</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveView('planet_lander');
              }}
              className="px-2.5 py-1 rounded-sm bg-emerald-950/80 border border-emerald-500/50 hover:bg-emerald-900 text-emerald-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              <span>LANDER</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                abortSimulation();
              }}
              className="px-2.5 py-1 rounded-sm bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 text-[11px] flex items-center gap-1 transition-colors"
            >
              <Square className="w-3 h-3" />
              <span>ABORT</span>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <LowPolyWorldGame
            onSuccess={() => {
              sounds.playSuccess();
              setStep('results');
            }}
            onEnterLaunchPad={() => setActiveView('launch_pad')}
            onEnterCockpit={() => setActiveView('cockpit_3d')}
            onEnterLander={() => setActiveView('planet_lander')}
            onReturnToHangar={() => abortSimulation()}
          />
        </div>
      </div>
    );
  }

  if (activeView === 'launch_minigame') {
    return (
      <div className="relative w-full h-full flex flex-col bg-space-950">
        {/* Quick View Switcher banner */}
        <div className="h-10 bg-space-950/95 border-b border-slate-800/80 px-4 flex items-center justify-between text-xs font-mono z-30">
          <div className="flex items-center gap-2">
            <span className="text-nasa-orange font-bold flex items-center gap-1.5">
              <Rocket className="w-3.5 h-3.5" />
              <span>PHASE 1: ASCENT LAUNCH PILOT</span>
            </span>
            <span className="text-slate-400 hidden sm:inline">| Hold [SPACE] to throttle, [A/D] to match gravity turn corridor</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveView('launch_pad');
              }}
              className="px-2.5 py-1 rounded-sm bg-blue-950/80 border border-blue-500/50 hover:bg-blue-900 text-blue-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              <Rocket className="w-3 h-3 text-blue-400" />
              <span>LAUNCH PAD</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveView('lowpoly_world');
              }}
              className="px-2.5 py-1 rounded-sm bg-purple-950/80 border border-purple-500/50 hover:bg-purple-900 text-purple-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              <span>3D PLANET WORLD</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveView('cockpit_3d');
              }}
              className="px-2.5 py-1 rounded-sm bg-cyan-950/80 border border-cyan-500/50 hover:bg-cyan-900 text-cyan-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              <span>3D COCKPIT</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveView('planet_lander');
              }}
              className="px-2.5 py-1 rounded-sm bg-emerald-950/80 border border-emerald-500/50 hover:bg-emerald-900 text-emerald-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              <span>LANDER</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                abortSimulation();
              }}
              className="px-2.5 py-1 rounded-sm bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 text-[11px] flex items-center gap-1 transition-colors"
            >
              <Square className="w-3 h-3" />
              <span>ABORT</span>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <LaunchMinigame
            onSuccess={() => setActiveView('cockpit_3d')}
            onReturnToHangar={() => abortSimulation()}
          />
        </div>
      </div>
    );
  }

  if (activeView === 'cockpit_3d') {
    return (
      <div className="relative w-full h-full flex flex-col bg-space-950">
        {/* Navigation Switcher Header */}
        <div className="h-10 bg-space-950/95 border-b border-slate-800/80 px-4 flex items-center justify-between text-xs font-mono z-30">
          <div className="flex items-center gap-2">
            <span className="text-nasa-cyan font-bold flex items-center gap-1.5">
              <span className="text-[10px] px-1 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">[HUD]</span>
              <span>PHASE 2: 3D FIRST-PERSON COCKPIT FLIGHT</span>
            </span>
            <span className="text-slate-400 hidden sm:inline">| Steer [A/D], Shields [W], Lasers [SPACE], Throttle slider</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveView('lowpoly_world');
              }}
              className="px-2.5 py-1 rounded-sm bg-purple-950/80 border border-purple-500/50 hover:bg-purple-900 text-purple-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              <span>3D PLANET WORLD</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveView('launch_pad');
              }}
              className="px-2.5 py-1 rounded-sm bg-blue-950/80 border border-blue-500/50 hover:bg-blue-900 text-blue-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              <Rocket className="w-3 h-3 text-blue-400" />
              <span>LAUNCH PAD</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveView('launch_minigame');
              }}
              className="px-2.5 py-1 rounded-sm bg-space-900 border border-slate-700 hover:bg-slate-800 text-slate-300 text-[11px] flex items-center gap-1 transition-colors"
            >
              <span>ASCENT PILOT</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveView('planet_lander');
              }}
              className="px-2.5 py-1 rounded-sm bg-emerald-950/80 border border-emerald-500/50 hover:bg-emerald-900 text-emerald-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              <span>LANDER</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                abortSimulation();
              }}
              className="px-2 py-1 rounded-sm bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 text-[11px] flex items-center gap-1 transition-colors"
            >
              <Square className="w-3 h-3" />
              <span>ABORT</span>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <CockpitView3D
            destinationName={destination.name}
            onArrival={() => setActiveView('planet_lander')}
            onEmergencyAbort={() => abortSimulation()}
          />
        </div>
      </div>
    );
  }

  if (activeView === 'planet_lander') {
    return (
      <div className="relative w-full h-full flex flex-col bg-space-950">
        {/* Navigation Switcher Header */}
        <div className="h-10 bg-space-950/95 border-b border-slate-800/80 px-4 flex items-center justify-between text-xs font-mono z-30">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="text-[10px] px-1 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300">[DESCENT]</span>
              <span>PHASE 3: ATMOSPHERIC ENTRY & POWERED DESCENT</span>
            </span>
            <span className="text-slate-400 hidden sm:inline">| Hold [SPACE] to fire retro-thrusters, [A/D] to level tilt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveView('launch_pad');
              }}
              className="px-2.5 py-1 rounded-sm bg-blue-950/80 border border-blue-500/50 hover:bg-blue-900 text-blue-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              <Rocket className="w-3 h-3 text-blue-400" />
              <span>LAUNCH PAD</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveView('lowpoly_world');
              }}
              className="px-2.5 py-1 rounded-sm bg-purple-950/80 border border-purple-500/50 hover:bg-purple-900 text-purple-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              <span>3D PLANET WORLD</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveView('cockpit_3d');
              }}
              className="px-2.5 py-1 rounded-sm bg-space-900 border border-slate-700 hover:bg-slate-800 text-slate-300 text-[11px] flex items-center gap-1 transition-colors"
            >
              <span>3D COCKPIT</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                abortSimulation();
              }}
              className="px-2 py-1 rounded-sm bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 text-[11px] flex items-center gap-1 transition-colors"
            >
              <Square className="w-3 h-3" />
              <span>ABORT</span>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <PlanetLanderGame
            destinationName={destination.name}
            onSuccess={() => {
              sounds.playSuccess();
              setStep('results');
            }}
            onReturnToHangar={() => abortSimulation()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-space-950 flex flex-col justify-between overflow-hidden scanlines">
      {/* Top Telemetry & Controls Banner */}
      <div className="h-14 bg-space-950/95 border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between z-20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="font-mono text-xs font-bold text-white tracking-widest uppercase">
              LIVE TELEMETRY // {state.missionName}
            </span>
          </div>
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <div className="font-mono text-xs text-nasa-cyan font-bold tracking-wider telemetry-val hidden sm:block">
            TIME: {telemetry.missionTime}
          </div>
        </div>

        {/* Speed Controls & Abort */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveView('lowpoly_world');
            }}
            className="px-2.5 py-1 rounded-sm bg-purple-950/70 border border-purple-500/60 hover:bg-purple-900/70 text-purple-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-all mr-2"
          >
            <span>3D PLANET WORLD</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveView('launch_minigame');
            }}
            className="px-2.5 py-1 rounded-sm bg-orange-950/60 border border-orange-500/60 hover:bg-orange-900/60 text-orange-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-all mr-2"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>REFLY LAUNCH</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveView('cockpit_3d');
            }}
            className="px-2.5 py-1 rounded-sm bg-cyan-950/60 border border-cyan-500/60 hover:bg-cyan-900/60 text-cyan-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-all mr-2"
          >
            <span>3D COCKPIT</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveView('planet_lander');
            }}
            className="px-2.5 py-1 rounded-sm bg-emerald-950/60 border border-emerald-500/60 hover:bg-emerald-900/60 text-emerald-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-all mr-2"
          >
            <span>LANDER</span>
          </button>

          <span className="text-[10px] font-mono text-slate-400 mr-1 hidden sm:inline">WARP SPEED:</span>
          {[1, 2, 4].map(s => (
            <button
              key={s}
              onClick={() => {
                sounds.playClick();
                setSimSpeed(s);
              }}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                simSpeed === s 
                  ? 'bg-nasa-cyan text-black shadow-md' 
                  : 'bg-space-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {s}x
            </button>
          ))}

          <div className="h-4 w-px bg-slate-800 mx-1 sm:mx-2" />

          <button
            onClick={() => {
              sounds.playClick();
              abortSimulation();
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-700/60 text-red-300 text-xs font-mono transition-colors"
          >
            <Square className="w-3.5 h-3.5" />
            <span>ABORT</span>
          </button>
        </div>
      </div>

      {/* Cadet Mode: Commander Nova Live Guidance Banner */}
      {cadetMode && (
        <div className="bg-space-900 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs z-20 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
              [NOVA-09]
            </span>
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                FLIGHT DIRECTOR COMMENTARY:
              </span>
              <p className="text-xs text-white font-sans font-medium">
                {getCadetCommentary()}
              </p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-space-950/80 px-2.5 py-1 rounded-sm border border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AUTOPILOT ENGAGED</span>
          </div>
        </div>
      )}

      {/* Main Simulation Viewport */}
      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        {/* Left Column: Mission Timeline Progression */}
        <div className="w-64 bg-space-900/80 border-r border-slate-800/80 p-4 flex flex-col justify-between z-10 backdrop-blur-md hidden xl:flex">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-nasa-cyan" />
              <span>FLIGHT MILESTONES</span>
            </div>

            <div className="space-y-4 relative">
              <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-800" />

              {timelineSteps.map((step, idx) => {
                const isPassed = telemetry.distanceProgressPercent >= step.at;

                return (
                  <div key={idx} className="flex items-center gap-3 relative z-10 font-mono text-xs">
                    <div className={`w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold transition-all ${
                      isPassed 
                        ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' 
                        : 'bg-space-950 border border-slate-700 text-slate-500'
                    }`}>
                      {isPassed ? '✓' : idx + 1}
                    </div>
                    <div>
                      <div className={`text-xs font-semibold flex items-center gap-1.5 ${isPassed ? 'text-white' : 'text-slate-500'}`}>
                        <span className="text-[10px] text-nasa-cyan font-mono">{step.tag}</span>
                        <span>{step.label}</span>
                      </div>
                      <div className="text-[9px] text-slate-500">
                        {step.at}% REACHED
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-space-950/70 border border-slate-800 rounded-sm text-[10px] font-mono text-slate-400">
            <span className="text-nasa-cyan font-bold block mb-0.5">CURRENT FLIGHT REGIME:</span>
            <span className="text-white text-xs">{telemetry.stageName}</span>
          </div>
        </div>

        {/* Center: 3D Flight Simulation Canvas */}
        <div className="flex-1 h-full relative bg-space-950">
          <ErrorBoundary fallbackTitle="LAUNCH PAD 3D GRAPHICS">
            <SpaceCanvas cameraPosition={[0, 0, 8]} fov={50}>
              <LaunchSimulationScene
                progressPercent={telemetry.distanceProgressPercent}
                countdownNumber={countdownNumber}
                destination={destination}
              />
            </SpaceCanvas>
          </ErrorBoundary>

          {/* Countdown Cinematic Overlay */}
          <AnimatePresence>
            {countdownNumber !== null && countdownNumber > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/65 backdrop-blur-sm z-30 pointer-events-none"
              >
                <div className="text-slate-300 font-mono text-sm tracking-[0.4em] uppercase mb-2">
                  TERMINAL COUNTDOWN SEQUENCE
                </div>
                <div className="font-display font-black text-9xl text-white telemetry-val drop-shadow-2xl animate-bounce">
                  {countdownNumber}
                </div>
                <div className="text-nasa-orange font-mono text-sm tracking-widest uppercase mt-4 animate-pulse">
                  MAIN ENGINES IGNITION IN T-{countdownNumber} SECONDS
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dynamic Flight Alert / In-Flight Decision Popup */}
          <AnimatePresence>
            {activeDecision && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="absolute inset-x-4 sm:inset-x-12 top-16 z-40 max-w-xl mx-auto p-5 sm:p-6 bg-space-900/95 border border-amber-500 rounded-sm shadow-2xl backdrop-blur-2xl"
              >
                <div className="flex items-center gap-3 pb-3 mb-3 border-b border-amber-500/30 text-amber-400 font-mono text-xs font-bold tracking-wider uppercase">
                  <div className="w-8 h-8 rounded-sm bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-xs font-bold shrink-0">
                    [!]
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-400 block font-bold">MISSION DECISION REQUIRED // FLIGHT DIRECTIVE</span>
                    <span className="text-white text-sm font-sans font-bold">{activeDecision.title}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4 font-sans">
                  {activeDecision.description}
                </p>

                <div className="grid grid-cols-2 gap-2 p-2.5 bg-space-950/80 rounded-sm font-mono text-[11px] mb-4 border border-slate-800">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">CURRENT VALUE</span>
                    <span className="text-amber-400 font-bold">{activeDecision.currentMetric}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">SAFE MARGIN</span>
                    <span className="text-emerald-400 font-bold">{activeDecision.requiredMetric}</span>
                  </div>
                </div>

                <div className="text-xs text-amber-300 font-sans mb-4 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{activeDecision.consequence}</span>
                </div>

                <div className="space-y-2.5">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                    SELECT FLIGHT ACTION:
                  </div>
                  {activeDecision.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        sounds.playSelect();
                        resolveDecision(idx);
                      }}
                      className="w-full text-left p-3 rounded-sm bg-space-850 hover:bg-space-800 border border-slate-700 hover:border-nasa-cyan text-xs font-mono transition-all group shadow-sm"
                    >
                      <div className="font-bold text-white group-hover:text-nasa-cyan flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-slate-800 text-slate-300 font-mono">[{idx === 0 ? 'OPTION A' : 'OPTION B'}]</span>
                          <span>{opt.label}</span>
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-nasa-cyan" />
                      </div>
                      <div className="text-xs text-slate-300 mt-1 font-sans">
                        {opt.description}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Central Live HUD overlay info */}
          <div className="absolute top-4 left-4 z-10 p-2.5 rounded-xl bg-space-900/85 border border-slate-800 text-xs font-mono text-slate-300 backdrop-blur-md pointer-events-none">
            <span className="text-[10px] text-nasa-cyan block font-bold">CURRENT REGIME</span>
            <div className="text-white font-bold">{telemetry.stageName}</div>
          </div>
        </div>

        {/* Right Column: Live Telemetry Gauges */}
        <div className="w-full lg:w-72 bg-space-900/80 border-t lg:border-t-0 lg:border-l border-slate-800/80 p-4 flex flex-col justify-between z-10 backdrop-blur-md overflow-y-auto">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-nasa-cyan" />
              <span>LIVE TELEMETRY</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {/* Altitude */}
              <div className="p-2 bg-space-950/70 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    ALTITUDE
                  </span>
                  <span className="text-white font-bold telemetry-val">
                    {telemetry.altitudeKm.toLocaleString()} km
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{ width: `${Math.min(100, (telemetry.altitudeKm / 400) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Velocity */}
              <div className="p-2 bg-space-950/70 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                    <FastForward className="w-3.5 h-3.5 text-blue-400" />
                    VELOCITY
                  </span>
                  <span className="text-white font-bold telemetry-val">
                    {telemetry.velocityKms} km/s
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-400 transition-all duration-300"
                    style={{ width: `${Math.min(100, (telemetry.velocityKms / 12) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Fuel Remaining */}
              <div className="p-2 bg-space-950/70 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                    <Fuel className="w-3.5 h-3.5 text-orange-400" />
                    FUEL / PROPELLANT
                  </span>
                  <span className={`font-bold telemetry-val ${telemetry.fuelPercent < 20 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                    {telemetry.fuelPercent}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${telemetry.fuelPercent < 20 ? 'bg-red-500' : 'bg-orange-400'}`}
                    style={{ width: `${telemetry.fuelPercent}%` }}
                  />
                </div>
              </div>

              {/* Power Output */}
              <div className="p-2 bg-space-950/70 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                    <Zap className="w-3.5 h-3.5 text-yellow-400" />
                    ELECTRICAL
                  </span>
                  <span className="text-white font-bold telemetry-val">
                    {telemetry.powerWatts} W
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 transition-all duration-300"
                    style={{ width: `${Math.min(100, (telemetry.powerWatts / 500) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Temperature */}
              <div className="p-2 bg-space-950/70 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                    <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                    TEMPERATURE
                  </span>
                  <span className="text-white font-bold telemetry-val">
                    {telemetry.tempCelsius}°C
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-400 transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, (telemetry.tempCelsius + 50) / 150) * 100)}%` }}
                  />
                </div>
              </div>

              {/* DSN Signal */}
              <div className="p-2 bg-space-950/70 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                    <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                    RADIO LINK
                  </span>
                  <span className="text-emerald-400 font-bold telemetry-val">
                    {telemetry.signalStrength}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-400 transition-all duration-300"
                    style={{ width: `${telemetry.signalStrength}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Overall Progress Gauge */}
          <div className="mt-3 pt-2.5 border-t border-slate-800 font-mono text-xs">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span>PROGRESS TO {destination.name.toUpperCase()}</span>
              <span className="text-nasa-cyan font-bold">{Math.round(telemetry.distanceProgressPercent)}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-nasa-orange via-cyan-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${telemetry.distanceProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Big Chunky Tactile Phone Game Action Button */}
          <div className="mt-3 pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                sounds.playLaunch();
                setActiveView('lowpoly_world');
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-400 hover:to-amber-400 active:scale-95 text-black font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Rocket className="w-4 h-4 fill-black" />
              <span>3D PLANET ODYSSEY // ENGAGE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Event Log Bar */}
      <div className="h-28 bg-space-950 border-t border-slate-800/80 px-4 sm:px-6 py-2.5 z-20 flex flex-col justify-between font-mono text-xs">
        <div className="flex items-center justify-between pb-1 border-b border-slate-800/60 text-[10px] text-slate-400 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-nasa-cyan" />
            <span>FLIGHT EVENT LOG & DSN GROUND PASS TRANSACTIONS</span>
          </div>
          <span className="text-slate-500">LIVE DSN STREAM</span>
        </div>

        <div className="overflow-y-auto space-y-1.5 text-[11px] pr-2 max-h-16 flex flex-col-reverse">
          {eventLogs.slice(-4).reverse().map((log, idx) => (
            <div key={idx} className="flex items-center gap-2 leading-relaxed">
              <span className="text-nasa-cyan font-bold shrink-0">{log.timestamp}</span>
              <span className="text-slate-300">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
