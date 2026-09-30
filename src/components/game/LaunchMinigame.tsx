import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  Flame, 
  Gauge, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  RotateCcw, 
  Compass, 
  ArrowRight, 
  Sparkles,
  Zap,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { DESTINATIONS } from '../../data/missionsData';
import { sounds } from '../../utils/soundEffects';
import { LaunchControls, LaunchTelemetry } from '../../game/types';
import { 
  createShipSpecsFromMission, 
  getInitialLaunchTelemetry, 
  updateLaunchPhysics 
} from '../../game/launchPhysics';
import { gameStateMachine } from '../../game/stateMachine';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'smoke' | 'fire' | 'shock' | 'debris';
  alpha?: number;
}

interface StagedBoosterVisual {
  x: number;
  y: number;
  angle: number;
  rotSpeed: number;
  vx: number;
  vy: number;
  alpha: number;
}

interface FairingHalfVisual {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  rotSpeed: number;
  alpha: number;
}

interface LaunchMinigameProps {
  onSuccess?: () => void;
  onReturnToHangar?: () => void;
}

export const LaunchMinigame: React.FC<LaunchMinigameProps> = ({
  onSuccess,
  onReturnToHangar,
}) => {
  const { state, resources, setStep, cadetMode } = useMission();
  const destination = DESTINATIONS.find(d => d.id === state.destinationId) || DESTINATIONS[0];
  const specs = createShipSpecsFromMission(state, resources);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Flight simulation state
  const [telemetry, setTelemetry] = useState<LaunchTelemetry>(() => getInitialLaunchTelemetry(specs));
  const telemetryRef = useRef<LaunchTelemetry>(telemetry);
  telemetryRef.current = telemetry;

  // Real-time Controls
  const [controls, setControls] = useState<LaunchControls>({
    throttle: 0,
    tiltLeft: false,
    tiltRight: false,
    triggerStaging: false,
  });
  const controlsRef = useRef<LaunchControls>(controls);
  controlsRef.current = controls;

  // Visual effects refs
  const particlesRef = useRef<Particle[]>([]);
  const boosterVisualRef = useRef<StagedBoosterVisual | null>(null);
  const fairingVisualRef = useRef<FairingHalfVisual[]>([]);
  const shockwavePulseRef = useRef(0);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Input listeners (Keyboard)
  const isSpaceHeldRef = useRef(false);
  const isKeyLeftHeldRef = useRef(false);
  const isKeyRightHeldRef = useRef(false);

  // Sound throttler
  const lastBeepTimeRef = useRef(0);

  // Reset launch
  const handleReset = useCallback(() => {
    sounds.playSelect();
    const init = getInitialLaunchTelemetry(specs);
    setTelemetry(init);
    telemetryRef.current = init;
    particlesRef.current = [];
    boosterVisualRef.current = null;
    fairingVisualRef.current = [];
    setControls({
      throttle: 0,
      tiltLeft: false,
      tiltRight: false,
      triggerStaging: false,
    });
  }, [specs]);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        isSpaceHeldRef.current = true;
        setControls(prev => ({ ...prev, throttle: 1.0 }));
      }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        isKeyLeftHeldRef.current = true;
        setControls(prev => ({ ...prev, tiltLeft: true }));
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        isKeyRightHeldRef.current = true;
        setControls(prev => ({ ...prev, tiltRight: true }));
      }
      if (e.code === 'KeyS' || e.code === 'Enter') {
        e.preventDefault();
        setControls(prev => ({ ...prev, triggerStaging: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        isSpaceHeldRef.current = false;
        setControls(prev => ({ ...prev, throttle: 0 }));
      }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        isKeyLeftHeldRef.current = false;
        setControls(prev => ({ ...prev, tiltLeft: false }));
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        isKeyRightHeldRef.current = false;
        setControls(prev => ({ ...prev, tiltRight: false }));
      }
      if (e.code === 'KeyS' || e.code === 'Enter') {
        setControls(prev => ({ ...prev, triggerStaging: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Physics & Animation Loop
  useEffect(() => {
    let prevStaged = false;
    let prevFairing = false;

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;

      // 1. Step Physics
      const prevTelem = telemetryRef.current;
      const currentControls = controlsRef.current;
      const nextTelem = updateLaunchPhysics(prevTelem, currentControls, dt, specs);
      
      // Sound reactions
      if (nextTelem.inMaxQZone && nextTelem.dynamicPressureKpa > 32 && now - lastBeepTimeRef.current > 600) {
        sounds.playWarningBeep();
        lastBeepTimeRef.current = now;
      }
      if (nextTelem.staged && !prevStaged) {
        sounds.playStaging();
        prevStaged = true;
        // Spawn booster detachment visual
        boosterVisualRef.current = {
          x: 0,
          y: 0,
          angle: nextTelem.pitchDeg,
          rotSpeed: (Math.random() - 0.5) * 1.5,
          vx: -Math.sin((nextTelem.pitchDeg * Math.PI) / 180) * 15,
          vy: -35,
          alpha: 1.0,
        };
      }
      if (nextTelem.fairingJettisoned && !prevFairing) {
        sounds.playStaging();
        prevFairing = true;
        // Spawn two fairing halves
        fairingVisualRef.current = [
          { x: -10, y: -20, vx: -25, vy: -5, angle: nextTelem.pitchDeg, rotSpeed: -2, alpha: 1 },
          { x: 10, y: -20, vx: 25, vy: -5, angle: nextTelem.pitchDeg, rotSpeed: 2, alpha: 1 },
        ];
      }
      if (nextTelem.failed && !prevTelem.failed) {
        sounds.playFailureBoom();
      }
      if (nextTelem.orbitAchieved && !prevTelem.orbitAchieved) {
        sounds.playSuccess();
        gameStateMachine.recordLaunchResult({
          success: true,
          score: nextTelem.totalLaunchScore,
          orbitalVelocityAchieved: nextTelem.velocityMs,
          fuelRemaining: nextTelem.fuelRemainingPercent,
          maxQRating: nextTelem.maxQHandlingScore > 85 ? 'EXCELLENT' : (nextTelem.maxQHandlingScore > 65 ? 'GOOD' : 'ROUGH'),
          arcRating: nextTelem.arcAccuracyScore > 85 ? 'PINPOINT ARC' : 'NOMINAL',
          novaFeedback: 'Launch trajectory was exceptionally steady. Orbital injection parameters locked.',
        });
      }

      setTelemetry(nextTelem);
      telemetryRef.current = nextTelem;

      // 2. Render Canvas Frame
      renderCanvas(nextTelem, dt);

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [specs]);

  // Canvas 2D Renderer with high aesthetic quality
  const renderCanvas = (telem: LaunchTelemetry, dt: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI
    const width = canvas.width;
    const height = canvas.height;

    // Camera shake calculation
    let shakeX = 0;
    let shakeY = 0;
    if (telem.shakeIntensity > 0.05) {
      const mag = telem.shakeIntensity * (telem.inMaxQZone ? 12 : 5);
      shakeX = (Math.random() - 0.5) * mag;
      shakeY = (Math.random() - 0.5) * mag;
    }

    ctx.save();
    ctx.translate(shakeX, shakeY);

    // ─── 1. DYNAMIC SKY / SPACE BACKGROUND ───────────────────────
    // Altitude normalized 0 (ground) to 1 (100km space)
    const altRatio = Math.min(1, Math.max(0, telem.altitudeKm / 100));
    const isMarsExodus = destination.id === 'new-eden';

    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    if (altRatio < 0.15) {
      if (isMarsExodus) {
        // Martian Red-Orange Atmosphere
        bgGrad.addColorStop(0, '#991b1b');
        bgGrad.addColorStop(0.6, '#ea580c');
        bgGrad.addColorStop(1, '#fdba74');
      } else {
        // Troposphere: Daylight sky
        bgGrad.addColorStop(0, '#0284c7');
        bgGrad.addColorStop(0.7, '#38bdf8');
        bgGrad.addColorStop(1, '#7dd3fc');
      }
    } else if (altRatio < 0.45) {
      if (isMarsExodus) {
        bgGrad.addColorStop(0, '#030712');
        bgGrad.addColorStop(0.5, '#7f1d1d');
        bgGrad.addColorStop(1, '#c2410c');
      } else {
        // Stratosphere: Deep blue to dark indigo
        bgGrad.addColorStop(0, '#030712');
        bgGrad.addColorStop(0.5, '#0c4a6e');
        bgGrad.addColorStop(1, '#0284c7');
      }
    } else if (altRatio < 0.85) {
      // Mesosphere / Thermosphere: Starry space with atmospheric limb
      bgGrad.addColorStop(0, '#020617');
      bgGrad.addColorStop(0.7, isMarsExodus ? '#450a0a' : '#082f49');
      bgGrad.addColorStop(1, isMarsExodus ? '#7f1d1d' : '#0369a1');
    } else {
      // Orbit: Pitch black space
      bgGrad.addColorStop(0, '#010409');
      bgGrad.addColorStop(0.65, '#020617');
      bgGrad.addColorStop(1, '#0f172a');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Starfield when altitude > 35km
    if (altRatio > 0.35) {
      ctx.fillStyle = '#ffffff';
      const starAlpha = Math.min(1, (altRatio - 0.35) / 0.4);
      ctx.globalAlpha = starAlpha;
      for (let i = 0; i < 60; i++) {
        const sx = ((i * 137.5) % width);
        const sy = ((i * 293.7) % (height * 0.7));
        ctx.fillRect(sx, sy, (i % 3 === 0 ? 2 : 1), (i % 3 === 0 ? 2 : 1));
      }
      ctx.globalAlpha = 1.0;
    }

    // Planetary curvature limb when in upper atmosphere/orbit
    if (altRatio > 0.5) {
      ctx.save();
      const earthCenterY = height * 1.6;
      const earthRadius = height * 1.1;
      const earthGrad = ctx.createRadialGradient(width / 2, earthCenterY, earthRadius * 0.8, width / 2, earthCenterY, earthRadius);
      earthGrad.addColorStop(0, isMarsExodus ? '#991b1b' : '#0369a1');
      earthGrad.addColorStop(0.9, isMarsExodus ? '#ea580c' : '#38bdf8');
      earthGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = earthGrad;
      ctx.beginPath();
      ctx.arc(width / 2, earthCenterY, earthRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // ─── 2. GROUND & SURROUNDINGS (Low Altitude) ────────────────────────
    if (altRatio < 0.25) {
      const groundY = height * 0.82 + (telem.altitudeKm * 30);
      if (groundY < height) {
        // Horizon pad & terrain
        ctx.fillStyle = isMarsExodus ? '#7c2d12' : '#1e293b';
        ctx.fillRect(0, groundY, width, height - groundY);
        // Martian canyon plateau or Ocean line
        ctx.fillStyle = isMarsExodus ? '#991b1b' : '#0369a1';
        ctx.fillRect(0, groundY - 8, width, 8);

        // Launch Pad Gantry Tower in background
        const towerX = width * 0.45 + 55;
        ctx.fillStyle = '#334155';
        ctx.fillRect(towerX, groundY - 95, 18, 95);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(towerX + 2, groundY - 85, 14, 4);
        ctx.fillRect(towerX + 2, groundY - 55, 14, 4);
        ctx.fillRect(towerX + 2, groundY - 25, 14, 4);
        // Warning strobe on top of tower
        ctx.fillStyle = (Math.floor(Date.now() / 350) % 2 === 0) ? '#ef4444' : '#7f1d1d';
        ctx.beginPath();
        ctx.arc(towerX + 9, groundY - 98, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ─── 3. CENTER ROCKET COORDINATE SYSTEM ──────────────────────
    const rocketScreenX = width * 0.45;
    const rocketScreenY = height * 0.52;

    ctx.save();
    ctx.translate(rocketScreenX, rocketScreenY);
    // Rocket orientation: pitchDeg 0 = straight up (facing -Y in canvas)
    const rad = (telem.pitchDeg * Math.PI) / 180;
    ctx.rotate(rad);

    // ─── 4. EXHAUST PARTICLES & FLAME ────────────────────────────
    if (telem.throttle > 0.05 && (telem.stage === 1 ? telem.boosterFuelPercent > 0 : telem.upperStageFuelPercent > 0)) {
      // Spawn new particles
      const isStage1 = telem.stage === 1;
      const particleCount = isStage1 ? 4 : 2;
      for (let p = 0; p < particleCount; p++) {
        particlesRef.current.push({
          x: (Math.random() - 0.5) * (isStage1 ? 10 : 6),
          y: 45 + Math.random() * 5,
          vx: (Math.random() - 0.5) * 4,
          vy: 8 + Math.random() * 12 * telem.throttle,
          life: 0,
          maxLife: 20 + Math.random() * 25,
          size: 4 + Math.random() * 8,
          color: isStage1 ? (Math.random() > 0.4 ? '#f97316' : '#facc15') : '#38bdf8',
          type: isStage1 ? 'fire' : 'shock',
        });
      }

      // Flame Plume drawing
      const flameLen = (isStage1 ? 75 : 45) * telem.throttle * (0.9 + Math.random() * 0.2);
      const flameWidth = isStage1 ? 16 : 10;

      const flameGrad = ctx.createLinearGradient(0, 40, 0, 40 + flameLen);
      if (isStage1) {
        flameGrad.addColorStop(0, '#ffffff');
        flameGrad.addColorStop(0.25, '#fef08a');
        flameGrad.addColorStop(0.65, '#f97316');
        flameGrad.addColorStop(1, 'transparent');
      } else {
        flameGrad.addColorStop(0, '#ffffff');
        flameGrad.addColorStop(0.3, '#38bdf8');
        flameGrad.addColorStop(0.8, '#818cf8');
        flameGrad.addColorStop(1, 'transparent');
      }

      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.moveTo(-flameWidth / 2, 40);
      ctx.lineTo(0, 40 + flameLen);
      ctx.lineTo(flameWidth / 2, 40);
      ctx.closePath();
      ctx.fill();

      // Mach diamonds for Stage 1 in dense air
      if (isStage1 && telem.altitudeKm < 30) {
        ctx.fillStyle = '#ffffff';
        for (let d = 1; d <= 3; d++) {
          const dy = 40 + d * 16;
          ctx.beginPath();
          ctx.ellipse(0, dy, 3, 2, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Update and draw existing exhaust particles (world coordinates)
    ctx.restore(); // Exit rocket rotation for particle motion

    ctx.save();
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      p.life++;
      p.size += 0.35;
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);

      // Rotate particle offset back to rocket angle
      const px = rocketScreenX + Math.cos(rad - Math.PI / 2) * p.x - Math.sin(rad - Math.PI / 2) * p.y;
      const py = rocketScreenY + Math.sin(rad - Math.PI / 2) * p.x + Math.cos(rad - Math.PI / 2) * p.y;

      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha * 0.6;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();

      if (p.life >= p.maxLife) {
        particlesRef.current.splice(i, 1);
      }
    }
    ctx.globalAlpha = 1.0;
    ctx.restore();

    // ─── 5. STAGED BOOSTER VISUAL (Tumbling away) ───────────────
    if (boosterVisualRef.current) {
      const bv = boosterVisualRef.current;
      bv.x += bv.vx * dt;
      bv.y += bv.vy * dt;
      bv.angle += bv.rotSpeed;
      bv.alpha = Math.max(0, bv.alpha - 0.15 * dt);

      ctx.save();
      ctx.translate(rocketScreenX + bv.x, rocketScreenY - bv.y);
      ctx.rotate((bv.angle * Math.PI) / 180);
      ctx.globalAlpha = bv.alpha;

      // Booster body
      ctx.fillStyle = '#64748b';
      ctx.fillRect(-10, 0, 20, 50);
      // Cooling engine nozzle glow
      ctx.fillStyle = '#f97316';
      ctx.fillRect(-6, 50, 12, 4);

      ctx.restore();
      if (bv.alpha <= 0) boosterVisualRef.current = null;
    }

    // ─── 6. FAIRING HALVES (Jettisoned) ─────────────────────────
    if (fairingVisualRef.current.length > 0) {
      for (let f = 0; f < fairingVisualRef.current.length; f++) {
        const fv = fairingVisualRef.current[f];
        fv.x += fv.vx * dt;
        fv.y += fv.vy * dt;
        fv.angle += fv.rotSpeed;
        fv.alpha = Math.max(0, fv.alpha - 0.2 * dt);

        ctx.save();
        ctx.translate(rocketScreenX + fv.x, rocketScreenY - fv.y);
        ctx.rotate((fv.angle * Math.PI) / 180);
        ctx.globalAlpha = fv.alpha;

        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.ellipse(0, 0, 6, 25, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    // ─── 7. DRAW ROCKET BODY (Active) ───────────────────────────
    ctx.save();
    ctx.translate(rocketScreenX, rocketScreenY);
    ctx.rotate(rad);

    // Max-Q Condensation Shock Cone (Prandtl-Glauert effect)
    if (telem.inMaxQZone && telem.dynamicPressureKpa > 24) {
      shockwavePulseRef.current += dt * 15;
      const shockAlpha = Math.min(0.7, (telem.dynamicPressureKpa - 24) / 18);
      ctx.fillStyle = `rgba(255, 255, 255, ${shockAlpha * (0.8 + Math.sin(shockwavePulseRef.current) * 0.2)})`;
      ctx.beginPath();
      ctx.moveTo(0, -48);
      ctx.lineTo(-24, 0);
      ctx.lineTo(24, 0);
      ctx.closePath();
      ctx.fill();
    }

    // Thermal aerodynamic glow when heating
    if (telem.thermalHeat > 40) {
      const heatAlpha = (telem.thermalHeat - 40) / 60;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 15 * heatAlpha;
    }

    // Spacecraft Payload / Upper Stage
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(0, -50); // Nose cone
    ctx.lineTo(11, -30);
    ctx.lineTo(11, 10);
    ctx.lineTo(-11, 10);
    ctx.lineTo(-11, -30);
    ctx.closePath();
    ctx.fill();

    // NASA Meatball/Worm Red Stripe
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-11, -22, 22, 4);

    // Fairing or exposed satellite inside
    if (telem.fairingJettisoned) {
      // Golden satellite bus inside
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-7, -35, 14, 18);
      // Small blue solar panel wings
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-16, -30, 8, 8);
      ctx.fillRect(8, -30, 8, 8);
    } else {
      // Clean white fairing nose
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(0, -50);
      ctx.lineTo(10, -32);
      ctx.lineTo(-10, -32);
      ctx.closePath();
      ctx.fill();
    }

    // Stage 1 Booster (if not yet staged)
    if (telem.stage === 1) {
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(-12, 10, 24, 30);

      // Rocket fins
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(-12, 25);
      ctx.lineTo(-20, 40);
      ctx.lineTo(-12, 40);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(12, 25);
      ctx.lineTo(20, 40);
      ctx.lineTo(12, 40);
      ctx.closePath();
      ctx.fill();

      // Engine Nozzle
      ctx.fillStyle = '#334155';
      ctx.fillRect(-8, 40, 16, 5);
    } else {
      // Upper stage vacuum engine bell
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(-5, 10);
      ctx.lineTo(-10, 22);
      ctx.lineTo(10, 22);
      ctx.lineTo(5, 10);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
    ctx.restore(); // Undo camera shake
  };

  return (
    <div className="relative w-full h-full bg-space-950 flex flex-col justify-between overflow-hidden select-none">
      {/* ─── 1. TOP TELEMETRY HUD HEADER ──────────────────────────── */}
      <div className="h-14 bg-space-950/90 border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${telemetry.failed ? 'bg-red-500' : 'bg-emerald-400 animate-pulse'}`} />
            <span className="font-mono text-xs font-bold text-white tracking-widest uppercase">
              FLIGHT DECK // {specs.launcherName}
            </span>
          </div>
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <span className="text-[10px] font-mono text-nasa-cyan font-bold tracking-wider hidden sm:inline">
            DESTINATION: {destination.name.toUpperCase()}
          </span>
        </div>

        {/* Flight Kinematics Live Readouts */}
        <div className="flex items-center gap-4 sm:gap-6 font-mono text-xs">
          <div className="text-right">
            <span className="text-[9px] text-slate-400 block tracking-widest">ALTITUDE</span>
            <span className="text-white font-bold text-sm sm:text-base">
              {telemetry.altitudeKm.toFixed(1)} <span className="text-[10px] text-slate-400">KM</span>
            </span>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-slate-400 block tracking-widest">VELOCITY</span>
            <span className="text-nasa-cyan font-bold text-sm sm:text-base">
              {telemetry.velocityMs} <span className="text-[10px] text-slate-400">M/S</span>
            </span>
          </div>
          <div className="text-right hidden md:block">
            <span className="text-[9px] text-slate-400 block tracking-widest">SPEED</span>
            <span className="text-amber-400 font-bold text-sm">
              MACH {telemetry.mach}
            </span>
          </div>
          <div className="text-right hidden lg:block">
            <span className="text-[9px] text-slate-400 block tracking-widest">FLIGHT TIME</span>
            <span className="text-slate-300 font-bold text-xs">
              T+{Math.floor(telemetry.flightTimeSec)}S
            </span>
          </div>
        </div>
      </div>

      {/* ─── 2. MAIN COCKPIT VIEWPORT (CANVAS + OVERLAYS) ─────────── */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <canvas
          ref={canvasRef}
          width={window.innerWidth}
          height={window.innerHeight - 140}
          className="w-full h-full block"
        />

        {/* ─── LEFT: NavBall & Gravity Turn Arc Corridor ──────────── */}
        <div className="absolute top-4 left-4 z-20 w-64 bg-space-950/85 border border-slate-800/80 rounded-2xl p-3.5 backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-nasa-cyan" />
              <span>GRAVITY TURN ARC</span>
            </span>
            <span className={telemetry.inArcCorridor ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {telemetry.inArcCorridor ? 'IN CORRIDOR' : 'DEVIATED'}
            </span>
          </div>

          {/* Visual Arc Gauge */}
          <div className="relative h-20 w-full bg-space-900/90 rounded-xl border border-slate-800 overflow-hidden flex items-end justify-center pb-2">
            {/* Target Arc Curve Indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-500/40"
                style={{ transform: `rotate(${telemetry.targetPitchDeg}deg)` }}
              />
            </div>

            {/* Current Rocket Pitch Needle */}
            <div 
              className="absolute w-1 h-12 bg-nasa-orange rounded-full origin-bottom transition-transform duration-75"
              style={{ 
                bottom: '12px',
                transform: `rotate(${telemetry.pitchDeg}deg)` 
              }}
            />

            <div className="relative z-10 flex items-center justify-between w-full px-3 text-[10px] font-mono">
              <span className="text-slate-400">PITCH: <strong className="text-white">{telemetry.pitchDeg}°</strong></span>
              <span className="text-emerald-400">TARGET: <strong>{telemetry.targetPitchDeg}°</strong></span>
            </div>
          </div>

          {/* Steering Hint */}
          <div className="mt-2 text-center text-[10px] font-mono">
            {telemetry.pitchErrorDeg > 8 ? (
              telemetry.pitchDeg < telemetry.targetPitchDeg ? (
                <span className="text-amber-400 animate-pulse font-bold">
                  👉 TILT RIGHT [D] TO MATCH ARC
                </span>
              ) : (
                <span className="text-amber-400 animate-pulse font-bold">
                  👈 TILT LEFT [A] TO REDUCE PITCH
                </span>
              )
            ) : (
              <span className="text-emerald-400 font-medium">
                ✓ Arc attitude locked on target
              </span>
            )}
          </div>
        </div>

        {/* ─── RIGHT: Max-Q Dynamic Pressure & Thermal Gauge ─────── */}
        <div className="absolute top-4 right-4 z-20 w-64 bg-space-950/85 border border-slate-800/80 rounded-2xl p-3.5 backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-nasa-orange" />
              <span>AERO PRESSURE (MAX-Q)</span>
            </span>
            <span className={`font-bold ${telemetry.dynamicPressureKpa > 32 ? 'text-red-400 animate-pulse' : 'text-slate-300'}`}>
              {telemetry.dynamicPressureKpa.toFixed(1)} kPa
            </span>
          </div>

          {/* Pressure Bar with Safe Zone Marker */}
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative mb-2">
            <div 
              className={`h-full transition-all duration-100 ${
                telemetry.dynamicPressureKpa > 34 
                  ? 'bg-red-500 animate-pulse' 
                  : (telemetry.dynamicPressureKpa > 25 ? 'bg-amber-400' : 'bg-emerald-400')
              }`}
              style={{ width: `${Math.min(100, (telemetry.dynamicPressureKpa / 42) * 100)}%` }}
            />
            {/* Max-Q safe line */}
            <div className="absolute left-[70%] top-0 bottom-0 w-0.5 bg-red-400" title="Max-Q Safe Limit" />
          </div>

          {/* Max-Q Throttle Down Advisory */}
          {telemetry.inMaxQZone && (
            <div className={`p-2 rounded-lg text-[10px] font-mono mb-2 flex items-center gap-2 ${
              telemetry.throttle > 0.65 
                ? 'bg-red-950/80 border border-red-500 text-red-200 animate-pulse' 
                : 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
            }`}>
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                {telemetry.throttle > 0.65 
                  ? 'MAX-Q! THROTTLE DOWN TO 50%!' 
                  : 'THROTTLE DOWN OK: Passing Max-Q'}
              </span>
            </div>
          )}

          {/* Structural Integrity & Fuel Mini-Gauges */}
          <div className="space-y-1.5 pt-1 text-[10px] font-mono">
            <div className="flex justify-between text-slate-400">
              <span>AIRFRAME HEALTH:</span>
              <span className={`font-bold ${telemetry.structuralIntegrity < 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                {telemetry.structuralIntegrity}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${telemetry.structuralIntegrity < 50 ? 'bg-red-500' : 'bg-emerald-400'}`}
                style={{ width: `${telemetry.structuralIntegrity}%` }}
              />
            </div>

            <div className="flex justify-between text-slate-400 pt-1">
              <span>{telemetry.stage === 1 ? 'STAGE 1 BOOSTER FUEL:' : 'STAGE 2 UPPER FUEL:'}</span>
              <span className="text-nasa-cyan font-bold">
                {telemetry.stage === 1 ? telemetry.boosterFuelPercent.toFixed(0) : telemetry.upperStageFuelPercent.toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-nasa-cyan transition-all"
                style={{ width: `${telemetry.stage === 1 ? telemetry.boosterFuelPercent : telemetry.upperStageFuelPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* ─── COMMANDER NOVA LIVE RADIO CALLOUT (Top Center) ────── */}
        <div className="absolute top-4 inset-x-0 max-w-lg mx-auto z-20 px-4 pointer-events-none">
          <div className="bg-space-950/90 border border-nasa-orange/40 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-nasa-orange/20 border border-nasa-orange/50 flex items-center justify-center text-lg shrink-0">
              🧑‍🚀
            </div>
            <div>
              <div className="text-[9px] font-mono font-bold text-nasa-orange tracking-wider uppercase">
                COMMANDER NOVA // CAPCOM:
              </div>
              <p className="text-xs text-white font-sans leading-tight">
                {telemetry.commanderCallout}
              </p>
            </div>
          </div>
        </div>

        {/* ─── STAGING FLASHER / ACTION BUTTON (Center Screen) ───── */}
        {telemetry.stagingReady && !telemetry.staged && (
          <div className="absolute top-1/3 inset-x-0 flex justify-center z-30 pointer-events-auto">
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: [1, 1.06, 1], opacity: 1 }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              onClick={() => {
                setControls(prev => ({ ...prev, triggerStaging: true }));
              }}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-mono font-black text-base tracking-widest uppercase shadow-2xl shadow-orange-500/40 border-2 border-white cursor-pointer ring-4 ring-orange-500/30 flex items-center gap-3"
            >
              <Zap className="w-6 h-6 fill-white" />
              <span>STAGE 1 BURNOUT — SEPARATE & IGNITE UPPER STAGE! [S]</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* ─── 3. BOTTOM FLIGHT CONTROLS BAR ────────────────────────── */}
      <div className="h-20 bg-space-950/95 border-t border-slate-800/90 px-4 sm:px-8 flex items-center justify-between gap-4 z-20 backdrop-blur-md">
        {/* Left: Steering Tilt Buttons */}
        <div className="flex items-center gap-2">
          <button
            onMouseDown={() => setControls(prev => ({ ...prev, tiltLeft: true }))}
            onMouseUp={() => setControls(prev => ({ ...prev, tiltLeft: false }))}
            onTouchStart={() => setControls(prev => ({ ...prev, tiltLeft: true }))}
            onTouchEnd={() => setControls(prev => ({ ...prev, tiltLeft: false }))}
            className={`px-4 py-3 rounded-xl border font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
              controls.tiltLeft 
                ? 'bg-nasa-cyan text-black border-nasa-cyan' 
                : 'bg-space-900 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>◀ TILT LEFT</span>
            <kbd className="text-[9px] bg-slate-800 text-slate-400 px-1 rounded">[A]</kbd>
          </button>

          <button
            onMouseDown={() => setControls(prev => ({ ...prev, tiltRight: true }))}
            onMouseUp={() => setControls(prev => ({ ...prev, tiltRight: false }))}
            onTouchStart={() => setControls(prev => ({ ...prev, tiltRight: true }))}
            onTouchEnd={() => setControls(prev => ({ ...prev, tiltRight: false }))}
            className={`px-4 py-3 rounded-xl border font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
              controls.tiltRight 
                ? 'bg-nasa-cyan text-black border-nasa-cyan' 
                : 'bg-space-900 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>TILT RIGHT ▶</span>
            <kbd className="text-[9px] bg-slate-800 text-slate-400 px-1 rounded">[D]</kbd>
          </button>
        </div>

        {/* Center: BIG TACTILE THROTTLE BUTTON */}
        <div className="flex-1 max-w-sm flex flex-col items-center">
          <button
            onMouseDown={() => {
              isSpaceHeldRef.current = true;
              setControls(prev => ({ ...prev, throttle: 1.0 }));
            }}
            onMouseUp={() => {
              isSpaceHeldRef.current = false;
              setControls(prev => ({ ...prev, throttle: 0 }));
            }}
            onTouchStart={() => {
              isSpaceHeldRef.current = true;
              setControls(prev => ({ ...prev, throttle: 1.0 }));
            }}
            onTouchEnd={() => {
              isSpaceHeldRef.current = false;
              setControls(prev => ({ ...prev, throttle: 0 }));
            }}
            className={`w-full py-3.5 rounded-xl font-mono font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-xl ${
              controls.throttle > 0
                ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-black shadow-orange-500/40 ring-2 ring-yellow-300 scale-[0.98]'
                : 'bg-slate-800 hover:bg-slate-750 text-white border border-slate-700'
            }`}
          >
            <Flame className={`w-5 h-5 ${controls.throttle > 0 ? 'fill-black animate-bounce' : 'text-slate-400'}`} />
            <span>{controls.throttle > 0 ? 'FULL THROTTLE ACTIVE 🔥' : 'HOLD [SPACE] TO THROTTLE'}</span>
          </button>
          <div className="text-[10px] font-mono text-slate-400 mt-1">
            Release to idle // Hold to accelerate
          </div>
        </div>

        {/* Right: Manual Staging Button & Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setControls(prev => ({ ...prev, triggerStaging: true }))}
            className={`px-4 py-3 rounded-xl border font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
              telemetry.stagingReady
                ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/30 animate-pulse'
                : 'bg-space-900 border-slate-800 text-slate-500'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>STAGE</span>
            <kbd className="text-[9px] bg-slate-800 text-slate-400 px-1 rounded">[S]</kbd>
          </button>

          <button
            onClick={handleReset}
            className="p-3 rounded-xl bg-space-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset Launch to Pad"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── 4. FAILURE MODAL (EDUCATIONAL PHYSICS FEEDBACK) ──────── */}
      <AnimatePresence>
        {telemetry.failed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <div className="max-w-lg w-full bg-space-900 border-2 border-red-500 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-red-400 font-mono text-xs font-bold uppercase tracking-widest border-b border-red-500/30 pb-3">
                <ShieldAlert className="w-6 h-6 text-red-500" />
                <span>LAUNCH ABORT // CRITICAL ANOMALY DETECTED</span>
              </div>

              <div>
                <h3 className="font-display font-black text-2xl text-white">
                  {telemetry.failureReason || 'Mission Failure'}
                </h3>
                <p className="text-sm text-slate-300 mt-2 font-sans leading-relaxed">
                  {telemetry.failureScientificExplanation}
                </p>
              </div>

              <div className="p-3 bg-space-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Terminal Altitude:</span>
                  <span className="text-white font-bold">{telemetry.altitudeKm.toFixed(1)} km</span>
                </div>
                <div className="flex justify-between">
                  <span>Terminal Velocity:</span>
                  <span className="text-white font-bold">{telemetry.velocityMs} m/s (Mach {telemetry.mach})</span>
                </div>
                <div className="flex justify-between">
                  <span>Dynamic Pressure:</span>
                  <span className="text-red-400 font-bold">{telemetry.dynamicPressureKpa.toFixed(1)} kPa</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onReturnToHangar) onReturnToHangar();
                    else setStep('hangar');
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-mono text-xs"
                >
                  RETURN TO HANGAR
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-mono font-bold text-xs uppercase shadow-lg shadow-red-500/30"
                >
                  RETRY LAUNCH 🚀
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 5. SUCCESS MODAL (ORBIT ACHIEVED) ────────────────────── */}
      <AnimatePresence>
        {telemetry.orbitAchieved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <div className="max-w-lg w-full bg-space-900 border-2 border-emerald-500 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest border-b border-emerald-500/30 pb-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <span>LEO INSERTION CONFIRMED // PARKING ORBIT ACHIEVED!</span>
              </div>

              <div>
                <h3 className="font-display font-black text-2xl text-white">
                  Welcome to Space, Flight Director! 🛰️
                </h3>
                <p className="text-sm text-slate-300 mt-2 font-sans leading-relaxed">
                  Your launch vehicle performed flawlessly. The spacecraft is now coasting in a stable Low Earth Orbit, solar panels deployed, ready for trans-injection to {destination.name}!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-space-950 rounded-xl border border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block">ORBITAL VELOCITY:</span>
                  <span className="text-emerald-400 font-bold text-sm">{telemetry.velocityMs} m/s</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">PARKING APOGEE:</span>
                  <span className="text-white font-bold text-sm">{telemetry.altitudeKm.toFixed(0)} km</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">MAX-Q RATING:</span>
                  <span className="text-nasa-cyan font-bold text-sm">{telemetry.maxQHandlingScore}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">LAUNCH SCORE:</span>
                  <span className="text-yellow-400 font-bold text-sm">{telemetry.totalLaunchScore} / 100</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-mono text-xs"
                >
                  REFLY LAUNCH
                </button>
                <button
                  onClick={() => {
                    sounds.playSuccess();
                    if (onSuccess) onSuccess();
                    else setStep('simulation');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-mono font-bold text-xs uppercase shadow-lg shadow-emerald-500/30 flex items-center gap-2"
                >
                  <span>PROCEED TO MISSION 🌌</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
