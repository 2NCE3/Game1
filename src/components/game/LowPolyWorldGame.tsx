import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerformanceMonitor, AdaptiveDpr } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  Flame, 
  Gauge, 
  Compass, 
  Zap, 
  Radio, 
  Sparkles, 
  RotateCcw, 
  ChevronRight, 
  ShieldCheck, 
  ShieldAlert,
  AlertTriangle,
  Play,
  Square,
  Crosshair,
  Target
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { DESTINATIONS } from '../../data/missionsData';
import { sounds } from '../../utils/soundEffects';
import { LowPolyPlanetScene } from '../3d/LowPolyPlanetScene';
import { CameraMode } from '../../camera/CameraDirector';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { gameState, FlightSimRefData, MissionPhase, FailureEvent } from '../../core/GameState';
import { eventBus } from '../../core/EventBus';

interface LowPolyWorldGameProps {
  onSuccess?: () => void;
  onEnterCockpit?: () => void;
  onEnterLander?: () => void;
  onEnterLaunchPad?: () => void;
  onReturnToHangar?: () => void;
}

export const LowPolyWorldGame: React.FC<LowPolyWorldGameProps> = ({
  onSuccess,
  onEnterCockpit,
  onEnterLander,
  onEnterLaunchPad,
  onReturnToHangar,
}) => {
  const { state, setStep } = useMission();
  const destination = DESTINATIONS.find(d => d.id === state.destinationId) || DESTINATIONS[0];

  // ─── REF-BASED SIMULATION STATE (60 FPS PHYSICS, ZERO REACT STUTTER) ───
  const flightSimRef = useRef<FlightSimRefData>({
    phase: 'BASE_VIEW',
    flightProgress: 0,
    flightSpeed: 0,
    altitude: 0,
    steeringAngle: 0,
    isWarping: false,
  });

  // ─── THROTTLED HUD DISPLAY STATE (UPDATED AT 10 HZ) ───────────────────
  const [hudData, setHudData] = useState({
    phase: 'BASE_VIEW' as MissionPhase,
    progress: 0,
    speed: 0,
    altitude: 0,
    deltaV: 4200,
    maxDeltaV: 4200,
    hull: 100,
    approachAccuracy: 50,
    isWarping: false,
  });

  const [cameraMode, setCameraMode] = useState<CameraMode>('BASE_INSPECT');
  const [scienceScore, setScienceScore] = useState(0);
  const [selectedBaseBuilding, setSelectedBaseBuilding] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [activeFailure, setActiveFailure] = useState<FailureEvent | null>(null);
  const [retroBurnActive, setRetroBurnActive] = useState(false);
  const [lowQuality, setLowQuality] = useState(false);

  // Virtual Joystick Touch Ref
  const joystickRef = useRef<{ active: boolean; startX: number; startY: number }>({
    active: false,
    startX: 0,
    startY: 0,
  });
  const [joystickKnob, setJoystickKnob] = useState({ x: 0, y: 0 });

  // ─── KEYBOARD & GAMEPAD CONTROLS ─────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const sim = flightSimRef.current;
      if (sim.phase === 'SPACE_TRANSIT' || sim.phase === 'BREAKOUT' || sim.phase === 'RETROGRADE_BURN') {
        if (e.key === 'a' || e.key === 'ArrowLeft') {
          sim.steeringAngle = Math.max(-1, sim.steeringAngle - 0.4);
          gameState.consumeDeltaV(4);
        } else if (e.key === 'd' || e.key === 'ArrowRight') {
          sim.steeringAngle = Math.min(1, sim.steeringAngle + 0.4);
          gameState.consumeDeltaV(4);
        } else if (e.key === ' ') {
          if (gameState.resources.deltaV > 10) {
            sim.isWarping = true;
            gameState.consumeDeltaV(8);
          }
        } else if (e.key === 's' || e.key === 'ArrowDown') {
          if (sim.phase === 'RETROGRADE_BURN') {
            setRetroBurnActive(true);
            gameState.consumeDeltaV(15);
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const sim = flightSimRef.current;
      if (e.key === 'a' || e.key === 'ArrowLeft' || e.key === 'd' || e.key === 'ArrowRight') {
        sim.steeringAngle = 0;
      } else if (e.key === ' ') {
        sim.isWarping = false;
      } else if (e.key === 's' || e.key === 'ArrowDown') {
        setRetroBurnActive(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // ─── VIRTUAL THUMBSTICK HANDLERS (MOBILE & TOUCH) ───────────────────
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    joystickRef.current = { active: true, startX: touch.clientX, startY: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!joystickRef.current.active) return;
    const touch = e.touches[0];
    const dx = touch.clientX - joystickRef.current.startX;
    const dy = touch.clientY - joystickRef.current.startY;
    const dist = Math.min(40, Math.hypot(dx, dy));
    const angle = Math.atan2(dy, dx);
    const knobX = Math.cos(angle) * dist;
    const knobY = Math.sin(angle) * dist;

    setJoystickKnob({ x: knobX, y: knobY });

    const sim = flightSimRef.current;
    sim.steeringAngle = THREE.MathUtils.clamp(knobX / 35, -1, 1);
    if (knobY < -20 && gameState.resources.deltaV > 5) {
      sim.isWarping = true;
      gameState.consumeDeltaV(6);
    } else {
      sim.isWarping = false;
    }
  };

  const handleTouchEnd = () => {
    joystickRef.current.active = false;
    setJoystickKnob({ x: 0, y: 0 });
    const sim = flightSimRef.current;
    sim.steeringAngle = 0;
    sim.isWarping = false;
  };

  // ─── FIXED 60 HZ PHYSICS TICK ACCUMULATOR & 10 HZ HUD UPDATE ─────────
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let accumulator = 0;
    const FIXED_STEP = 1 / 60;
    let hudTimer = 0;
    let failureTriggered = false;

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;
      accumulator += dt;
      hudTimer += dt;

      const sim = flightSimRef.current;

      while (accumulator >= FIXED_STEP) {
        accumulator -= FIXED_STEP;

        if (sim.phase !== 'BASE_VIEW' && sim.phase !== 'ARRIVAL_SUCCESS' && sim.phase !== 'CRITICAL_FAILURE') {
          // Dynamic step rate based on Warp Boost or Retro burn
          let stepRate = sim.isWarping ? 0.35 : 0.12;
          if (sim.phase === 'RETROGRADE_BURN' && retroBurnActive) {
            stepRate = 0.22;
          }
          sim.flightProgress = Math.min(100, sim.flightProgress + stepRate);
          const p = sim.flightProgress;

          // State Machine Progression
          if (p < 20) {
            if (sim.phase !== 'LIFTOFF') sim.phase = 'LIFTOFF';
            sim.altitude = Math.round((p / 20) * 80);
            sim.flightSpeed = Math.round((p / 20) * 2800);
          } else if (p < 45) {
            if (sim.phase !== 'BREAKOUT') {
              sim.phase = 'BREAKOUT';
              sounds.playStaging();
            }
            sim.altitude = Math.round(80 + ((p - 20) / 25) * 450);
            sim.flightSpeed = Math.round(2800 + ((p - 20) / 25) * 8200);
          } else if (p < 82) {
            if (sim.phase !== 'SPACE_TRANSIT') {
              sim.phase = 'SPACE_TRANSIT';
              sounds.playSelect();
            }
            sim.altitude = Math.round(1500 + ((p - 45) / 37) * 350000);
            sim.flightSpeed = Math.round(11000 + (sim.isWarping ? 6000 : 0));

            // Dynamic Failure Event Trigger around ~55% progress
            if (p > 55 && !failureTriggered) {
              failureTriggered = true;
              sounds.playAlert();
              setActiveFailure({
                id: 'engine-overheat',
                type: 'ENGINE_OVERHEAT',
                title: 'ENGINE 2 OVERHEATING // 104°C',
                description: 'Cryogenic turbopump temperature spiking during deep space burn. Choose tactical engineering countermeasure:',
                severity: 'WARNING',
                options: [
                  {
                    label: 'REDIRECT LIQUID COOLANT PIPES',
                    description: 'Consumes 15% electrical reserves; safely vents heat',
                    action: () => {
                      sounds.playSuccess();
                      gameState.resources.energy -= 15;
                      setActiveFailure(null);
                    },
                  },
                  {
                    label: 'REDUCE THROTTLE -25%',
                    description: 'Cools chamber safely with minor velocity penalty',
                    action: () => {
                      sounds.playClick();
                      sim.flightSpeed -= 1500;
                      setActiveFailure(null);
                    },
                  },
                ],
              });
            }
          } else if (p < 96) {
            // Active 'Retrograde Capture Burn' Mechanic Window
            if (sim.phase !== 'RETROGRADE_BURN') {
              sim.phase = 'RETROGRADE_BURN';
              setCameraMode('CHASE_CAM');
              sounds.playAlert();
            }
            sim.altitude = Math.max(200, Math.round(6000 - ((p - 82) / 14) * 5500));
            // Speed decelerates with Retro Burn
            if (retroBurnActive) {
              sim.flightSpeed = Math.max(2400, sim.flightSpeed - 80);
              gameState.consumeDeltaV(12);
            }
          } else {
            // Safe Capture Achieved!
            sim.phase = 'ARRIVAL_SUCCESS';
            sounds.playSuccess();
          }
        }
      }

      // Throttled 10 Hz HUD update (every 100ms)
      if (hudTimer >= 0.1) {
        hudTimer = 0;
        setHudData({
          phase: sim.phase,
          progress: sim.flightProgress,
          speed: sim.flightSpeed,
          altitude: sim.altitude,
          deltaV: gameState.resources.deltaV,
          maxDeltaV: gameState.resources.maxDeltaV,
          hull: gameState.resources.hull,
          approachAccuracy: Math.round(85 + Math.sin(sim.steeringAngle * 3) * 15),
          isWarping: sim.isWarping,
        });
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [retroBurnActive]);

  // Launch Trigger
  const startLaunchSequence = () => {
    sounds.playAlert();
    setSelectedBaseBuilding(null);
    setCameraMode('CINEMATIC');
    setCountdown(3);

    const timer = setInterval(() => {
      setCountdown(curr => {
        if (curr === null || curr <= 1) {
          clearInterval(timer);
          sounds.playLaunch();
          flightSimRef.current.phase = 'LIFTOFF';
          return null;
        }
        sounds.playClick();
        return curr - 1;
      });
    }, 1000);
  };

  const handleCollectScience = (pts: number) => {
    sounds.playSelect();
    setScienceScore(prev => prev + pts);
    gameState.addScience(pts);
  };

  const handleAsteroidHit = () => {
    sounds.playAlert();
  };

  // Bot Commentary
  const getNovaAdvice = () => {
    const ph = hudData.phase;
    if (ph === 'BASE_VIEW') {
      return `Colony Launch Complex verified. Review biodome modules, or engage ignition to initiate spaceflight.`;
    }
    if (ph === 'LIFTOFF') {
      return `LIFTOFF: Booster engines at 100% thrust. Ascending through planetary gravity well.`;
    }
    if (ph === 'BREAKOUT') {
      return `ATMOSPHERIC BREAKOUT: Planet curvature visible. Booster separation complete.`;
    }
    if (ph === 'SPACE_TRANSIT') {
      return `Interplanetary cruise: Steer [A/D] or Virtual Stick to clear debris and collect science data.`;
    }
    if (ph === 'RETROGRADE_BURN') {
      return `RETROGRADE BURN REQUIRED: Hold [S] or [RETRO BURN] to decelerate into New Eden orbit.`;
    }
    return `ORBITAL CAPTURE CONFIRMED: Arrival at New Eden. Vehicle aligned for atmospheric entry.`;
  };

  return (
    <div className="relative w-full h-full bg-space-950 flex flex-col overflow-hidden select-none">
      {/* ─── TOP AEROSPACE STATUS HUD ──────────────────────────────── */}
      <div className="h-12 bg-space-950/90 border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-mono text-xs font-bold text-white tracking-widest uppercase">
              {hudData.phase === 'RETROGRADE_BURN' ? 'CAPTURE BURN SEQUENCE' : `ODYSSEY // ${hudData.phase.replace('_', ' ')}`}
            </span>
          </div>
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <span className="text-xs font-mono text-nasa-cyan hidden sm:inline">
            TARGET: {destination.name}
          </span>
        </div>

        {/* Navigation & Necessary Controls */}
        <div className="flex items-center gap-2">
          {onEnterLaunchPad && (
            <button
              onClick={() => {
                sounds.playClick();
                onEnterLaunchPad();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-950/90 hover:bg-blue-900 border border-blue-500/60 text-blue-200 text-xs font-mono font-bold transition-colors shadow-sm"
            >
              <Rocket className="w-3.5 h-3.5 text-blue-400" />
              <span>LAUNCH PAD</span>
            </button>
          )}

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Compact Camera View Mode (Base / Orbit) */}
          {(['BASE_INSPECT', 'ORBIT_CAM'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => {
                sounds.playClick();
                setCameraMode(mode);
              }}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                cameraMode === mode
                  ? 'bg-nasa-cyan text-black shadow-md'
                  : 'bg-space-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {mode === 'BASE_INSPECT' ? 'BASE' : 'ORBIT'}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {onReturnToHangar && (
            <button
              onClick={() => {
                sounds.playClick();
                onReturnToHangar();
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 text-xs font-mono transition-colors"
            >
              <Square className="w-3 h-3" />
              <span>ABORT</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── NOVA-9 AI COMMENTARY BANNER ──────────────────────────── */}
      <div className="bg-space-900/90 border-b border-cyan-500/20 px-4 py-2 flex items-center justify-between text-xs z-20">
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
            [NOVA-09]
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-nasa-cyan uppercase tracking-wider hidden sm:inline">
              GUIDANCE:
            </span>
            <span className="text-xs text-white font-medium">
              {getNovaAdvice()}
            </span>
          </div>
        </div>

        {scienceScore > 0 && (
          <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-sm border border-amber-500/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>+{scienceScore} SCIENCE</span>
          </div>
        )}
      </div>

      {/* ─── MAIN 3D PLANET & SPACE VIEWPORT ──────────────────────── */}
      <div className="flex-1 relative overflow-hidden bg-space-950">
        <ErrorBoundary fallbackTitle="3D PLANET GRAPHICS ENGINE">
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [25, 25, 30], fov: 48 }}
            gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          >
            <PerformanceMonitor
              onDecline={() => setLowQuality(true)}
              onIncline={() => setLowQuality(false)}
            />
            <AdaptiveDpr pixelated />

            {cameraMode === 'BASE_INSPECT' || cameraMode === 'ORBIT_CAM' ? (
              <OrbitControls
                enablePan={false}
                maxDistance={120}
                minDistance={18}
                autoRotate={cameraMode === 'ORBIT_CAM'}
                autoRotateSpeed={0.8}
              />
            ) : null}

            <LowPolyPlanetScene
              flightDataRef={flightSimRef}
              destination={destination}
              cameraMode={cameraMode}
              lowQuality={lowQuality}
              onScienceCollect={handleCollectScience}
              onAsteroidHit={handleAsteroidHit}
            />
          </Canvas>
        </ErrorBoundary>

        {/* ─── COUNTDOWN SEQUENCE OVERLAY ──────────────────────────── */}
        <AnimatePresence>
          {countdown !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-30 pointer-events-none"
            >
              <div className="text-slate-300 font-mono text-sm tracking-[0.4em] uppercase mb-2">
                MAIN ENGINE IGNITION
              </div>
              <div className="font-display font-black text-9xl text-white telemetry-val drop-shadow-2xl animate-pulse">
                {countdown}
              </div>
              <div className="text-nasa-orange font-mono text-sm tracking-widest uppercase mt-4">
                GANTRY CLAMPS DISENGAGED
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── DYNAMIC FAILURE EVENT MODAL (TACTICAL CHOICES) ──────── */}
        <AnimatePresence>
          {activeFailure && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute inset-x-4 sm:inset-x-12 top-16 z-40 max-w-xl mx-auto p-5 sm:p-6 bg-space-950/95 border-2 border-red-500 rounded-3xl shadow-2xl backdrop-blur-2xl ring-4 ring-red-500/25"
            >
              <div className="flex items-center gap-3 pb-3 mb-3 border-b border-red-500/30 text-red-400 font-mono text-xs font-bold tracking-wider uppercase">
                <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                <span>{activeFailure.title}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {activeFailure.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeFailure.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={opt.action}
                    className="p-3 rounded-2xl bg-space-900 hover:bg-space-800 border border-red-500/40 hover:border-red-400 text-left transition-all group"
                  >
                    <div className="font-mono font-bold text-xs text-white group-hover:text-red-300 mb-1">
                      {opt.label}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {opt.description}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── PHASE: BASE VIEW (CLASH OF CLANS VILLAGE INSPECT) ───── */}
        {hudData.phase === 'BASE_VIEW' && (
          <div className="absolute bottom-6 inset-x-4 sm:inset-x-8 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-none z-20">
            {/* Base Building Hotspots */}
            <div className="flex flex-wrap gap-2 pointer-events-auto bg-space-950/85 backdrop-blur-md p-2 rounded-sm border border-slate-800">
              <button
                onClick={() => setSelectedBaseBuilding('dome')}
                className="px-3 py-1.5 rounded-sm bg-space-900 hover:bg-space-800 border border-slate-700 text-xs font-mono text-white flex items-center gap-1.5 transition-all"
              >
                <span className="text-nasa-cyan font-mono text-[10px]">[HQ]</span>
                <span>BIODOME</span>
              </button>
              <button
                onClick={() => setSelectedBaseBuilding('radar')}
                className="px-3 py-1.5 rounded-sm bg-space-900 hover:bg-space-800 border border-slate-700 text-xs font-mono text-white flex items-center gap-1.5 transition-all"
              >
                <span className="text-nasa-cyan font-mono text-[10px]">[COMMS]</span>
                <span>RADAR ARRAY</span>
              </button>
              <button
                onClick={() => setSelectedBaseBuilding('solar')}
                className="px-3 py-1.5 rounded-sm bg-space-900 hover:bg-space-800 border border-slate-700 text-xs font-mono text-white flex items-center gap-1.5 transition-all"
              >
                <span className="text-nasa-cyan font-mono text-[10px]">[PWR]</span>
                <span>SOLAR FARM</span>
              </button>
              <button
                onClick={() => setSelectedBaseBuilding('rover')}
                className="px-3 py-1.5 rounded-sm bg-space-900 hover:bg-space-800 border border-slate-700 text-xs font-mono text-white flex items-center gap-1.5 transition-all"
              >
                <span className="text-nasa-cyan font-mono text-[10px]">[SURV]</span>
                <span>ROVER PATROL</span>
              </button>
            </div>

            {/* Launch Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startLaunchSequence}
              className="pointer-events-auto px-7 py-3 rounded-sm bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs tracking-wider uppercase shadow-xl flex items-center gap-2 cursor-pointer border border-amber-300"
            >
              <Rocket className="w-4 h-4 fill-black" />
              <span>IGNITE & LAUNCH TO SPACE</span>
            </motion.button>
          </div>
        )}

        {/* ─── ACTIVE 'RETROGRADE CAPTURE BURN' HUD INDICATOR ──────── */}
        {hudData.phase === 'RETROGRADE_BURN' && (
          <div className="absolute inset-x-4 top-20 max-w-md mx-auto p-4 rounded-2xl bg-space-950/90 border-2 border-amber-500 shadow-2xl backdrop-blur-xl text-center z-30 pointer-events-auto">
            <div className="flex items-center justify-center gap-2 text-amber-400 font-mono text-xs font-bold mb-1">
              <Crosshair className="w-4 h-4 animate-spin" />
              <span>APPROACH VECTOR CORRIDOR: {hudData.approachAccuracy}%</span>
            </div>
            <p className="text-[11px] text-slate-300 mb-3">
              Align spacecraft with New Eden retrograde vector and fire reverse thrusters to enter capture orbit!
            </p>
            <button
              onMouseDown={() => setRetroBurnActive(true)}
              onMouseUp={() => setRetroBurnActive(false)}
              onTouchStart={() => setRetroBurnActive(true)}
              onTouchEnd={() => setRetroBurnActive(false)}
              className={`w-full py-3 rounded-xl font-mono text-xs font-bold uppercase transition-all shadow-xl flex items-center justify-center gap-2 ${
                retroBurnActive
                  ? 'bg-amber-400 text-black ring-4 ring-amber-400/50 shadow-amber-400/40'
                  : 'bg-amber-950/80 border border-amber-500 text-amber-200 hover:bg-amber-900'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>{retroBurnActive ? 'RETROGRADE BURN FIRING!' : 'HOLD [S] / TAP TO FIRE RETRO BURN'}</span>
            </button>
          </div>
        )}

        {/* ─── IN-FLIGHT DASHBOARD HUD: DELTA-V, HULL, SPEED, ALTITUDE */}
        {hudData.phase !== 'BASE_VIEW' && hudData.phase !== 'ARRIVAL_SUCCESS' && (
          <div className="absolute bottom-6 inset-x-4 sm:inset-x-8 flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-none z-20">
            {/* Technical Flight Metrics Gauges */}
            <div className="flex items-center gap-4 bg-space-950/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-800 pointer-events-auto shadow-2xl">
              {/* Delta-V Gauge */}
              <div>
                <span className="text-[9px] font-mono text-slate-400 uppercase block flex items-center gap-1">
                  <span>ΔV PROPELLANT</span>
                </span>
                <span className="text-sm font-mono font-bold text-nasa-cyan telemetry-val">
                  {hudData.deltaV} m/s
                </span>
                {/* Visual Propellant Bar */}
                <div className="w-20 h-1.5 bg-space-800 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full transition-all"
                    style={{ width: `${(hudData.deltaV / hudData.maxDeltaV) * 100}%` }}
                  />
                </div>
              </div>

              <div className="h-7 w-px bg-slate-800" />

              {/* Hull Integrity */}
              <div>
                <span className="text-[9px] font-mono text-slate-400 uppercase block">HULL HP</span>
                <span className={`text-sm font-mono font-bold telemetry-val ${
                  hudData.hull > 50 ? 'text-emerald-400' : 'text-red-400 animate-pulse'
                }`}>
                  {hudData.hull}%
                </span>
                <div className="w-16 h-1.5 bg-space-800 rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      hudData.hull > 50 ? 'bg-emerald-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${hudData.hull}%` }}
                  />
                </div>
              </div>

              <div className="h-7 w-px bg-slate-800" />

              {/* Velocity & Altitude */}
              <div>
                <span className="text-[9px] font-mono text-slate-400 uppercase block">VELOCITY</span>
                <span className="text-sm font-mono font-bold text-white telemetry-val">
                  {hudData.speed.toLocaleString()} km/h
                </span>
              </div>

              <div className="h-7 w-px bg-slate-800" />

              <div>
                <span className="text-[9px] font-mono text-slate-400 uppercase block">PROGRESS</span>
                <span className="text-sm font-mono font-bold text-emerald-400 telemetry-val">
                  {Math.round(hudData.progress)}%
                </span>
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden sm:flex items-center gap-2 pointer-events-auto">
              <button
                onMouseDown={() => { flightSimRef.current.steeringAngle = -0.6; gameState.consumeDeltaV(4); }}
                onMouseUp={() => { flightSimRef.current.steeringAngle = 0; }}
                className="w-11 h-11 rounded-xl bg-space-900 border border-slate-700 hover:bg-space-800 text-white font-bold flex items-center justify-center text-sm shadow-md active:bg-cyan-900"
                title="Steer Left [A]"
              >
                ◀ A
              </button>
              <button
                onMouseDown={() => { flightSimRef.current.steeringAngle = 0.6; gameState.consumeDeltaV(4); }}
                onMouseUp={() => { flightSimRef.current.steeringAngle = 0; }}
                className="w-11 h-11 rounded-xl bg-space-900 border border-slate-700 hover:bg-space-800 text-white font-bold flex items-center justify-center text-sm shadow-md active:bg-cyan-900"
                title="Steer Right [D]"
              >
                D ▶
              </button>
              <button
                onMouseDown={() => { flightSimRef.current.isWarping = true; gameState.consumeDeltaV(10); }}
                onMouseUp={() => { flightSimRef.current.isWarping = false; }}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg ${
                  hudData.isWarping
                    ? 'bg-cyan-400 text-black shadow-cyan-400/50'
                    : 'bg-cyan-950/80 border border-cyan-500/60 text-cyan-200 hover:bg-cyan-900'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>{hudData.isWarping ? 'WARP ENGAGED!' : 'HOLD [SPACE] BOOST'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ─── MOBILE VIRTUAL THUMBSTICK ZONE (BOTTOM-LEFT) ─────────── */}
        {hudData.phase !== 'BASE_VIEW' && hudData.phase !== 'ARRIVAL_SUCCESS' && (
          <div
            className="sm:hidden absolute bottom-20 left-4 z-30 pointer-events-auto touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-24 h-24 rounded-full bg-space-900/80 border-2 border-nasa-cyan/40 backdrop-blur-md flex items-center justify-center relative shadow-2xl">
              {/* Outer crosshair */}
              <div className="absolute inset-2 border border-slate-700/50 rounded-full pointer-events-none" />
              {/* Movable Thumb Knob */}
              <div
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-400 border border-cyan-200 shadow-md transform transition-transform"
                style={{
                  transform: `translate(${joystickKnob.x}px, ${joystickKnob.y}px)`,
                }}
              />
            </div>
            <div className="text-[9px] font-mono text-center text-slate-400 mt-1">
              STEER / BOOST
            </div>
          </div>
        )}

        {/* ─── ARRIVAL SUCCESS CELEBRATION ─────────────────────────── */}
        <AnimatePresence>
          {hudData.phase === 'ARRIVAL_SUCCESS' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex items-center justify-center bg-black/65 backdrop-blur-md z-40 p-4"
            >
              <div className="max-w-md w-full p-6 sm:p-7 rounded-md bg-space-950/95 border border-emerald-500 shadow-2xl text-center">
                <div className="w-12 h-12 rounded-sm bg-emerald-500/20 border border-emerald-400 flex items-center justify-center font-mono font-bold text-xs text-emerald-400 mx-auto mb-4">
                  [SUCCESS]
                </div>

                <h2 className="font-display font-black text-xl text-white uppercase tracking-wider mb-1">
                  ARRIVAL AT {destination.name}
                </h2>
                <p className="text-xs font-mono text-emerald-400 mb-2">
                  Interplanetary Odyssey Complete | Science Yield: +{scienceScore} PTS
                </p>
                <p className="text-[11px] font-mono text-slate-400 mb-6">
                  Remaining Delta-V: {hudData.deltaV} m/s | Hull Integrity: {hudData.hull}%
                </p>

                <div className="space-y-2.5">
                  {onEnterLander && (
                    <button
                      onClick={() => {
                        sounds.playSuccess();
                        onEnterLander();
                      }}
                      className="w-full py-3 rounded-sm bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                    >
                      <span>PILOT ATMOSPHERIC LANDER TOUCHDOWN</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}

                  {onEnterCockpit && (
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onEnterCockpit();
                      }}
                      className="w-full py-2.5 rounded-sm bg-space-900 hover:bg-space-800 border border-cyan-500/50 text-cyan-200 font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>ENTER 3D FIRST-PERSON COCKPIT</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      sounds.playSuccess();
                      if (onSuccess) onSuccess();
                      else setStep('results');
                    }}
                    className="w-full py-2 rounded-sm bg-space-900/60 hover:bg-space-900 border border-slate-700 text-slate-300 font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>FINALIZE MISSION & VIEW SCIENCE RESULTS</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
