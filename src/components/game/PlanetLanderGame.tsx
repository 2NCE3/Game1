import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  RotateCcw, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight,
  Compass,
  Zap,
  Globe2,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/soundEffects';

interface PlanetLanderProps {
  destinationName: string;
  onSuccess: (score: number) => void;
  onReturnToHangar?: () => void;
}

export const PlanetLanderGame: React.FC<PlanetLanderProps> = ({
  destinationName,
  onSuccess,
  onReturnToHangar
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Flight State
  const [altitudeM, setAltitudeM] = useState<number>(1800);
  const [verticalSpeedMs, setVerticalSpeedMs] = useState<number>(32);
  const [horizontalSpeedMs, setHorizontalSpeedMs] = useState<number>(0);
  const [fuelKg, setFuelKg] = useState<number>(850);
  const [tiltAngleDeg, setTiltAngleDeg] = useState<number>(0);
  const [hasLanded, setHasLanded] = useState<boolean>(false);
  const [hasCrashed, setHasCrashed] = useState<boolean>(false);
  const [crashReason, setCrashReason] = useState<string>('');
  const [entryStage, setEntryStage] = useState<'plasma_entry' | 'powered_descent'>('plasma_entry');

  // Input states
  const isThrustHeldRef = useRef<boolean>(false);
  const isLeftHeldRef = useRef<boolean>(false);
  const isRightHeldRef = useRef<boolean>(false);

  // Physics Refs
  const landerRef = useRef({
    x: 0, // centered
    y: 0, // computed from altitude
    vx: 0,
    vy: -28,
    altitude: 1800,
    angle: 0,
    fuel: 850,
  });

  // Entry phase timer
  useEffect(() => {
    sounds.playLaunch();
    const t = setTimeout(() => {
      setEntryStage('powered_descent');
      sounds.playSuccess();
    }, 2800);
    return () => clearTimeout(t);
  }, []);

  // Reset function
  const handleReset = useCallback(() => {
    sounds.playSelect();
    landerRef.current = {
      x: (Math.random() - 0.5) * 80,
      y: 0,
      vx: (Math.random() - 0.5) * 6,
      vy: -24,
      altitude: 1500,
      angle: 0,
      fuel: 850,
    };
    setHasLanded(false);
    setHasCrashed(false);
    setCrashReason('');
    setEntryStage('powered_descent');
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        isThrustHeldRef.current = true;
      }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        isLeftHeldRef.current = true;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        isRightHeldRef.current = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        isThrustHeldRef.current = false;
      }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        isLeftHeldRef.current = false;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        isRightHeldRef.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // 60FPS Canvas Physics & Render Loop
  useEffect(() => {
    if (entryStage === 'plasma_entry') return;

    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;

      const l = landerRef.current;

      if (!hasLanded && !hasCrashed) {
        // Physics constants
        const gravity = -9.81 * 0.85; // Exoplanet gravity
        let thrustY = 0;
        let thrustX = 0;

        // Main retro-thruster
        if (isThrustHeldRef.current && l.fuel > 0) {
          const power = 26.5; // engine power
          thrustY = power * Math.cos(l.angle);
          thrustX = -power * Math.sin(l.angle);
          l.fuel = Math.max(0, l.fuel - 35 * dt);
        }

        // Attitude RCS steering
        if (isLeftHeldRef.current) l.angle = Math.max(-0.4, l.angle - 1.2 * dt);
        if (isRightHeldRef.current) l.angle = Math.min(0.4, l.angle + 1.2 * dt);
        // Passive stabilization damping
        if (!isLeftHeldRef.current && !isRightHeldRef.current) {
          l.angle *= 0.98;
        }

        // Velocity integration
        l.vy += (gravity + thrustY) * dt;
        l.vx += thrustX * dt;

        // Position integration
        l.altitude += l.vy * dt * 4;
        l.x += l.vx * dt * 15;

        // Sync React HUD
        setAltitudeM(Math.max(0, Math.round(l.altitude)));
        setVerticalSpeedMs(Math.round(Math.abs(l.vy) * 10) / 10);
        setHorizontalSpeedMs(Math.round(Math.abs(l.vx) * 10) / 10);
        setFuelKg(Math.round(l.fuel));
        setTiltAngleDeg(Math.round((l.angle * 180) / Math.PI));

        // Touchdown Check
        if (l.altitude <= 0) {
          l.altitude = 0;
          const vSpeed = Math.abs(l.vy);
          const hSpeed = Math.abs(l.vx);
          const angleDeg = Math.abs((l.angle * 180) / Math.PI);

          if (vSpeed <= 5.5 && hSpeed <= 3.5 && angleDeg <= 12 && Math.abs(l.x) < 140) {
            // SAFE LANDING!
            setHasLanded(true);
            sounds.playSuccess();
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          } else {
            // CRASH!
            setHasCrashed(true);
            sounds.playFailure();
            if (vSpeed > 5.5) {
              setCrashReason(`Impact velocity too high (${vSpeed.toFixed(1)} m/s). Safe landing threshold is 5.0 m/s!`);
            } else if (angleDeg > 12) {
              setCrashReason(`Lander tipped over (${angleDeg.toFixed(0)}° tilt). Lander must be upright under 12°!`);
            } else {
              setCrashReason('Missed designated landing plateau beacon!');
            }
          }
        }
      }

      // ─── RENDERING ───────────────────────────────────────────
      // Sky: Verdant New Eden turquoise-to-deep-space gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#022c22'); // deep emerald space
      skyGrad.addColorStop(0.5, '#064e3b');
      skyGrad.addColorStop(1, '#065f46');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Distant Low-Poly Alien Mountains
      ctx.fillStyle = '#047857';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.72);
      ctx.lineTo(w * 0.2, h * 0.58);
      ctx.lineTo(w * 0.45, h * 0.68);
      ctx.lineTo(w * 0.7, h * 0.55);
      ctx.lineTo(w, h * 0.75);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // Foreground Landing Surface (Lush Green low-poly valley)
      const groundY = h - 90;
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.moveTo(0, groundY + 15);
      ctx.lineTo(cx - 150, groundY);
      ctx.lineTo(cx + 150, groundY);
      ctx.lineTo(w, groundY + 20);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // Landing Pad Target Platform
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.strokeRect(cx - 70, groundY - 8, 140, 14);
      ctx.fillRect(cx - 70, groundY - 8, 140, 14);

      // Pulsing Landing Pad Beacon Lights
      const beaconTime = now * 0.005;
      const glow = (Math.sin(beaconTime) + 1) * 0.5;
      ctx.fillStyle = `rgba(56, 189, 248, ${0.4 + glow * 0.6})`;
      ctx.beginPath();
      ctx.arc(cx - 60, groundY - 8, 5, 0, Math.PI * 2);
      ctx.arc(cx + 60, groundY - 8, 5, 0, Math.PI * 2);
      ctx.fill();

      // Target Crosshair on Pad
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cx - 30, groundY - 6, 60, 10);

      // Compute Lander Screen Position
      const altitudePct = Math.min(1, l.altitude / 1500);
      const landerY = (groundY - 35) - altitudePct * (h * 0.65);
      const landerX = cx + l.x;

      // Draw Lander
      ctx.save();
      ctx.translate(landerX, landerY);
      ctx.rotate(l.angle);

      // Rocket Thrust Plume
      if (isThrustHeldRef.current && l.fuel > 0 && !hasLanded && !hasCrashed) {
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(-10, 16);
        ctx.lineTo(0, 42 + Math.random() * 12);
        ctx.lineTo(10, 16);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.moveTo(-5, 16);
        ctx.lineTo(0, 28 + Math.random() * 8);
        ctx.lineTo(5, 16);
        ctx.closePath();
        ctx.fill();
      }

      // Lander Body (Geometric Command Pod)
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-18, 14);
      ctx.lineTo(18, 14);
      ctx.lineTo(14, -8);
      ctx.lineTo(0, -20);
      ctx.lineTo(-14, -8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Glass Cockpit Window
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(0, -5, 6, 0, Math.PI * 2);
      ctx.fill();

      // Extended Landing Legs
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-14, 12);
      ctx.lineTo(-24, 25);
      ctx.lineTo(-30, 25);
      ctx.moveTo(14, 12);
      ctx.lineTo(24, 25);
      ctx.lineTo(30, 25);
      ctx.stroke();

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [entryStage, hasLanded, hasCrashed]);

  return (
    <div className="relative w-full h-full bg-space-950 overflow-hidden select-none">
      {/* ─── PHASE 1: ATMOSPHERIC ENTRY PLASMA ───────────────────── */}
      <AnimatePresence>
        {entryStage === 'plasma_entry' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-gradient-to-b from-orange-600/30 via-red-950/80 to-space-950 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-16 h-16 rounded-sm bg-orange-500/20 border border-orange-400 flex items-center justify-center font-mono font-bold text-xs text-orange-400 mb-4 shadow-xl">
              [ENTRY]
            </div>

            <div className="text-xs font-mono text-orange-400 tracking-widest uppercase font-bold mb-1">
              ATMOSPHERIC ENTRY DETECTED // 12,000 M/S
            </div>
            <h2 className="text-2xl font-display font-black text-white mb-2">
              Penetrating {destinationName} Atmosphere...
            </h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto font-sans leading-relaxed">
              Ablative heat shield undergoing maximum plasma ionization. Terminal descent thrusters arming in 3 seconds...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── PHASE 2: POWERED DESCENT CANVAS ─────────────────────── */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Top Telemetry Flight Visor */}
      <div className="absolute top-4 left-6 right-6 z-20 flex items-center justify-between pointer-events-none">
        <div className="px-4 py-2.5 rounded-2xl bg-space-950/85 border border-nasa-cyan/40 backdrop-blur-md">
          <div className="text-[10px] font-mono text-nasa-cyan uppercase tracking-widest font-bold">
            DESCENT RADAR // {destinationName.toUpperCase()}
          </div>
          <div className="text-xs font-mono font-bold text-white flex items-center gap-4 mt-0.5">
            <span>ALTITUDE: <strong className="text-white">{altitudeM}m</strong></span>
            <span>V-SPEED: <strong className={verticalSpeedMs > 5.5 ? 'text-red-400' : 'text-emerald-400'}>{verticalSpeedMs} m/s</strong></span>
            <span>TILT: <strong className={Math.abs(tiltAngleDeg) > 12 ? 'text-red-400' : 'text-white'}>{tiltAngleDeg}°</strong></span>
          </div>
        </div>

        <div className="px-4 py-2.5 rounded-2xl bg-space-950/85 border border-slate-800 backdrop-blur-md text-right">
          <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
            DESCENT PROPELLANT
          </div>
          <div className="text-xs font-mono font-bold text-amber-300">
            {fuelKg} KG REMAINING
          </div>
        </div>
      </div>

      {/* Bottom Manual Thrust Controls */}
      <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between gap-4">
        {/* Left/Right RCS Balance */}
        <div className="flex items-center gap-2">
          <button
            onMouseDown={() => { isLeftHeldRef.current = true; }}
            onMouseUp={() => { isLeftHeldRef.current = false; }}
            onTouchStart={() => { isLeftHeldRef.current = true; }}
            onTouchEnd={() => { isLeftHeldRef.current = false; }}
            className="px-4 py-3 rounded-xl bg-space-900 border border-slate-700 hover:bg-slate-800 text-white font-mono text-xs font-bold shadow-lg"
          >
            ◀ TILT LEFT [A]
          </button>
          <button
            onMouseDown={() => { isRightHeldRef.current = true; }}
            onMouseUp={() => { isRightHeldRef.current = false; }}
            onTouchStart={() => { isRightHeldRef.current = true; }}
            onTouchEnd={() => { isRightHeldRef.current = false; }}
            className="px-4 py-3 rounded-xl bg-space-900 border border-slate-700 hover:bg-slate-800 text-white font-mono text-xs font-bold shadow-lg"
          >
            TILT RIGHT [D] ▶
          </button>
        </div>

        {/* Center: BIG TACTILE RETRO-THRUST BUTTON */}
        <div className="flex-1 max-w-sm">
          <button
            onMouseDown={() => { isThrustHeldRef.current = true; }}
            onMouseUp={() => { isThrustHeldRef.current = false; }}
            onTouchStart={() => { isThrustHeldRef.current = true; }}
            onTouchEnd={() => { isThrustHeldRef.current = false; }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 hover:from-orange-400 hover:to-yellow-300 text-black font-mono font-bold text-sm uppercase tracking-wider shadow-2xl shadow-orange-500/40 flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer ring-4 ring-orange-500/20"
          >
            <Flame className="w-5 h-5 fill-black" />
            <span>HOLD [SPACE] FOR RETRO-THRUST</span>
          </button>
        </div>

        {/* Reset button */}
        <button
          onClick={handleReset}
          className="p-3.5 rounded-xl bg-space-900 border border-slate-800 text-slate-400 hover:text-white"
          title="Reset Lander to High Altitude"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* ─── CRASH MODAL ────────────────────────────────────────── */}
      <AnimatePresence>
        {hasCrashed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <div className="max-w-md w-full bg-space-950 border border-red-500 rounded-sm p-6 shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 rounded-sm bg-red-500/20 border border-red-500/40 flex items-center justify-center font-mono font-bold text-xs text-red-400 mx-auto">
                [ABORT]
              </div>
              <h3 className="font-display font-black text-xl text-white">
                HARD IMPACT ANOMALY
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {crashReason}
              </p>
              <div className="p-3 rounded-sm bg-space-900 border border-slate-800 text-xs text-slate-400 font-mono">
                <span className="text-nasa-orange font-bold mr-1">FLIGHT ADVISORY:</span> Fire retro-thrusters in short pulses below 300m to keep descent speed below 5.0 m/s before touching down.
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 rounded-sm bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase shadow-md border border-red-400"
                >
                  RETRY DESCENT
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── SUCCESS MODAL: NEW EDEN TOUCHDOWN! ─────────────────── */}
      <AnimatePresence>
        {hasLanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <div className="max-w-lg w-full bg-space-950 border border-emerald-500 rounded-sm p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest border-b border-emerald-500/30 pb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>TOUCHDOWN CONFIRMED // COLONIZATION COMMENCED</span>
              </div>

              <div>
                <h3 className="font-display font-black text-xl text-white">
                  Welcome to Humanity's New Home
                </h3>
                <p className="text-xs text-slate-300 mt-2 font-sans leading-relaxed">
                  The lander has settled gently onto the verdant plains of <strong>{destinationName}</strong>. Atmospheric sensors confirm breathable air and pure water. Cryogenic seed vault deploying.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-space-900 rounded-sm border border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block">TOUCHDOWN VELOCITY:</span>
                  <span className="text-emerald-400 font-bold text-sm">{verticalSpeedMs} m/s (NOMINAL)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">FUEL MARGIN:</span>
                  <span className="text-white font-bold text-sm">{fuelKg} kg RESERVED</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    sounds.playSuccess();
                    onSuccess(98);
                  }}
                  className="w-full py-3 rounded-sm bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer border border-emerald-300"
                >
                  <span>VIEW MISSION DEBRIEF & NASA CHALLENGE REPORT</span>
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
