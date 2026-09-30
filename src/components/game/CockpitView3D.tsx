import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  ShieldAlert, 
  Zap, 
  Flame, 
  Crosshair, 
  Radio, 
  Sparkles, 
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Shield,
  Eye,
  Sliders
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface AsteroidObject {
  id: number;
  x: number; // -100 to 100
  y: number; // -50 to 50
  z: number; // 200 (far) to 0 (hit/pass)
  size: number;
  rotation: number;
  rotSpeed: number;
  destroyed?: boolean;
}

interface CockpitView3DProps {
  destinationName: string;
  onArrival: () => void;
  onEmergencyAbort?: () => void;
}

export const CockpitView3D: React.FC<CockpitView3DProps> = ({
  destinationName,
  onArrival,
  onEmergencyAbort
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Flight Telemetry State
  const [speedPercent, setSpeedPercent] = useState<number>(65); // 0 to 100
  const [distanceAu, setDistanceAu] = useState<number>(100); // 100% down to 0%
  const [shieldHealth, setShieldHealth] = useState<number>(100);
  const [engineTempC, setEngineTempC] = useState<number>(340);
  const [fuelRemainingKg, setFuelRemainingKg] = useState<number>(4200);
  const [shipHeadingX, setShipHeadingX] = useState<number>(0); // -1 to 1

  // Active Hazard System
  const [activeHazard, setActiveHazard] = useState<null | 'asteroid' | 'solar_flare' | 'debris'>(null);
  const [hazardCountdown, setHazardCountdown] = useState<number>(0);
  const [isShieldActive, setIsShieldActive] = useState<boolean>(false);
  const [radioMessage, setRadioMessage] = useState<string>("Cruising through Kuiper belt corridor. All drives nominal.");

  // Lasers fired
  const [lasers, setLasers] = useState<{ id: number; x: number; y: number }[]>([]);

  // Simulation Refs for 60fps canvas loop
  const asteroidsRef = useRef<AsteroidObject[]>([]);
  const starsRef = useRef<{ x: number; y: number; z: number; size: number }[]>([]);
  const particlesRef = useRef<{ x: number; y: number; z: number; alpha: number }[]>([]);
  const headingRef = useRef(0);
  const throttleRef = useRef(65);
  const distanceRef = useRef(100);
  const shieldRef = useRef(100);
  const engineTempRef = useRef(340);
  const fuelRef = useRef(4200);
  const isShieldActiveRef = useRef(false);

  // Initialize starfield
  useEffect(() => {
    const stars: { x: number; y: number; z: number; size: number }[] = [];
    for (let i = 0; i < 250; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 600,
        z: Math.random() * 800 + 10,
        size: Math.random() * 2 + 0.5,
      });
    }
    starsRef.current = stars;
  }, []);

  // Sync refs
  useEffect(() => {
    throttleRef.current = speedPercent;
  }, [speedPercent]);

  useEffect(() => {
    isShieldActiveRef.current = isShieldActive;
  }, [isShieldActive]);

  // Fire laser function
  const handleFireLasers = useCallback(() => {
    sounds.playLaser();
    const newLaser = { id: Date.now(), x: headingRef.current * 150, y: 0 };
    setLasers(prev => [...prev.slice(-3), newLaser]);

    // Check hit against nearest asteroid
    asteroidsRef.current.forEach(ast => {
      if (ast.z > 20 && ast.z < 140 && Math.abs(ast.x - headingRef.current * 80) < 40) {
        ast.destroyed = true;
        sounds.playSuccess();
        setRadioMessage("Target eliminated! Space rock neutralized.");
      }
    });
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        headingRef.current = Math.max(-1, headingRef.current - 0.2);
        setShipHeadingX(headingRef.current);
      }
      if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        headingRef.current = Math.min(1, headingRef.current + 0.2);
        setShipHeadingX(headingRef.current);
      }
      if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        setIsShieldActive(true);
        sounds.playBeep();
      }
      if (e.code === 'Space') {
        e.preventDefault();
        handleFireLasers();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        setIsShieldActive(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleFireLasers]);

  // 60FPS Cockpit Canvas Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();
    let asteroidSpawnTimer = 0;
    let hazardTimer = 0;

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Handle Resize
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Clear space background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, w, h);

      // Distant Colorful Nebula Glow
      const grad = ctx.createRadialGradient(cx + 150, cy - 80, 50, cx + 150, cy - 80, 350);
      grad.addColorStop(0, 'rgba(16, 185, 129, 0.15)'); // Emerald New Eden glow
      grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.08)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Starfield Update & Render (Speed-dependent warp streaks)
      const currentSpeed = throttleRef.current;
      const starSpeed = currentSpeed * 4.5 + 50;

      ctx.fillStyle = '#ffffff';
      starsRef.current.forEach(star => {
        star.z -= starSpeed * dt;
        if (star.z <= 1) {
          star.z = 800;
          star.x = (Math.random() - 0.5) * 800;
          star.y = (Math.random() - 0.5) * 600;
        }

        // Perspective projection with ship turn offset
        const k = 280 / star.z;
        const px = cx + (star.x - headingRef.current * 140) * k;
        const py = cy + star.y * k;

        if (px >= 0 && px <= w && py >= 0 && py <= h) {
          const streakLen = Math.max(1, (currentSpeed / 25) * (800 / star.z));
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(1, 1 - star.z / 800)})`;
          ctx.lineWidth = star.size * k;
          ctx.moveTo(px, py);
          ctx.lineTo(px - headingRef.current * streakLen * 0.3, py + streakLen * 0.2);
          ctx.stroke();
        }
      });

      // Spawn Asteroids
      asteroidSpawnTimer += dt;
      if (asteroidSpawnTimer > 3.0 && Math.random() < 0.6) {
        asteroidSpawnTimer = 0;
        asteroidsRef.current.push({
          id: Math.random(),
          x: (Math.random() - 0.5) * 200,
          y: (Math.random() - 0.5) * 120,
          z: 220,
          size: Math.random() * 25 + 15,
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 2
        });
      }

      // Update & Render Asteroids (Low-Poly faceted rocks)
      asteroidsRef.current.forEach((ast, idx) => {
        ast.z -= (starSpeed * 0.8) * dt;
        ast.rotation += ast.rotSpeed * dt;

        if (ast.z > 0 && !ast.destroyed) {
          const k = 280 / ast.z;
          const ax = cx + (ast.x - headingRef.current * 140) * k;
          const ay = cy + ast.y * k;
          const r = ast.size * k;

          // Collision detection near cockpit window
          if (ast.z < 15 && Math.abs(ax - cx) < 80 && Math.abs(ay - cy) < 60) {
            ast.destroyed = true;
            if (isShieldActiveRef.current) {
              sounds.playLaser();
              shieldRef.current = Math.max(0, shieldRef.current - 12);
              setShieldHealth(Math.round(shieldRef.current));
            } else {
              sounds.playWarning();
              shieldRef.current = Math.max(0, shieldRef.current - 35);
              setShieldHealth(Math.round(shieldRef.current));
              setRadioMessage("WARNING! Hull impact detected! Activate shields [W]!");
            }
          }

          // Draw low-poly asteroid
          ctx.save();
          ctx.translate(ax, ay);
          ctx.rotate(ast.rotation);

          ctx.fillStyle = '#64748b';
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1.5;

          ctx.beginPath();
          for (let p = 0; p < 6; p++) {
            const angle = (p * Math.PI) / 3;
            const radius = r * (0.8 + 0.4 * Math.sin(p * 2 + ast.id));
            const xPos = radius * Math.cos(angle);
            const yPos = radius * Math.sin(angle);
            if (p === 0) ctx.moveTo(xPos, yPos);
            else ctx.lineTo(xPos, yPos);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Highlight facet
          ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(r * 0.7, -r * 0.2);
          ctx.lineTo(r * 0.3, -r * 0.7);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
        }
      });

      // Filter off-screen asteroids
      asteroidsRef.current = asteroidsRef.current.filter(a => a.z > 0 && !a.destroyed);

      // Distance progress & telemetry drain
      distanceRef.current = Math.max(0, distanceRef.current - (currentSpeed * 0.04) * dt);
      setDistanceAu(Math.round(distanceRef.current * 10) / 10);

      // Fuel consumption
      fuelRef.current = Math.max(0, fuelRef.current - (currentSpeed * 0.15) * dt);
      setFuelRemainingKg(Math.round(fuelRef.current));

      // Engine temperature management
      if (currentSpeed > 80) {
        engineTempRef.current = Math.min(680, engineTempRef.current + 8 * dt);
      } else {
        engineTempRef.current = Math.max(300, engineTempRef.current - 5 * dt);
      }
      setEngineTempC(Math.round(engineTempRef.current));

      // Arrival trigger
      if (distanceRef.current <= 0) {
        sounds.playSuccess();
        onArrival();
        return;
      }

      // ─── 3D LOW-POLY COCKPIT FRAME OVERLAY ───────────────────
      ctx.save();
      // Outer Canopy Pillars (Dark metallic low-poly struts)
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 4;

      // Top Header Canopy Bar
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w - 60, 60);
      ctx.lineTo(60, 60);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Left Cockpit Strut
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(80, 0);
      ctx.lineTo(160, h - 120);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right Cockpit Strut
      ctx.beginPath();
      ctx.moveTo(w, 0);
      ctx.lineTo(w - 80, 0);
      ctx.lineTo(w - 160, h - 120);
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Bottom Flight Console Dashboard
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(160, h - 120);
      ctx.lineTo(cx - 180, h - 110);
      ctx.lineTo(cx, h - 90);
      ctx.lineTo(cx + 180, h - 110);
      ctx.lineTo(w - 160, h - 120);
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Canopy Window Glass Tint & Reflection Grid
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 200, 60);
      ctx.lineTo(cx - 180, h - 110);
      ctx.moveTo(cx + 200, 60);
      ctx.lineTo(cx + 180, h - 110);
      ctx.stroke();

      // Cockpit Reticle in Center
      ctx.strokeStyle = isShieldActiveRef.current ? '#10b981' : '#00e5ff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 26, 0, Math.PI * 2);
      ctx.moveTo(cx - 38, cy);
      ctx.lineTo(cx - 14, cy);
      ctx.moveTo(cx + 14, cy);
      ctx.lineTo(cx + 38, cy);
      ctx.moveTo(cx, cy - 38);
      ctx.lineTo(cx, cy - 14);
      ctx.moveTo(cx, cy + 14);
      ctx.lineTo(cx, cy + 38);
      ctx.stroke();

      // Shield active sphere reflection
      if (isShieldActiveRef.current) {
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(cx, cy, w * 0.42, h * 0.38, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [onArrival]);

  return (
    <div className="relative w-full h-full bg-space-950 overflow-hidden select-none">
      {/* 3D Canvas Viewport */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Top HUD Visor Projection */}
      <div className="absolute top-4 left-6 right-6 flex items-center justify-between z-20 pointer-events-none">
        {/* Left: Mission Vector */}
        <div className="px-4 py-2 rounded-2xl bg-space-950/80 border border-nasa-cyan/40 backdrop-blur-md flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <div>
            <div className="text-[10px] font-mono text-nasa-cyan uppercase tracking-widest font-bold">
              FLIGHT VECTOR // TO {destinationName.toUpperCase()}
            </div>
            <div className="text-xs font-mono font-bold text-white">
              REMAINING: {distanceAu}% // SPEED: {Math.round(speedPercent * 18.5)} km/s
            </div>
          </div>
        </div>

        {/* Center: Destination Beacon */}
        <div className="text-center hidden sm:block">
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">
            HABITABLE EXOPLANET BEACON DETECTED
          </span>
          <span className="text-xs font-sans text-slate-300">
            Maintain sub-light cruise within thermal boundaries
          </span>
        </div>

        {/* Right: Quick Skip to Landing for Demo */}
        <button
          onClick={() => {
            sounds.playSuccess();
            onArrival();
          }}
          className="pointer-events-auto px-4 py-2 rounded-sm bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 cursor-pointer border border-emerald-300"
        >
          <span>INITIATE DESCENT</span>
        </button>
      </div>

      {/* Bottom Dashboard Controls */}
      <div className="absolute bottom-4 left-6 right-6 z-20 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Dashboard: Heading & Shield Controls */}
        <div className="flex items-center gap-2 bg-space-950/90 p-2.5 rounded-sm border border-slate-800 backdrop-blur-md">
          <button
            onMouseDown={() => {
              headingRef.current = Math.max(-1, headingRef.current - 0.25);
              setShipHeadingX(headingRef.current);
            }}
            className="px-3 py-2 rounded-sm bg-space-900 border border-slate-700 hover:bg-slate-800 text-white font-mono text-xs font-bold"
          >
            STEER [A]
          </button>

          <button
            onMouseDown={() => {
              headingRef.current = Math.min(1, headingRef.current + 0.25);
              setShipHeadingX(headingRef.current);
            }}
            className="px-3 py-2 rounded-sm bg-space-900 border border-slate-700 hover:bg-slate-800 text-white font-mono text-xs font-bold"
          >
            STEER [D]
          </button>

          <button
            onMouseDown={() => setIsShieldActive(true)}
            onMouseUp={() => setIsShieldActive(false)}
            onTouchStart={() => setIsShieldActive(true)}
            onTouchEnd={() => setIsShieldActive(false)}
            className={`px-3.5 py-2 rounded-sm border font-mono text-xs font-bold flex items-center gap-1.5 transition-all ${
              isShieldActive 
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-md ring-2 ring-emerald-300' 
                : 'bg-space-900 border-emerald-800/80 text-emerald-400 hover:bg-emerald-950/40'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>SHIELDS [W]</span>
          </button>

          <button
            onClick={handleFireLasers}
            className="px-3.5 py-2 rounded-sm bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer border border-red-400"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>LASER [SPACE]</span>
          </button>
        </div>

        {/* Center: Real-Time Radio Chatter from NOVA-9 */}
        <div className="max-w-md w-full px-4 py-2.5 rounded-sm bg-space-950/90 border border-nasa-cyan/40 backdrop-blur-md flex items-center gap-3">
          <div className="w-7 h-7 rounded-sm bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-[10px] font-mono font-bold text-cyan-300 shrink-0">
            [AI]
          </div>
          <div className="text-[11px] font-sans leading-snug">
            <span className="font-mono font-bold text-nasa-cyan mr-1.5">NOVA-09:</span>
            <span className="text-slate-200">{radioMessage}</span>
          </div>
        </div>

        {/* Right Dashboard: Speed Throttle Slider */}
        <div className="bg-space-950/90 p-3 rounded-2xl border border-slate-800 backdrop-blur-md flex items-center gap-3 min-w-[240px]">
          <div className="text-left shrink-0">
            <div className="text-[9px] font-mono text-slate-400 uppercase">IMPULSE THROTTLE</div>
            <div className={`text-xs font-mono font-bold ${engineTempC > 500 ? 'text-red-400 animate-pulse' : 'text-nasa-cyan'}`}>
              {speedPercent}% // {engineTempC}°C
            </div>
          </div>

          <input
            type="range"
            min="10"
            max="100"
            value={speedPercent}
            onChange={(e) => setSpeedPercent(Number(e.target.value))}
            className="w-full accent-nasa-cyan cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
