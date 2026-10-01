import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Rocket, 
  DollarSign, 
  Weight, 
  Zap, 
  Fuel, 
  Award, 
  Play,
  ArrowLeft,
  FileCheck2,
  Cpu,
  Layers,
  Radio,
  Share2,
  Wand2,
  Sparkles
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { CadetGuideBanner } from '../common/CadetGuideBanner';
import { 
  MISSION_BRIEFS, 
  DESTINATIONS, 
  SPACECRAFT_BUSES, 
  PAYLOAD_INSTRUMENTS, 
  LAUNCH_VEHICLES, 
  POWER_SYSTEMS, 
  COMMS_SYSTEMS, 
  PROPULSION_SYSTEMS, 
  TRAJECTORY_OPTIONS 
} from '../../data/missionsData';
import { sounds } from '../../utils/soundEffects';

export const Screen08Review: React.FC = () => {
  const { 
    state, 
    resources, 
    readinessChecks, 
    startSimulation, 
    setStep, 
    autoBalanceMission,
    cadetMode
  } = useMission();

  const brief = MISSION_BRIEFS.find(b => b.id === state.briefId);
  const dest = DESTINATIONS.find(d => d.id === state.destinationId);
  const bus = SPACECRAFT_BUSES.find(b => b.id === state.busId);
  const rocket = LAUNCH_VEHICLES.find(r => r.id === state.launchVehicleId);
  const power = POWER_SYSTEMS.find(p => p.id === state.powerSystemId);
  const comms = COMMS_SYSTEMS.find(c => c.id === state.commsSystemId);
  const prop = PROPULSION_SYSTEMS.find(p => p.id === state.propulsionSystemId);
  const traj = TRAJECTORY_OPTIONS.find(t => t.id === state.trajectoryId);
  const payloads = PAYLOAD_INSTRUMENTS.filter(p => state.payloadIds.includes(p.id));

  const hasCriticalFailure = readinessChecks.some(c => !c.passed && c.severity === 'error');

  const handleLaunch = () => {
    sounds.playLaunch();
    startSimulation();
  };

  const handleFixAndLaunch = () => {
    sounds.playSuccess();
    autoBalanceMission();
  };

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-y-auto">
      <div>
        {/* Child-Friendly Cadet Guide Banner */}
        <CadetGuideBanner
          currentStep="review"
          stepNumber={8}
          title="Ready Check"
          childQuestion="Is our spacecraft ready to blast off into space? 🚀"
          childTip="All green checkmarks mean we are GO FOR LAUNCH! If anything is red, click 'Fix Everything For Me' and Commander Nova will make it perfect!"
          onNext={!hasCriticalFailure ? handleLaunch : undefined}
          onPrev={() => setStep('trajectory')}
          disableNext={hasCriticalFailure}
        />

        <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-nasa-cyan uppercase tracking-widest mb-1">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>PHASE 08 // FLIGHT READINESS REVIEW</span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide">
                MISSION READINESS CHECKOUT
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                Verify systems margins, safety checks, and flight configuration before rocket ignition.
              </p>
            </div>

            {/* Large Readiness Score Gauge */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-space-900/90 border border-slate-800 backdrop-blur-md shrink-0 shadow-lg">
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                  FLIGHT READINESS
                </span>
                <span className={`text-xs font-mono font-bold ${hasCriticalFailure ? 'text-red-400' : 'text-emerald-400'}`}>
                  {hasCriticalFailure ? 'STATUS: NO-GO ⚠' : 'STATUS: GO FOR FLIGHT ✓'}
                </span>
              </div>

              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    className="stroke-slate-800"
                    strokeWidth="5"
                    fill="transparent"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    className={`transition-all duration-1000 ${
                      resources.readinessScore >= 85 ? 'stroke-emerald-400' : (resources.readinessScore >= 60 ? 'stroke-amber-400' : 'stroke-red-500')
                    }`}
                    strokeWidth="5"
                    strokeDasharray={176}
                    strokeDashoffset={176 - (176 * resources.readinessScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute font-mono font-bold text-lg text-white">
                  {resources.readinessScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Cadet Mode: Child-friendly 4 Big Pillars Summary */}
          {cadetMode && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
              {/* Pillar 1: Mass */}
              <div className={`p-4 rounded-xl border transition-all ${
                resources.isOverMass 
                  ? 'bg-red-950/40 border-red-500/70 text-red-200' 
                  : 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold uppercase flex items-center gap-1.5 font-mono">
                    <Weight className="w-4 h-4 text-cyan-400" />
                    <span>Spaceship Weight</span>
                  </span>
                  <span className="text-sm">{resources.isOverMass ? '❌ TOO HEAVY' : '✅ PERFECT'}</span>
                </div>
                <p className="text-xs text-slate-300">
                  {resources.isOverMass 
                    ? `Heavier than rocket can lift! (${resources.totalMass} kg vs ${resources.massLimit} kg max).` 
                    : `Rocket can easily lift our ${resources.totalMass.toLocaleString()} kg spaceship!`}
                </p>
              </div>

              {/* Pillar 2: Power */}
              <div className={`p-4 rounded-xl border transition-all ${
                resources.isPowerDeficit 
                  ? 'bg-red-950/40 border-red-500/70 text-red-200' 
                  : 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold uppercase flex items-center gap-1.5 font-mono">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Electric Power</span>
                  </span>
                  <span className="text-sm">{resources.isPowerDeficit ? '❌ NOT ENOUGH' : '✅ SUNNY & STRONG'}</span>
                </div>
                <p className="text-xs text-slate-300">
                  {resources.isPowerDeficit 
                    ? `Sensors need ${resources.powerRequired}W but generating only ${resources.powerGenerated}W.` 
                    : `Generating ${resources.powerGenerated}W with safe reserve for dark space!`}
                </p>
              </div>

              {/* Pillar 3: Fuel */}
              <div className={`p-4 rounded-xl border transition-all ${
                resources.isDeltaVDeficit 
                  ? 'bg-red-950/40 border-red-500/70 text-red-200' 
                  : 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold uppercase flex items-center gap-1.5 font-mono">
                    <Fuel className="w-4 h-4 text-orange-400" />
                    <span>Engine Fuel</span>
                  </span>
                  <span className="text-sm">{resources.isDeltaVDeficit ? '❌ EMPTY TANK' : '✅ FULL TANK'}</span>
                </div>
                <p className="text-xs text-slate-300">
                  {resources.isDeltaVDeficit 
                    ? `Not enough Delta-V push to reach destination!` 
                    : `Plenty of engine speed (${resources.deltaVAvailable} m/s) to fly to ${dest?.name}!`}
                </p>
              </div>

              {/* Pillar 4: Budget */}
              <div className={`p-4 rounded-xl border transition-all ${
                resources.isOverBudget 
                  ? 'bg-red-950/40 border-red-500/70 text-red-200' 
                  : 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold uppercase flex items-center gap-1.5 font-mono">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>NASA Budget</span>
                  </span>
                  <span className="text-sm">{resources.isOverBudget ? '❌ OVER BUDGET' : '✅ APPROVED'}</span>
                </div>
                <p className="text-xs text-slate-300">
                  {resources.isOverBudget 
                    ? `Cost $${resources.totalCost}M exceeds $${resources.budgetLimit}M limit!` 
                    : `Mission cost $${resources.totalCost}M stays inside $${resources.budgetLimit}M allowance!`}
                </p>
              </div>
            </div>
          )}

          {/* 9 Component Breakdown Chips */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9 gap-2.5 mb-6">
            <div className="p-2.5 bg-space-950/80 border border-slate-800/80 rounded-xl">
              <span className="text-[9px] font-mono text-slate-500 uppercase block">1. OBJECTIVE</span>
              <div className="text-xs font-bold text-white truncate">{brief?.title.split(' ')[0] || 'Unselected'}</div>
            </div>
            <div className="p-2.5 bg-space-950/80 border border-slate-800/80 rounded-xl">
              <span className="text-[9px] font-mono text-slate-500 uppercase block">2. DESTINATION</span>
              <div className="text-xs font-bold text-white truncate">{dest?.name || 'Unselected'}</div>
            </div>
            <div className="p-2.5 bg-space-950/80 border border-slate-800/80 rounded-xl">
              <span className="text-[9px] font-mono text-slate-500 uppercase block">3. SPACECRAFT</span>
              <div className="text-xs font-bold text-white truncate">{bus?.name.split(' ')[0] || 'Unselected'}</div>
            </div>
            <div className="p-2.5 bg-space-950/80 border border-slate-800/80 rounded-xl">
              <span className="text-[9px] font-mono text-slate-500 uppercase block">4. PAYLOAD</span>
              <div className="text-xs font-bold text-white truncate">{payloads.length} Instruments</div>
            </div>
            <div className="p-2.5 bg-space-950/80 border border-slate-800/80 rounded-xl">
              <span className="text-[9px] font-mono text-slate-500 uppercase block">5. ROCKET</span>
              <div className="text-xs font-bold text-white truncate">{rocket?.name.split(' ')[0] || 'Unselected'}</div>
            </div>
            <div className="p-2.5 bg-space-950/80 border border-slate-800/80 rounded-xl">
              <span className="text-[9px] font-mono text-slate-500 uppercase block">6. POWER</span>
              <div className="text-xs font-bold text-white truncate">{power?.name.split(' ')[0] || 'Unselected'}</div>
            </div>
            <div className="p-2.5 bg-space-950/80 border border-slate-800/80 rounded-xl">
              <span className="text-[9px] font-mono text-slate-500 uppercase block">7. COMMS</span>
              <div className="text-xs font-bold text-white truncate">{comms?.name.split(' ')[0] || 'Unselected'}</div>
            </div>
            <div className="p-2.5 bg-space-950/80 border border-slate-800/80 rounded-xl">
              <span className="text-[9px] font-mono text-slate-500 uppercase block">8. PROPULSION</span>
              <div className="text-xs font-bold text-white truncate">{prop?.name.split(' ')[0] || 'Unselected'}</div>
            </div>
            <div className="p-2.5 bg-space-950/80 border border-slate-800/80 rounded-xl">
              <span className="text-[9px] font-mono text-slate-500 uppercase block">9. TRAJECTORY</span>
              <div className="text-xs font-bold text-white truncate">{traj?.name.split(' ')[0] || 'Unselected'}</div>
            </div>
          </div>

          {/* Health Dashboard & Readiness Checklist Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Technical Systems Telemetry Margins */}
            <div className="p-5 rounded-2xl bg-space-900/80 border border-slate-800 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-[10px] text-nasa-cyan font-bold tracking-widest uppercase">
                  SYSTEMS TELEMETRY MARGINS
                </span>
                <span className="text-slate-400">SPEC LIMITS</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-space-950/60 border border-slate-800/80">
                <span className="text-slate-400 flex items-center gap-2">
                  <Weight className="w-3.5 h-3.5 text-cyan-400" />
                  TOTAL MASS
                </span>
                <span className={`font-bold telemetry-val ${resources.isOverMass ? 'text-red-400' : 'text-white'}`}>
                  {resources.totalMass.toLocaleString()} / {resources.massLimit.toLocaleString()} kg
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-space-950/60 border border-slate-800/80">
                <span className="text-slate-400 flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  BUDGET USED
                </span>
                <span className={`font-bold telemetry-val ${resources.isOverBudget ? 'text-red-400' : 'text-white'}`}>
                  ${resources.totalCost}M / ${resources.budgetLimit}M
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-space-950/60 border border-slate-800/80">
                <span className="text-slate-400 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  POWER BALANCE
                </span>
                <span className={`font-bold telemetry-val ${resources.isPowerDeficit ? 'text-red-400' : 'text-white'}`}>
                  {resources.powerGenerated}W gen / {resources.powerRequired}W req ({resources.powerReservePercent}%)
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-space-950/60 border border-slate-800/80">
                <span className="text-slate-400 flex items-center gap-2">
                  <Fuel className="w-3.5 h-3.5 text-orange-400" />
                  DELTA-V CAPABILITY
                </span>
                <span className={`font-bold telemetry-val ${resources.isDeltaVDeficit ? 'text-red-400' : 'text-white'}`}>
                  {resources.deltaVAvailable} m/s / {resources.deltaVRequired} m/s
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-space-950/60 border border-slate-800/80">
                <span className="text-slate-400 flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-purple-400" />
                  SCIENCE YIELD SCORE
                </span>
                <span className="text-purple-300 font-bold telemetry-val">
                  +{resources.totalScience} Points
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-space-950/60 border border-slate-800/80">
                <span className="text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  OVERALL RELIABILITY
                </span>
                <span className="text-emerald-400 font-bold telemetry-val">
                  {resources.overallReliability}%
                </span>
              </div>
            </div>

            {/* Flight Readiness Checklist */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-space-900/80 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-[10px] text-nasa-cyan font-bold tracking-widest uppercase">
                  FLIGHT READINESS CHECKLIST
                </span>
                <span className="text-slate-400">
                  {readinessChecks.filter(c => c.passed).length} / {readinessChecks.length} CHECKS PASSED
                </span>
              </div>

              <div className="space-y-2.5">
                {readinessChecks.map((chk) => (
                  <div 
                    key={chk.id}
                    className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                      !chk.passed
                        ? 'bg-red-950/40 border-red-500/70 text-red-200'
                        : (chk.severity === 'warning'
                            ? 'bg-amber-950/30 border-amber-600/50 text-amber-200'
                            : 'bg-space-950/60 border-slate-800/80 text-slate-200')
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {!chk.passed ? (
                        <XCircle className="w-4 h-4 text-red-400" />
                      ) : chk.severity === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">
                          {chk.label}
                        </span>
                        <span className={`text-[10px] font-bold uppercase ${
                          !chk.passed ? 'text-red-400' : (chk.severity === 'warning' ? 'text-amber-400' : 'text-emerald-400')
                        }`}>
                          {!chk.passed ? 'FAILED' : (chk.severity === 'warning' ? 'CAUTION' : 'PASS')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                        {chk.message}
                      </p>
                      {chk.details && (
                        <p className="text-[10px] text-slate-400 mt-1 italic">
                          Guidance: {chk.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Launch Action Bar */}
      <div className="p-3 sm:p-4 sm:px-6 bg-black/60 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-30 backdrop-blur-2xl">
        <button
          onClick={() => {
            sounds.playClick();
            setStep('hangar');
          }}
          className="w-full sm:w-auto px-4 py-2.5 rounded-full border border-white/10 hover:bg-white/[0.08] bg-white/[0.04] text-slate-300 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer order-2 sm:order-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hangar</span>
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto justify-end order-1 sm:order-2">
          {/* If there's an issue, direct the player back to the Hangar where Nova gives hints */}
          {hasCriticalFailure && (
            <button
              onClick={() => {
                sounds.playAlert();
                setStep('hangar');
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-purple-500/15 border border-purple-400/30 hover:bg-purple-500/25 text-purple-200 text-xs font-medium transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              title="Return to Hangar to consult Commander Nova on fixing mass, power, or fuel"
            >
              <span>🧑‍🚀</span>
              <span>Resolve Issues in Hangar</span>
            </button>
          )}

          <button
            onClick={handleLaunch}
            disabled={hasCriticalFailure}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-full font-semibold text-xs tracking-tight transition-all flex items-center justify-center gap-2 shadow-md ${
              hasCriticalFailure
                ? 'bg-white/10 text-slate-500 cursor-not-allowed border border-white/10'
                : 'bg-[#0071e3] hover:bg-[#0077ed] text-white shadow-[#0071e3]/20 cursor-pointer active:scale-[0.98]'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Enter Flight Deck · Launch</span>
          </button>
        </div>
      </div>
    </div>
  );
};
