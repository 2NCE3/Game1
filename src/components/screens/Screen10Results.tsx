import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Printer, 
  RotateCcw, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Radio, 
  Share2, 
  FileText,
  FileCheck2,
  Sparkles,
  Star,
  GraduationCap
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { 
  MISSION_BRIEFS, 
  DESTINATIONS, 
  SPACECRAFT_BUSES, 
  LAUNCH_VEHICLES, 
  POWER_SYSTEMS, 
  COMMS_SYSTEMS, 
  PROPULSION_SYSTEMS, 
  TRAJECTORY_OPTIONS, 
  PAYLOAD_INSTRUMENTS 
} from '../../data/missionsData';
import { sounds } from '../../utils/soundEffects';

export const Screen10Results: React.FC = () => {
  const { state, resources, resetMission, cadetMode } = useMission();
  const [showPrintModal, setShowPrintModal] = useState(false);

  const result = state.lastResult;
  const brief = MISSION_BRIEFS.find(b => b.id === state.briefId);
  const dest = DESTINATIONS.find(d => d.id === state.destinationId);
  const bus = SPACECRAFT_BUSES.find(b => b.id === state.busId);
  const rocket = LAUNCH_VEHICLES.find(r => r.id === state.launchVehicleId);
  const power = POWER_SYSTEMS.find(p => p.id === state.powerSystemId);
  const comms = COMMS_SYSTEMS.find(c => c.id === state.commsSystemId);
  const prop = PROPULSION_SYSTEMS.find(p => p.id === state.propulsionSystemId);
  const traj = TRAJECTORY_OPTIONS.find(t => t.id === state.trajectoryId);
  const payloads = PAYLOAD_INSTRUMENTS.filter(p => state.payloadIds.includes(p.id));

  // Trigger celebration confetti and triumph sound on success!
  useEffect(() => {
    if (result?.outcome === 'MISSION SUCCESS') {
      sounds.playSuccess();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } else {
      sounds.playSelect();
    }
  }, [result]);

  if (!result) return null;

  const isSuccess = result.outcome === 'MISSION SUCCESS';
  const isPartial = result.outcome === 'PARTIAL SUCCESS';
  const isFailure = result.outcome === 'MISSION FAILURE';

  // Calculate star rating for children (1 to 5 stars)
  const starCount = result.overallScore >= 90 ? 5 : (result.overallScore >= 75 ? 4 : (result.overallScore >= 55 ? 3 : 2));

  return (
    <div className="w-full h-full p-4 sm:p-6 overflow-y-auto flex flex-col justify-between max-w-7xl mx-auto">
      <div>
        {/* Child-Friendly Junior Astronaut Wings & Certificate Banner */}
        {cadetMode && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-6 rounded-3xl bg-gradient-to-r from-space-900 via-amber-950/30 to-space-900 border-2 border-amber-400/60 shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-200 text-black flex items-center justify-center text-3xl shadow-lg shadow-amber-400/30 shrink-0">
                  🎖️
                </div>
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                      NASA CADET FLIGHT ACADEMY
                    </span>
                    <span className="text-xs text-amber-300">★ CERTIFIED</span>
                  </div>
                  <h2 className="font-display font-black text-xl sm:text-2xl text-white tracking-wide">
                    JUNIOR ASTRONAUT WINGS AWARDED!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl font-sans">
                    Commander Nova certifies that you designed, launched, and guided <strong className="text-white">{state.missionName}</strong> across interplanetary space to <strong className="text-white">{dest?.name}</strong>!
                  </p>
                </div>
              </div>

              {/* Star Rating Badge */}
              <div className="bg-space-950/80 p-3.5 rounded-2xl border border-amber-400/40 text-center shrink-0">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                  CADET RATING
                </span>
                <div className="flex items-center gap-1 justify-center text-amber-400 text-lg">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < starCount ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs font-mono font-bold text-white mt-1 block">
                  {result.overallScore} / 100 POINTS
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Outcome Header Banner */}
        <div className={`p-6 rounded-3xl border mb-6 text-center relative overflow-hidden ${
          isSuccess 
            ? 'bg-emerald-950/40 border-emerald-500/80 shadow-2xl shadow-emerald-500/15' 
            : isPartial
              ? 'bg-amber-950/40 border-amber-500/80 shadow-2xl shadow-amber-500/15'
              : 'bg-red-950/40 border-red-500/80 shadow-2xl shadow-red-500/15'
        }`}>
          <div className="flex items-center justify-center gap-2.5 mb-2">
            {isSuccess ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            ) : isPartial ? (
              <AlertTriangle className="w-8 h-8 text-amber-400" />
            ) : (
              <XCircle className="w-8 h-8 text-red-400" />
            )}
            <h1 className={`font-display font-black text-2xl sm:text-4xl tracking-wider uppercase ${
              isSuccess ? 'text-emerald-400' : isPartial ? 'text-amber-400' : 'text-red-400'
            }`}>
              {result.outcome}
            </h1>
          </div>

          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed mb-4 font-sans">
            {result.summary}
          </p>

          <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-4 py-2 rounded-2xl bg-space-950/80 border border-slate-800 text-xs font-mono text-slate-300">
            <span>Overall Score: <strong className="text-white text-sm">{result.overallScore} / 100</strong></span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span>Science Data Returned: <strong className="text-purple-300 text-sm">{result.scienceDataPercent}%</strong></span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span>Destination: <strong className="text-cyan-300 text-sm">{dest?.name}</strong></span>
          </div>
        </div>

        {/* 5-Category Engineering Evaluation Scores */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-8">
          <div className="p-4 bg-space-900/80 border border-slate-800 rounded-2xl font-mono text-xs">
            <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1.5 mb-1">
              <Award className="w-3.5 h-3.5 text-purple-400" />
              SCIENTIFIC RETURN
            </span>
            <div className="text-xl font-bold text-white telemetry-val">
              {result.scientificReturnScore} <span className="text-xs text-slate-500">/ 100</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-purple-500" style={{ width: `${result.scientificReturnScore}%` }} />
            </div>
          </div>

          <div className="p-4 bg-space-900/80 border border-slate-800 rounded-2xl font-mono text-xs">
            <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ENGINEERING RELIABILITY
            </span>
            <div className="text-xl font-bold text-white telemetry-val">
              {result.engineeringReliabilityScore} <span className="text-xs text-slate-500">/ 100</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${result.engineeringReliabilityScore}%` }} />
            </div>
          </div>

          <div className="p-4 bg-space-900/80 border border-slate-800 rounded-2xl font-mono text-xs">
            <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1.5 mb-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              RESOURCE EFFICIENCY
            </span>
            <div className="text-xl font-bold text-white telemetry-val">
              {result.resourceEfficiencyScore} <span className="text-xs text-slate-500">/ 100</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-amber-500" style={{ width: `${result.resourceEfficiencyScore}%` }} />
            </div>
          </div>

          <div className="p-4 bg-space-900/80 border border-slate-800 rounded-2xl font-mono text-xs">
            <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1.5 mb-1">
              <Radio className="w-3.5 h-3.5 text-blue-400" />
              COMMUNICATIONS
            </span>
            <div className="text-xl font-bold text-white telemetry-val">
              {result.communicationScore} <span className="text-xs text-slate-500">/ 100</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${result.communicationScore}%` }} />
            </div>
          </div>

          <div className="p-4 bg-space-900/80 border border-slate-800 rounded-2xl font-mono text-xs">
            <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1.5 mb-1">
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              TRAJECTORY EFFICIENCY
            </span>
            <div className="text-xl font-bold text-white telemetry-val">
              {result.trajectoryEfficiencyScore} <span className="text-xs text-slate-500">/ 100</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-cyan-500" style={{ width: `${result.trajectoryEfficiencyScore}%` }} />
            </div>
          </div>
        </div>

        {/* Detailed Debrief: What Went Well & What Could Improve */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 font-mono text-xs">
          {/* What Went Well */}
          <div className="p-5 rounded-2xl bg-space-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider mb-3">
              <CheckCircle2 className="w-4 h-4" />
              <span>WHAT WENT WELL</span>
            </div>
            <ul className="space-y-2">
              {result.whatWentWell.length > 0 ? (
                result.whatWentWell.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-200">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span className="font-sans text-xs">{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-500 italic">No nominal systems survived degradation.</li>
              )}
            </ul>
          </div>

          {/* What Could Improve */}
          <div className="p-5 rounded-2xl bg-space-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider mb-3">
              <AlertTriangle className="w-4 h-4" />
              <span>WHAT COULD IMPROVE</span>
            </div>
            <ul className="space-y-2">
              {result.whatCouldImprove.length > 0 ? (
                result.whatCouldImprove.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-200">
                    <span className="text-amber-400 font-bold">⚠</span>
                    <span className="font-sans text-xs">{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-emerald-400">Flawless design. Minimal trade-off penalties detected!</li>
              )}
            </ul>
          </div>
        </div>

        {/* Critical Decision & Engineering Lesson */}
        <div className="p-5 rounded-2xl bg-nasa-orange/10 border border-nasa-orange/40 mb-8">
          <div className="flex items-center gap-2 text-nasa-orange font-mono font-bold text-xs uppercase tracking-wider mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span>CRITICAL ENGINEERING DECISION ANALYSIS</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
            {result.criticalDecisionNote}
          </p>
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
        <button
          onClick={() => {
            sounds.playClick();
            setShowPrintModal(true);
          }}
          className="px-5 py-3 rounded-xl bg-space-900 hover:bg-space-850 border border-slate-700 text-slate-200 font-semibold transition-all flex items-center gap-2 shadow-md"
        >
          <Printer className="w-4 h-4 text-nasa-cyan" />
          <span>VIEW / PRINT NASA CERTIFICATE</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            resetMission();
          }}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-nasa-orange to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold tracking-wider uppercase transition-all shadow-xl shadow-nasa-orange/25 flex items-center gap-2 cursor-pointer hover:scale-102"
        >
          <RotateCcw className="w-4 h-4" />
          <span>DESIGN ANOTHER MISSION 🚀</span>
        </button>
      </div>

      {/* Official Printable Mission Certificate Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-amber-500/60 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-slate-900 font-sans print:bg-white print:text-black print:p-0">
            {/* NASA Cadet Certificate Header */}
            <div className="border-b-2 border-amber-500/40 pb-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎖️</span>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold font-mono text-white tracking-widest uppercase">
                    NATIONAL AERONAUTICS AND SPACE ADMINISTRATION
                  </h2>
                  <div className="text-xs font-mono text-amber-400">
                    JUNIOR ASTRONAUT CADET FLIGHT CERTIFICATE
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs print:hidden"
              >
                CLOSE
              </button>
            </div>

            {/* Document Data */}
            <div className="space-y-4 text-xs font-mono text-slate-300 leading-relaxed mb-6">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                <div><strong>MISSION DESIGNATION:</strong> {state.missionName}</div>
                <div><strong>FLIGHT OUTCOME:</strong> <span className={isSuccess ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{result.outcome}</span></div>
                <div><strong>OBJECTIVE:</strong> {brief?.title}</div>
                <div><strong>DESTINATION:</strong> {dest?.name} ({dest?.distance})</div>
                <div><strong>SPACECRAFT BUS:</strong> {bus?.name} ({bus?.mass} kg)</div>
                <div><strong>LAUNCH VEHICLE:</strong> {rocket?.name}</div>
                <div><strong>POWER SYSTEM:</strong> {power?.name} ({resources.powerGenerated}W generated)</div>
                <div><strong>COMMUNICATION:</strong> {comms?.name} ({comms?.dataRateMbps} Mbps)</div>
                <div><strong>PROPULSION:</strong> {prop?.name} ({resources.deltaVAvailable} m/s Δv)</div>
                <div><strong>TRAJECTORY:</strong> {traj?.name}</div>
                <div><strong>TOTAL MASS:</strong> {resources.totalMass.toLocaleString()} kg / {resources.massLimit.toLocaleString()} kg</div>
                <div><strong>TOTAL BUDGET:</strong> ${resources.totalCost}M / ${resources.budgetLimit}M</div>
                <div><strong>OVERALL SCORE:</strong> {result.overallScore} / 100 ({starCount} Stars ⭐)</div>
                <div><strong>SCIENCE RETURN:</strong> {result.scienceDataPercent}% of goals</div>
              </div>

              <div>
                <strong className="text-white block mb-1">SCIENTIFIC INSTRUMENTATION PACKAGE:</strong>
                <p>{payloads.map(p => `${p.name} (+${p.scienceValue} pts)`).join(', ')}</p>
              </div>

              <div>
                <strong className="text-white block mb-1">COMMANDER EVALUATION SUMMARY:</strong>
                <p className="font-sans text-xs text-slate-200">{result.summary}</p>
              </div>

              <div>
                <strong className="text-white block mb-1">AEROSPACE ENGINEERING LESSON:</strong>
                <p className="font-sans text-xs text-slate-200">{result.criticalDecisionNote}</p>
              </div>
            </div>

            {/* Print trigger */}
            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3 print:hidden">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-nasa-cyan hover:bg-cyan-400 text-black font-mono font-bold text-xs flex items-center gap-2 shadow-lg"
              >
                <Printer className="w-4 h-4" />
                <span>PRINT DIPLOMA / PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
