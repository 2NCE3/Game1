import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMission } from '../../context/MissionContext';
import { sounds } from '../../utils/soundEffects';

interface NovaHint {
  id: string;
  icon: string;
  message: string;
  severity: 'tip' | 'warning' | 'critical';
}

export const CommanderNova: React.FC = () => {
  const { resources, state, cadetMode } = useMission();
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [currentHintIdx, setCurrentHintIdx] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Generate contextual hints based on current ship state
  const hints: NovaHint[] = useMemo(() => {
    const h: NovaHint[] = [];

    // Critical issues first
    if (resources.isOverMass) {
      h.push({
        id: 'mass-over',
        icon: '⚖️',
        message: cadetMode
          ? `Oops! Your ship is too heavy (${resources.totalMass.toLocaleString()} kg). Try removing a tool, or pick a bigger rocket!`
          : `Mass exceeds launcher capacity by ${(resources.totalMass - resources.massLimit).toLocaleString()} kg. Remove instruments or upgrade the launch vehicle.`,
        severity: 'critical',
      });
    }

    if (resources.isOverBudget) {
      h.push({
        id: 'budget-over',
        icon: '💰',
        message: cadetMode
          ? `Whoa, we spent too much money ($${resources.totalCost}M)! Switch to cheaper parts or remove something fancy.`
          : `Budget overrun: $${resources.totalCost}M exceeds the $${resources.budgetLimit}M cap. Downgrade subsystems or reduce payload count.`,
        severity: 'critical',
      });
    }

    if (resources.isPowerDeficit) {
      h.push({
        id: 'power-deficit',
        icon: '⚡',
        message: cadetMode
          ? `Not enough electricity! Your ship needs ${resources.powerRequired}W but only makes ${resources.powerGenerated}W. Add bigger solar panels!`
          : `Power deficit: drawing ${resources.powerRequired}W but generating only ${resources.powerGenerated}W. Upgrade to a larger array or RTG.`,
        severity: 'critical',
      });
    }

    if (resources.isDeltaVDeficit) {
      h.push({
        id: 'deltav-deficit',
        icon: '🚀',
        message: cadetMode
          ? `Your engine isn't powerful enough to reach the destination! Try a stronger engine or a slower, fuel-saving path.`
          : `Propulsion delivers ${resources.deltaVAvailable} m/s but trajectory requires ${resources.deltaVRequired} m/s. Upgrade propulsion or select an Efficient Transfer.`,
        severity: 'critical',
      });
    }

    // Warnings
    if (!resources.isPowerDeficit && resources.powerReservePercent < 20 && resources.powerReservePercent >= 0) {
      h.push({
        id: 'power-low',
        icon: '🔋',
        message: cadetMode
          ? `Power is a bit tight — only ${resources.powerReservePercent}% extra. Bigger solar panels would be safer!`
          : `Power reserve is only ${resources.powerReservePercent}%. Recommend ≥25% margin for eclipse operations.`,
        severity: 'warning',
      });
    }

    if (state.payloadIds.length === 0) {
      h.push({
        id: 'no-payload',
        icon: '🔭',
        message: cadetMode
          ? `Don't forget to add science tools! Without them, your mission can't make any discoveries.`
          : `No scientific instruments selected. Add at least one to generate science return.`,
        severity: 'warning',
      });
    }

    // Tips
    if (h.length === 0 && resources.readinessScore >= 85) {
      h.push({
        id: 'all-good',
        icon: '✅',
        message: cadetMode
          ? `Amazing work, Cadet! Your ship looks great — score is ${resources.readinessScore}%! Ready for launch!`
          : `All systems nominal. Readiness score: ${resources.readinessScore}%. Ship is launch-ready.`,
        severity: 'tip',
      });
    }

    return h.filter((hint) => !dismissed.includes(hint.id));
  }, [resources, state, cadetMode, dismissed]);

  // Cycle through hints
  useEffect(() => {
    if (hints.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentHintIdx((prev) => (prev + 1) % hints.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [hints.length]);

  const currentHint = hints[currentHintIdx % Math.max(1, hints.length)] || null;

  if (!currentHint) return null;

  const severityStyles = {
    tip: 'border-emerald-500/40 bg-emerald-950/30',
    warning: 'border-amber-500/40 bg-amber-950/30',
    critical: 'border-red-500/50 bg-red-950/40',
  };

  const severityGlow = {
    tip: 'shadow-emerald-500/10',
    warning: 'shadow-amber-500/15',
    critical: 'shadow-red-500/20 animate-pulse',
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentHint.id}
        initial={{ opacity: 0, x: 20, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`rounded-xl border p-3 shadow-lg cursor-pointer select-none ${severityStyles[currentHint.severity]} ${severityGlow[currentHint.severity]}`}
        onClick={() => {
          sounds.playClick();
          setIsExpanded(!isExpanded);
        }}
      >
        <div className="flex items-start gap-3">
          {/* Nova Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg shrink-0 shadow-md shadow-purple-500/30 ring-2 ring-purple-400/30">
            🧑‍🚀
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-mono font-bold text-purple-300 uppercase tracking-wider">
                Commander Nova
              </span>
              {hints.length > 1 && (
                <span className="text-[9px] font-mono text-slate-500">
                  {(currentHintIdx % hints.length) + 1}/{hints.length}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              <span className="mr-1">{currentHint.icon}</span>
              {currentHint.message}
            </p>
          </div>

          {/* Dismiss */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              sounds.playClick();
              setDismissed((prev) => [...prev, currentHint.id]);
            }}
            className="text-slate-500 hover:text-slate-300 text-xs transition-colors shrink-0 mt-0.5"
            title="Dismiss hint"
          >
            ✕
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
