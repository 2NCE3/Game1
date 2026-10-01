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
import { NasaPrintableCertificate } from '../common/NasaPrintableCertificate';

export const Screen10Results: React.FC = () => {
  const { state, resources, resetMission, cadetMode } = useMission();
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printMode, setPrintMode] = useState<'certificate' | 'report'>('certificate');

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
                    <span className="px-3 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-medium">
                      NASA Cadet Flight Academy
                    </span>
                    <span className="text-xs text-amber-300 font-medium">★ Certified</span>
                  </div>
                  <h2 className="font-bold text-xl sm:text-2xl text-white tracking-tight">
                    Junior Astronaut Wings Awarded!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl font-normal leading-relaxed">
                    Commander Nova certifies that you designed, launched, and guided <strong className="text-white font-semibold">{state.missionName}</strong> across interplanetary space to <strong className="text-white font-semibold">{dest?.name}</strong>!
                  </p>
                </div>
              </div>

              {/* Star Rating Badge */}
              <div className="bg-black/40 backdrop-blur-xl p-3.5 rounded-2xl border border-white/10 text-center shrink-0">
                <span className="text-[10px] text-[#86868b] uppercase tracking-wider block mb-1 font-medium">
                  Cadet Rating
                </span>
                <div className="flex items-center gap-1 justify-center text-amber-400 text-lg">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < starCount ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-white mt-1 block telemetry-val">
                  {result.overallScore} / 100 Points
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Outcome Header Banner (Apple Frosted Glass) */}
        <div className={`p-6 rounded-3xl border mb-6 text-center relative overflow-hidden backdrop-blur-xl ${
          isSuccess 
            ? 'bg-emerald-500/10 border-emerald-500/30 shadow-xl shadow-emerald-500/10' 
            : isPartial
              ? 'bg-amber-500/10 border-amber-500/30 shadow-xl shadow-amber-500/10'
              : 'bg-rose-500/10 border-rose-500/30 shadow-xl shadow-rose-500/10'
        }`}>
          <div className="flex items-center justify-center gap-2.5 mb-2">
            {isSuccess ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            ) : isPartial ? (
              <AlertTriangle className="w-7 h-7 text-amber-400" />
            ) : (
              <XCircle className="w-7 h-7 text-rose-400" />
            )}
            <h1 className={`font-bold text-2xl sm:text-3xl tracking-tight uppercase ${
              isSuccess ? 'text-emerald-400' : isPartial ? 'text-amber-400' : 'text-rose-400'
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
        <div className="p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 mb-8">
          <div className="flex items-center gap-2 text-sky-400 font-medium text-xs tracking-tight mb-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span className="font-semibold uppercase text-[11px] tracking-wider text-sky-300">Engineering Insight</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {result.criticalDecisionNote}
          </p>
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-sans">
        {/* Distinct PDF Action Buttons: Astronaut Certificate vs Technical Mission Report */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Certificate Download Button */}
          <button
            onClick={() => {
              sounds.playClick();
              setPrintMode('certificate');
              setShowPrintModal(true);
            }}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-200 font-medium transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer hover:border-amber-400 active:scale-[0.98]"
            title="Download Junior Astronaut Wings Official Parchment Certificate"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Astronaut Certificate (PDF)</span>
          </button>

          {/* Mission Report Download Button */}
          <button
            onClick={() => {
              sounds.playClick();
              setPrintMode('report');
              setShowPrintModal(true);
            }}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-sky-500/30 text-sky-200 font-medium transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer hover:border-sky-400 active:scale-[0.98]"
            title="Download Technical NASA Flight Telemetry & Systems Report"
          >
            <FileText className="w-4 h-4 text-sky-400" />
            <span>Mission Report (PDF)</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => {
              sounds.playClick();
              resetMission('start');
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 font-medium transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <span>Home Menu</span>
          </button>

          <button
            onClick={() => {
              sounds.playSuccess();
              resetMission('brief');
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold transition-all shadow-md shadow-[#0071e3]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Select Another Project</span>
          </button>
        </div>
      </div>

      {/* Official Printable Mission Certificate Modal */}
      {showPrintModal && (
        <NasaPrintableCertificate
          state={state}
          resources={resources}
          result={result}
          brief={brief}
          dest={dest}
          bus={bus}
          rocket={rocket}
          power={power}
          comms={comms}
          prop={prop}
          traj={traj}
          payloads={payloads}
          starCount={starCount}
          initialMode={printMode}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
};
