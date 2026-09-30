import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Weight, 
  DollarSign, 
  Zap, 
  Fuel, 
  Award, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Wand2,
  CheckCircle2
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { Tooltip } from '../common/Tooltip';
import { sounds } from '../../utils/soundEffects';

export const MissionHealthBar: React.FC = () => {
  const { resources, state, setStep, cadetMode, autoBalanceMission } = useMission();

  // Track previous values for delta animation
  const [prevMass, setPrevMass] = useState(resources.totalMass);
  const [prevCost, setPrevCost] = useState(resources.totalCost);
  const [prevPowerReq, setPrevPowerReq] = useState(resources.powerRequired);
  const [prevScience, setPrevScience] = useState(resources.totalScience);

  const [massDelta, setMassDelta] = useState<number | null>(null);
  const [costDelta, setCostDelta] = useState<number | null>(null);
  const [powerDelta, setPowerDelta] = useState<number | null>(null);
  const [scienceDelta, setScienceDelta] = useState<number | null>(null);

  useEffect(() => {
    if (resources.totalMass !== prevMass) {
      setMassDelta(resources.totalMass - prevMass);
      setPrevMass(resources.totalMass);
      const timer = setTimeout(() => setMassDelta(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [resources.totalMass, prevMass]);

  useEffect(() => {
    if (resources.totalCost !== prevCost) {
      setCostDelta(resources.totalCost - prevCost);
      setPrevCost(resources.totalCost);
      const timer = setTimeout(() => setCostDelta(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [resources.totalCost, prevCost]);

  useEffect(() => {
    if (resources.powerRequired !== prevPowerReq) {
      setPowerDelta(resources.powerRequired - prevPowerReq);
      setPrevPowerReq(resources.powerRequired);
      const timer = setTimeout(() => setPowerDelta(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [resources.powerRequired, prevPowerReq]);

  useEffect(() => {
    if (resources.totalScience !== prevScience) {
      setScienceDelta(resources.totalScience - prevScience);
      setPrevScience(resources.totalScience);
      const timer = setTimeout(() => setScienceDelta(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [resources.totalScience, prevScience]);

  if (state.currentStep === 'start' || state.currentStep === 'simulation' || state.currentStep === 'results' || state.currentStep === 'hangar') {
    return null;
  }

  const massPercent = Math.min(100, Math.round((resources.totalMass / resources.massLimit) * 100));
  const budgetPercent = Math.min(100, Math.round((resources.totalCost / resources.budgetLimit) * 100));

  const hasAnyDeficit = resources.isOverMass || resources.isOverBudget || resources.isPowerDeficit || resources.isDeltaVDeficit;

  return (
    <footer className="h-16 bg-space-950/95 border-t border-slate-800/90 px-4 flex items-center justify-between z-30 select-none backdrop-blur-md">
      {/* Title & Cadet Traffic Light Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
          <div className={`w-2.5 h-2.5 rounded-full ${hasAnyDeficit ? 'bg-red-500 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
          <span>{cadetMode ? '🚀 SHIP HEALTH' : 'MISSION HEALTH'}</span>
        </div>

        {/* Traffic Light State Badge */}
        {hasAnyDeficit ? (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500 text-red-300 font-mono text-[10px] font-bold">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span>{cadetMode ? 'NEEDS ATTENTION' : `RISK: ${resources.riskLevel}`}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500 text-emerald-300 font-mono text-[10px] font-bold">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>{cadetMode ? 'LOOKS GREAT! READY' : 'ALL SYSTEMS NOMINAL'}</span>
          </div>
        )}

        {/* Commander Nova hint indicator for children if something is wrong */}
        {hasAnyDeficit && (
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/30 text-purple-200 font-mono text-[10px] font-bold"
            title="Commander Nova has hints — check the Hangar for details!"
          >
            <span>🧑‍🚀</span>
            <span>NOVA HAS HINTS</span>
          </div>
        )}
      </div>

      {/* Metrics Row with friendly labels */}
      <div className="flex items-center gap-4 xl:gap-8 text-xs font-mono">
        {/* 1. MASS / WEIGHT */}
        <div className="flex items-center gap-2">
          <Weight className={`w-4 h-4 ${resources.isOverMass ? 'text-red-400 animate-bounce' : 'text-cyan-400'}`} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 uppercase">
                {cadetMode ? '⚖️ Weight' : 'Mass'}
              </span>
              <AnimatePresence>
                {massDelta !== null && (
                  <motion.span 
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`text-[10px] font-bold ${massDelta > 0 ? 'text-red-400' : 'text-emerald-400'}`}
                  >
                    {massDelta > 0 ? `+${massDelta}` : massDelta} kg
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-2">
              <span className={`telemetry-val text-xs font-bold ${resources.isOverMass ? 'text-red-400' : 'text-slate-200'}`}>
                {resources.totalMass.toLocaleString()} kg
              </span>
              <div className="w-14 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${resources.isOverMass ? 'bg-red-500' : 'bg-cyan-500'}`}
                  style={{ width: `${massPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. BUDGET / MONEY */}
        <div className="flex items-center gap-2">
          <DollarSign className={`w-4 h-4 ${resources.isOverBudget ? 'text-red-400' : 'text-emerald-400'}`} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 uppercase">
                {cadetMode ? '💰 Money' : 'Budget'}
              </span>
              <AnimatePresence>
                {costDelta !== null && (
                  <motion.span 
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`text-[10px] font-bold ${costDelta > 0 ? 'text-red-400' : 'text-emerald-400'}`}
                  >
                    {costDelta > 0 ? `+$${costDelta}M` : `-$${Math.abs(costDelta)}M`}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-2">
              <span className={`telemetry-val text-xs font-bold ${resources.isOverBudget ? 'text-red-400' : 'text-slate-200'}`}>
                ${resources.totalCost}M
              </span>
              <div className="w-14 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${resources.isOverBudget ? 'bg-red-500' : 'bg-emerald-500'}`}
                  style={{ width: `${budgetPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. POWER / ELECTRICITY */}
        <div className="flex items-center gap-2">
          <Zap className={`w-4 h-4 ${resources.isPowerDeficit ? 'text-red-400' : 'text-yellow-400'}`} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 uppercase">
                {cadetMode ? '⚡ Electricity' : 'Power'}
              </span>
              <AnimatePresence>
                {powerDelta !== null && (
                  <motion.span 
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] font-bold text-amber-400"
                  >
                    {powerDelta > 0 ? `+${powerDelta}W` : `${powerDelta}W`}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <span className={`telemetry-val text-xs font-bold ${
              resources.isPowerDeficit 
                ? 'text-red-400' 
                : (resources.powerReservePercent < 20 ? 'text-amber-400' : 'text-emerald-400')
            }`}>
              {resources.isPowerDeficit ? 'DEFICIT!' : `+${resources.powerReservePercent}% Safe`}
            </span>
          </div>
        </div>

        {/* 4. SCIENCE / DISCOVERIES */}
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-purple-400" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 uppercase">
                {cadetMode ? '🔬 Discoveries' : 'Science'}
              </span>
              <AnimatePresence>
                {scienceDelta !== null && (
                  <motion.span 
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`text-[10px] font-bold ${scienceDelta > 0 ? 'text-purple-400' : 'text-slate-400'}`}
                  >
                    {scienceDelta > 0 ? `+${scienceDelta}` : scienceDelta}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <span className="telemetry-val text-xs font-bold text-purple-300">
              +{resources.totalScience} pts
            </span>
          </div>
        </div>
      </div>

      {/* Right: Readiness Dial & Review Button */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">
            {cadetMode ? 'READY SCORE' : 'READINESS'}
          </div>
          <div className={`text-sm font-bold font-mono ${
            resources.readinessScore >= 85 ? 'text-emerald-400' : (resources.readinessScore >= 60 ? 'text-amber-400' : 'text-red-400')
          }`}>
            {resources.readinessScore}%
          </div>
        </div>

        {state.currentStep !== 'review' && (
          <button
            onClick={() => setStep('review')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium transition-colors"
          >
            <span>REVIEW</span>
            <ChevronRight className="w-3.5 h-3.5 text-nasa-cyan" />
          </button>
        )}
      </div>
    </footer>
  );
};
