import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gauge, 
  Flame, 
  Target, 
  ShieldCheck, 
  AlertCircle, 
  Radio, 
  Crosshair, 
  Activity, 
  ChevronRight,
  TrendingDown,
  Layers,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { Destination, TelemetrySnapshot } from '../../types/mission';

interface NasaFlightDeckMonitorsProps {
  progressPercent: number;
  destination: Destination;
  telemetry: TelemetrySnapshot;
  onClose?: () => void;
}

export const NasaFlightDeckMonitors: React.FC<NasaFlightDeckMonitorsProps> = ({
  progressPercent,
  destination,
  telemetry,
}) => {
  // Determine arrival landing progress (0 to 1 between 75% and 100%)
  const arrivalProgress = Math.min(1, Math.max(0, (progressPercent - 75) / 25));
  const landingProgress = Math.min(1, Math.max(0, (progressPercent - 83) / 17));

  // Dynamic telemetry calculations mimicking NASA flight computer
  const flightStage = useMemo(() => {
    if (progressPercent < 75) {
      return {
        step: 1,
        title: 'INTERPLANETARY CRUISE',
        sub: 'Approaching target orbital capture sphere',
        craft: 'SPACECRAFT CRUISE STACK',
        status: 'COASTING'
      };
    }
    if (progressPercent < 83) {
      return {
        step: 2,
        title: 'ORBITAL CAPTURE & SATELLITE ROTATION',
        sub: `Stable circular parking orbit around ${destination.name}`,
        craft: 'ORBITAL MOTHERSHIP SATELLITE',
        status: 'ORBITING (SATELLITE)'
      };
    }
    if (progressPercent < 89) {
      return {
        step: 3,
        title: 'ROBOT CAPSULE SEPARATION',
        sub: 'Pyrotechnic bolt release · Cold-gas RCS separation burn',
        craft: 'ROBOTIC LANDER CAPSULE [UNDOCKED]',
        status: 'SEPARATION CONFIRMED'
      };
    }
    if (progressPercent < 94) {
      return {
        step: 4,
        title: 'DE-ORBIT RETRO-BURN & ENTRY',
        sub: 'Retrograde thruster burn · Atmospheric aero-braking',
        craft: 'DESCENT STAGE [RETRO-FIRING]',
        status: 'RETRO BURN ACTIVE'
      };
    }
    if (progressPercent < 98) {
      return {
        step: 5,
        title: 'TERMINAL POWERED DESCENT',
        sub: 'Landing legs locked · Radar terrain lock · Throttling to Best Limit',
        craft: 'TERMINAL LANDER [LEGS DEPLOYED]',
        status: 'TERMINAL BRAKING'
      };
    }
    return {
      step: 6,
      title: 'SURFACE TOUCHDOWN CONFIRMED',
      sub: `Robotic station secured on ${destination.name} surface`,
      craft: 'PLANETARY SURFACE STATION',
      status: 'TOUCHDOWN COMPLETE'
    };
  }, [progressPercent, destination.name]);

  // Radar Altitude (AGL) calculation
  const radarAltitudeMeters = useMemo(() => {
    if (progressPercent < 75) return 380000;
    if (progressPercent < 83) {
      const p = (progressPercent - 75) / 8;
      return Math.round(380000 - p * (380000 - 120000));
    }
    if (progressPercent >= 98) return 0;
    // Descends from 120,000m down to 0m
    const remaining = 1 - (progressPercent - 83) / 15;
    return Math.max(0, Math.round(Math.pow(remaining, 2.4) * 120000));
  }, [progressPercent]);

  // Descent velocity (m/s)
  const descentVelocityMs = useMemo(() => {
    if (progressPercent < 75) return 0;
    if (progressPercent < 83) return 0.2; // Stable orbital coast
    if (progressPercent < 89) return 145.0; // Initial de-orbit drop
    if (progressPercent < 94) return 38.5; // Aero-braking deceleration
    if (progressPercent < 98) {
      // Braking smoothly toward the "Best Limit" green corridor (1.6 - 2.2 m/s)
      const p = (progressPercent - 94) / 4;
      return +(12.0 - p * 10.2).toFixed(1); // 12.0 down to 1.8 m/s
    }
    return 0.0;
  }, [progressPercent]);

  // Engine Throttle %
  const engineThrottlePct = useMemo(() => {
    if (progressPercent < 75) return 25;
    if (progressPercent < 83) return 0; // Coasting orbit
    if (progressPercent < 89) return 18; // RCS cold gas pulses
    if (progressPercent < 94) return 94; // Full retro-burn
    if (progressPercent < 98) return 68; // Terminal throttling to safe limit
    return 0; // Cut-off at touchdown
  }, [progressPercent]);

  // Chamber Pressure MPa
  const chamberPressureMpa = useMemo(() => {
    return +(engineThrottlePct * 0.102).toFixed(2);
  }, [engineThrottlePct]);

  // Core Temp Celsius
  const engineTempC = useMemo(() => {
    if (engineThrottlePct === 0) return 24;
    return Math.round(450 + engineThrottlePct * 11.2);
  }, [engineThrottlePct]);

  // Best Limit corridor status
  // Best limit safe zone: 0.5 to 2.5 m/s
  const bestLimitStatus = useMemo(() => {
    if (progressPercent >= 98) return { label: 'TOUCHDOWN COMPLETE', color: 'text-emerald-400', barPos: 10 };
    if (progressPercent < 83) return { label: 'ORBITAL HOLD (NOMINAL)', color: 'text-cyan-400', barPos: 5 };
    if (progressPercent < 94) return { label: 'RETRO DECELERATION', color: 'text-amber-400', barPos: 85 };
    if (descentVelocityMs <= 2.5) {
      return { label: 'OPTIMAL BEST LIMIT (SOFT TOUCHDOWN)', color: 'text-emerald-400', barPos: 28 };
    }
    if (descentVelocityMs <= 4.5) {
      return { label: 'CAUTION: APPROACHING LIMIT', color: 'text-yellow-400', barPos: 55 };
    }
    return { label: 'HIGH VELOCITY: RETRO BRAKE ACTIVE', color: 'text-red-400', barPos: 80 };
  }, [progressPercent, descentVelocityMs]);

  // Landing success probability %
  const landingChancePct = useMemo(() => {
    if (progressPercent < 75) return 97.4;
    if (progressPercent < 83) return 98.2;
    if (progressPercent < 89) return 98.8;
    if (progressPercent < 94) return 99.1;
    if (progressPercent < 98) return 99.6;
    return 100.0;
  }, [progressPercent]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-2 sm:p-4 font-mono select-none">
      {/* ── TOP MISSION CONTROL BANNER ───────────────────────────────── */}
      <div className="w-full flex items-center justify-between gap-2 pointer-events-auto">
        {/* Left Flight Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/80 border border-cyan-500/40 backdrop-blur-md shadow-lg shadow-cyan-950/50">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <div className="flex flex-col">
            <span className="text-[10px] text-cyan-400 font-bold tracking-wider flex items-center gap-1.5">
              <span>NASA FLIGHT DIRECTOR</span>
              <span className="text-[9px] px-1 py-0.2 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded">
                STAGE {flightStage.step}/6
              </span>
            </span>
            <span className="text-xs text-white font-bold tracking-tight">
              {flightStage.title}
            </span>
          </div>
        </div>

        {/* Center Target Planet Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/80 border border-white/15 backdrop-blur-md text-xs">
          <span className="text-slate-400">TARGET CELESTIAL:</span>
          <span className="font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: destination.color }} />
            {destination.name}
          </span>
          <span className="text-[10px] text-emerald-400 border-l border-white/10 pl-2">
            GRAVITY: {destination.gravity}
          </span>
        </div>

        {/* Right Active Craft Telemetry */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/80 border border-emerald-500/40 backdrop-blur-md shadow-lg shadow-emerald-950/50">
          <div className="text-right flex flex-col">
            <span className="text-[10px] text-emerald-400 font-bold tracking-wider">
              ACTIVE VEHICLE
            </span>
            <span className="text-xs text-white font-bold">
              {flightStage.craft}
            </span>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
        </div>
      </div>

      {/* ── LEFT & RIGHT HUD MONITORS (FLIGHT DECK TELEMETRY) ─────────── */}
      <div className="w-full flex-1 flex items-center justify-between gap-3 my-2 overflow-hidden pointer-events-none">
        {/* ═══════════════════════════════════════════════════════════════
            LEFT NASA MONITOR: [MON-01] ENGINE & PROPULSION TELEMETRY
           ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-auto w-64 sm:w-72 max-w-[48%] flex flex-col gap-2 p-3 rounded-xl bg-black/85 border border-cyan-500/40 backdrop-blur-xl shadow-2xl shadow-cyan-950/60"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-cyan-500/30">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-cyan-400" />
              <span className="text-[11px] font-bold text-cyan-300 tracking-wider">
                [ENG-01] PROPULSION
              </span>
            </div>
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
              engineThrottlePct > 0 
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 animate-pulse'
                : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
            }`}>
              {engineThrottlePct > 0 ? 'THRUST ACTIVE' : 'COASTING'}
            </span>
          </div>

          {/* Engine Throttle Gauge Bar */}
          <div className="p-2 rounded-lg bg-space-950/80 border border-cyan-900/60 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                THROTTLE LEVEL
              </span>
              <span className="font-bold text-white tracking-wide">
                {engineThrottlePct}%
              </span>
            </div>
            {/* Segmented LED Bar */}
            <div className="w-full h-3 bg-slate-900 rounded overflow-hidden flex gap-0.5 p-0.5 border border-slate-800">
              {Array.from({ length: 12 }).map((_, i) => {
                const filled = (i + 1) * 8.33 <= engineThrottlePct;
                const isHigh = i >= 9;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-xs transition-colors duration-200 ${
                      filled
                        ? isHigh
                          ? 'bg-amber-400 shadow-sm shadow-amber-400'
                          : 'bg-cyan-400 shadow-sm shadow-cyan-400'
                        : 'bg-slate-800/60'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Chamber Pressure & Engine Core Temp */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-space-950/80 border border-cyan-900/60">
              <span className="text-[10px] text-slate-400 block mb-0.5">CHAMBER PC</span>
              <span className="text-white font-bold text-sm tracking-tight">
                {chamberPressureMpa} <span className="text-[10px] text-cyan-400 font-normal">MPa</span>
              </span>
              <span className="text-[9px] text-emerald-400 block mt-0.5">NOMINAL (8-11)</span>
            </div>
            <div className="p-2 rounded-lg bg-space-950/80 border border-cyan-900/60">
              <span className="text-[10px] text-slate-400 block mb-0.5">CORE TEMP</span>
              <span className="text-white font-bold text-sm tracking-tight">
                {engineTempC}°C
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">LIMIT: 1,850°C</span>
            </div>
          </div>

          {/* Gimbal Vectoring Reticle + Delta-V */}
          <div className="p-2 rounded-lg bg-space-950/80 border border-cyan-900/60 flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] text-slate-400 block">THRUST VECTOR GIMBAL</span>
              <div className="text-[11px] text-white font-bold flex items-center gap-2 mt-0.5">
                <span>P: <span className="text-cyan-400">+1.4°</span></span>
                <span>Y: <span className="text-cyan-400">-0.6°</span></span>
              </div>
              <span className="text-[9px] text-emerald-400">SERVO LOCK: OK</span>
            </div>
            {/* 2D Mini Gimbal Reticle */}
            <div className="w-10 h-10 rounded border border-cyan-700/60 bg-black/60 relative flex items-center justify-center shrink-0">
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-cyan-500/30" />
              <div className="absolute inset-y-0 left-1/2 w-[1px] bg-cyan-500/30" />
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400 transform translate-x-1 -translate-y-0.5 animate-pulse" />
            </div>
          </div>

          {/* Propellant & RCS Pods */}
          <div className="p-2 rounded-lg bg-space-950/80 border border-cyan-900/60 text-[10px]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>PROPELLANT RESERVE:</span>
              <span className="text-emerald-400 font-bold">{telemetry.fuelPercent}% (+28% MARGIN)</span>
            </div>
            <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono">
              <span className="text-cyan-300">RCS QUAD 1-4: [ONLINE]</span>
              <span className="text-emerald-400">HEAT SHIELD: 100%</span>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════
            RIGHT NASA MONITOR: [MON-02] RADAR, BEST LIMIT & CHANCES
           ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-auto w-64 sm:w-72 max-w-[48%] flex flex-col gap-2 p-3 rounded-xl bg-black/85 border border-emerald-500/40 backdrop-blur-xl shadow-2xl shadow-emerald-950/60"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-emerald-500/30">
            <div className="flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] font-bold text-emerald-300 tracking-wider">
                [NAV-02] GUIDANCE RADAR
              </span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
              RADAR LOCK 4/4
            </span>
          </div>

          {/* Radar Altimeter AGL */}
          <div className="p-2 rounded-lg bg-space-950/80 border border-emerald-900/60">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
              <span>RADAR ALTITUDE (AGL)</span>
              <span className="text-emerald-400 font-bold">TERRAIN TRACK</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-baseline justify-between">
              <span>{radarAltitudeMeters.toLocaleString()}</span>
              <span className="text-xs text-emerald-400 font-normal">METERS</span>
            </div>
          </div>

          {/* ─── BEST LIMIT METER (SAFE LANDING VELOCITY CORRIDOR) ───── */}
          <div className="p-2.5 rounded-lg bg-space-950/90 border-2 border-emerald-500/50 shadow-inner flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-emerald-300 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                BEST LIMIT METER
              </span>
              <span className="text-white font-bold text-xs bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-700/60">
                {descentVelocityMs} m/s
              </span>
            </div>

            {/* Tri-Zone Corridor Gauge (Green = Best Limit, Yellow = Caution, Red = Crash) */}
            <div className="relative w-full h-4 bg-slate-900 rounded overflow-hidden flex border border-slate-700">
              {/* Green Zone: Optimal Best Limit 0 - 2.5 m/s */}
              <div className="w-[40%] h-full bg-emerald-500/80 flex items-center justify-center text-[8px] text-black font-extrabold tracking-tighter">
                BEST LIMIT ≤2.5
              </div>
              {/* Yellow Zone: Caution 2.5 - 5.0 m/s */}
              <div className="w-[30%] h-full bg-amber-500/80 flex items-center justify-center text-[8px] text-black font-bold">
                CAUTION
              </div>
              {/* Red Zone: Structural Hazard > 5.0 m/s */}
              <div className="w-[30%] h-full bg-red-600/80 flex items-center justify-center text-[8px] text-white font-bold">
                CRITICAL
              </div>

              {/* Dynamic Velocity Cursor Needle */}
              <div 
                className="absolute top-0 bottom-0 w-1.5 bg-white border border-black shadow-md shadow-white transition-all duration-300"
                style={{
                  left: `${Math.min(96, Math.max(2, (descentVelocityMs / 8.0) * 100))}%`
                }}
              />
            </div>

            {/* Corridor Status Readout */}
            <div className="flex items-center justify-between text-[9px]">
              <span className={bestLimitStatus.color}>
                ● {bestLimitStatus.label}
              </span>
              <span className="text-slate-400">MAX: 2.5 m/s</span>
            </div>
          </div>

          {/* ─── LANDING CHANCE / PROBABILITY % ───────────────────────── */}
          <div className="p-2 rounded-lg bg-space-950/80 border border-emerald-900/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">TOUCHDOWN CHANCE</span>
              <div className="text-lg font-bold text-emerald-400 flex items-baseline gap-1">
                <span>{landingChancePct}%</span>
                <span className="text-[9px] text-emerald-300 font-normal">PROBABILITY</span>
              </div>
            </div>
            <div className="text-right text-[9px] text-slate-400 flex flex-col gap-0.5">
              <span className="text-emerald-400">SLOPE: 1.2° &lt; 5° [PASS]</span>
              <span className="text-cyan-300">BOULDERS: NULL [PASS]</span>
            </div>
          </div>

          {/* Sequence Steps Progression Indicator */}
          <div className="p-2 rounded-lg bg-space-950/80 border border-emerald-900/60 text-[9px] text-slate-400 space-y-0.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-300 mb-1">
              <span>LANDING SEQUENCE:</span>
              <span className="text-emerald-400">{flightStage.status}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${progressPercent >= 75 ? 'bg-emerald-400' : 'bg-slate-700'}`} />
              <span className={progressPercent >= 75 ? 'text-white' : 'text-slate-500'}>1. Orbital Satellite Orbit</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${progressPercent >= 83 ? 'bg-emerald-400' : 'bg-slate-700'}`} />
              <span className={progressPercent >= 83 ? 'text-white' : 'text-slate-500'}>2. Capsule Separation</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${progressPercent >= 89 ? 'bg-emerald-400' : 'bg-slate-700'}`} />
              <span className={progressPercent >= 89 ? 'text-white' : 'text-slate-500'}>3. Retro-Burn & Descent</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${progressPercent >= 98 ? 'bg-emerald-400' : 'bg-slate-700'}`} />
              <span className={progressPercent >= 98 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>4. Touchdown & Science Return</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── BOTTOM HUD TELEMETRY STREAM ──────────────────────────────── */}
      <div className="w-full flex items-center justify-between text-[10px] text-slate-400 px-3 py-1 rounded bg-black/60 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span>MISSION ELAPSED: <strong className="text-white">{telemetry.missionTime}</strong></span>
          <span className="hidden sm:inline">DATA LINK: <strong className="text-emerald-400">{telemetry.signalStrength}% (HIGH GAIN)</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span>FLIGHT REGIME: <strong className="text-cyan-400">{flightStage.title}</strong></span>
          <span className="text-emerald-400">● LIVE</span>
        </div>
      </div>
    </div>
  );
};
