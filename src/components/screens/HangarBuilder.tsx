import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Zap,
  Radio,
  Flame,
  Thermometer,
  Telescope,
  Rocket,
  Route,
  ChevronRight,
  ChevronLeft,
  Check,
  Star,
  Lock,
  Unlock,
  Sparkles,
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { SpaceCanvas } from '../3d/SpaceCanvas';
import { SpacecraftViewer } from '../3d/SpacecraftViewer';
import { CommanderNova } from '../common/CommanderNova';
import { CadetGuideBanner } from '../common/CadetGuideBanner';
import { sounds } from '../../utils/soundEffects';
import {
  SPACECRAFT_BUSES,
  PAYLOAD_INSTRUMENTS,
  LAUNCH_VEHICLES,
  POWER_SYSTEMS,
  COMMS_SYSTEMS,
  PROPULSION_SYSTEMS,
  THERMAL_SYSTEMS,
  TRAJECTORY_OPTIONS,
  DESTINATIONS,
} from '../../data/missionsData';
import type {
  SpacecraftBus,
  PayloadInstrument,
  LaunchVehicle,
  PowerSystem,
  CommsSystem,
  PropulsionSystem,
  ThermalSystem,
  TrajectoryOption,
} from '../../types/mission';

// ─── Category Tabs ───────────────────────────────────────────────
type HangarCategory = 'chassis' | 'tools' | 'rocket' | 'power' | 'comms' | 'engine' | 'thermal' | 'trajectory';

interface CategoryTab {
  id: HangarCategory;
  stepNum: number;
  emoji: string;
  label: string;
  icon: React.ReactNode;
  cadetLabel: string;
  description: string;
  cadetDescription: string;
  kidQuestion: string;
  kidTip: string;
}

const CATEGORIES: CategoryTab[] = [
  {
    id: 'chassis',
    stepNum: 1,
    emoji: '[01]',
    label: 'CHASSIS',
    icon: <Cpu className="w-4 h-4" />,
    cadetLabel: 'Body',
    description: 'NASA Cleanroom: Structural Bus Assembly',
    cadetDescription: 'Fabricate spacecraft bus on integration jig',
    kidQuestion: 'Step 1: Spacecraft Chassis Assembly (NASA Cleanroom Lab)',
    kidTip: 'The chassis is mounted on the pneumatic assembly turntable. Automated robotic arms are fabricating the primary frame.',
  },
  {
    id: 'tools',
    stepNum: 2,
    emoji: '[02]',
    label: 'PAYLOAD',
    icon: <Telescope className="w-4 h-4" />,
    cadetLabel: 'Science Tools',
    description: 'Scientific instruments and sensors',
    cadetDescription: 'Add cameras and scanners',
    kidQuestion: 'Step 2: What scientific sensors will gather data?',
    kidTip: 'Select cameras for optical imaging and spectrometers for volatile detection.',
  },
  {
    id: 'rocket',
    stepNum: 3,
    emoji: '[03]',
    label: 'LAUNCHER',
    icon: <Rocket className="w-4 h-4" />,
    cadetLabel: 'Rocket',
    description: 'Launch vehicle booster selection',
    cadetDescription: 'Choose launch rocket',
    kidQuestion: 'Step 3: Which vehicle can lift spacecraft wet mass?',
    kidTip: 'Launcher payload capacity must exceed total spacecraft wet mass.',
  },
  {
    id: 'power',
    stepNum: 4,
    emoji: '[04]',
    label: 'POWER',
    icon: <Zap className="w-4 h-4" />,
    cadetLabel: 'Power',
    description: 'Power generation system',
    cadetDescription: 'Solar arrays or RTG',
    kidQuestion: 'Step 4: How will the probe generate electrical power?',
    kidTip: 'Solar arrays operate efficiently up to Mars orbit. Deep space requires nuclear RTG.',
  },
  {
    id: 'comms',
    stepNum: 5,
    emoji: '[05]',
    label: 'COMMS',
    icon: <Radio className="w-4 h-4" />,
    cadetLabel: 'Antenna',
    description: 'Communications antenna',
    cadetDescription: 'Radio or optical relay',
    kidQuestion: 'Step 5: How will telemetry transmit back to mission control?',
    kidTip: 'High-gain Cassegrain parabolic dish transmits telemetry across astronomical distances.',
  },
  {
    id: 'engine',
    stepNum: 6,
    emoji: '[06]',
    label: 'ENGINE',
    icon: <Flame className="w-4 h-4" />,
    cadetLabel: 'Engine',
    description: 'Interplanetary propulsion system',
    cadetDescription: 'Main thrusters',
    kidQuestion: 'Step 6: Which thruster provides necessary delta-v budget?',
    kidTip: 'Hybrid thrusters offer balanced acceleration and high vacuum specific impulse.',
  },
  {
    id: 'thermal',
    stepNum: 7,
    emoji: '[07]',
    label: 'THERMAL',
    icon: <Thermometer className="w-4 h-4" />,
    cadetLabel: 'Thermal',
    description: 'Thermal control system',
    cadetDescription: 'Heat loops and radiators',
    kidQuestion: 'Step 7: How are avionics shielded from thermal extremes?',
    kidTip: 'Deep space cycles between -150C in shadow and +120C in direct sunlight.',
  },
  {
    id: 'trajectory',
    stepNum: 8,
    emoji: '[08]',
    label: 'FLIGHT PATH',
    icon: <Route className="w-4 h-4" />,
    cadetLabel: 'Flight Path',
    description: 'Trajectory transfer orbit',
    cadetDescription: 'Orbital velocity corridor',
    kidQuestion: 'Step 8: Which flight path should our mission follow?',
    kidTip: 'A Balanced Transfer optimizes propellant use and transit time.',
  },
];

// ─── Resource Gauge Bar ──────────────────────────────────────────
const ResourceGauge: React.FC<{
  label: string;
  cadetLabel: string;
  value: number;
  max: number;
  unit: string;
  isOver: boolean;
  isCadet: boolean;
  color: string;
  overColor?: string;
  icon: string;
}> = ({ label, cadetLabel, value, max, unit, isOver, isCadet, color, overColor = 'bg-red-500', icon }) => {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const displayLabel = isCadet ? cadetLabel : label;

  return (
    <div className="flex-1 min-w-[100px]">
      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
        <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <span>{icon}</span>
          {displayLabel}
        </span>
        <span className={`font-bold ${isOver ? 'text-red-400' : 'text-slate-200'}`}>
          {value.toLocaleString()}{unit}
        </span>
      </div>
      <div className="h-2.5 bg-slate-800/80 rounded-full overflow-hidden relative">
        <motion.div
          className={`h-full rounded-full ${isOver ? overColor : color}`}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        />
        {/* Max marker line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-slate-500/60"
          style={{ left: '100%' }}
        />
      </div>
      <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-0.5">
        <span>0</span>
        <span className={isOver ? 'text-red-400 font-bold' : ''}>
          {isOver ? `OVER by ${(value - max).toLocaleString()}${unit}` : `${max.toLocaleString()}${unit} max`}
        </span>
      </div>
    </div>
  );
};

// ─── Part Card Component ─────────────────────────────────────────
const PartCard: React.FC<{
  name: string;
  description: string;
  isSelected: boolean;
  isToggle?: boolean;
  isRecommended?: boolean;
  isCadet: boolean;
  stats: { label: string; value: string; color?: string }[];
  onClick: () => void;
}> = ({ name, description, isSelected, isToggle, isRecommended, isCadet, stats, onClick }) => (
  <motion.div
    layout
    whileHover={{ scale: 1.015, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => {
      sounds.playSelect();
      onClick();
    }}
    className={`relative p-4 rounded-2xl border cursor-pointer transition-all duration-200 backdrop-blur-xl ${
      isSelected
        ? 'bg-blue-500/10 border-[#0071e3] shadow-lg shadow-blue-500/15 ring-2 ring-[#0071e3]/40'
        : 'bg-white/[0.04] border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
    }`}
  >
    {isRecommended && isCadet && (
      <div className="absolute -top-2 right-3 px-2.5 py-0.5 rounded-full bg-blue-500 text-white font-medium text-[9px] shadow-sm flex items-center gap-1 z-10">
        <Star className="w-2.5 h-2.5 fill-white" />
        <span>Recommended</span>
      </div>
    )}

    <div className="flex items-start justify-between mb-2">
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-white leading-tight truncate">
          {name}
        </h4>
        <p className="text-xs text-[#86868b] mt-0.5 line-clamp-2 leading-relaxed font-normal">
          {description}
        </p>
      </div>
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ml-2 ${
            isToggle ? 'bg-emerald-500' : 'bg-[#0071e3]'
          } text-white shadow-sm`}
        >
          <Check className="w-3 h-3 stroke-[3]" />
        </motion.div>
      )}
    </div>

    {/* Stats grid */}
    <div className={`grid grid-cols-${Math.min(stats.length, 4)} gap-2 pt-2.5 mt-2 border-t border-white/10 text-xs`}>
      {stats.map((stat) => (
        <div key={stat.label}>
          <span className="text-[10px] text-[#86868b] uppercase tracking-wider block font-medium">{stat.label}</span>
          <span className={`font-semibold telemetry-val ${stat.color || 'text-cyan-400'}`}>{stat.value}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

// ─── MAIN HANGAR BUILDER COMPONENT ──────────────────────────────
export const HangarBuilder: React.FC = () => {
  const {
    state,
    resources,
    cadetMode,
    selectBus,
    togglePayload,
    selectLaunchVehicle,
    selectPowerSystem,
    selectCommsSystem,
    selectPropulsionSystem,
    selectThermalSystem,
    selectTrajectory,
    setStep,
    goToPrevStep,
    startSimulation,
    launchToPad,
    resetMission,
  } = useMission();

  const [autoLaunchCountdown, setAutoLaunchCountdown] = useState<number | null>(null);
  const [mobileView, setMobileView] = useState<'parts' | '3d'>('3d');

  const handleDirectLaunch = useCallback(() => {
    sounds.playLaunch();
    launchToPad();
  }, [launchToPad]);

  const [activeCategory, setActiveCategory] = useState<HangarCategory>('chassis');

  // Current selections for 3D viewer (only populated if selected or in demo mode)
  const currentBus = SPACECRAFT_BUSES.find((b) => b.id === state.busId) || null;
  const currentPower = POWER_SYSTEMS.find((p) => p.id === state.powerSystemId) || null;
  const currentComms = COMMS_SYSTEMS.find((c) => c.id === state.commsSystemId) || null;
  const currentProp = PROPULSION_SYSTEMS.find((p) => p.id === state.propulsionSystemId) || null;
  const currentPayloads = PAYLOAD_INSTRUMENTS.filter((p) => state.payloadIds.includes(p.id));
  const currentDestination = DESTINATIONS.find((d) => d.id === state.destinationId);

  // Completion tracking per category
  const completionMap = useMemo(
    () => ({
      chassis: !!state.busId,
      tools: state.payloadIds.length > 0,
      rocket: !!state.launchVehicleId,
      power: !!state.powerSystemId,
      comms: !!state.commsSystemId,
      engine: !!state.propulsionSystemId,
      thermal: !!state.thermalSystemId,
      trajectory: !!state.trajectoryId,
    }),
    [state],
  );

  const completedCount = Object.values(completionMap).filter(Boolean).length;
  const allComplete = completedCount === 8;

  // Navigate to next incomplete category
  const goToNextCategory = useCallback(() => {
    const currentIdx = CATEGORIES.findIndex((c) => c.id === activeCategory);
    for (let i = 1; i <= CATEGORIES.length; i++) {
      const nextIdx = (currentIdx + i) % CATEGORIES.length;
      const nextCat = CATEGORIES[nextIdx];
      if (!completionMap[nextCat.id]) {
        setActiveCategory(nextCat.id);
        return;
      }
    }
    // If all complete, just go next
    if (currentIdx < CATEGORIES.length - 1) {
      setActiveCategory(CATEGORIES[currentIdx + 1].id);
    }
  }, [activeCategory, completionMap]);

  // Navigate to previous category
  const goToPrevCategory = useCallback(() => {
    const currentIdx = CATEGORIES.findIndex((c) => c.id === activeCategory);
    if (currentIdx > 0) {
      setActiveCategory(CATEGORIES[currentIdx - 1].id);
    }
  }, [activeCategory]);

  // ─── Render Part List by Category ────────────────────────────
  const renderParts = () => {
    switch (activeCategory) {
      case 'chassis':
        return SPACECRAFT_BUSES.map((bus) => (
          <PartCard
            key={bus.id}
            name={bus.name}
            description={bus.description}
            isSelected={state.busId === bus.id}
            isRecommended={bus.id === 'bus-standard'}
            isCadet={cadetMode}
            stats={[
              { label: cadetMode ? '⚖️ Weight' : 'Mass', value: `${bus.mass}kg`, color: 'text-cyan-400' },
              { label: cadetMode ? '💰 Cost' : 'Cost', value: `$${bus.cost}M`, color: 'text-emerald-400' },
              { label: cadetMode ? '⚡ Drain' : 'Power', value: `${bus.basePowerReq}W`, color: 'text-amber-400' },
              { label: cadetMode ? '🛡️ Safe' : 'Reliability', value: `${bus.reliability}%`, color: 'text-purple-400' },
            ]}
            onClick={() => selectBus(bus.id)}
          />
        ));

      case 'tools':
        return PAYLOAD_INSTRUMENTS.map((inst) => {
          const isMatch = currentDestination && inst.primaryTargetIds.includes(currentDestination.id);
          return (
            <PartCard
              key={inst.id}
              name={inst.name}
              description={inst.description}
              isSelected={state.payloadIds.includes(inst.id)}
              isToggle
              isRecommended={isMatch || false}
              isCadet={cadetMode}
              stats={[
                { label: cadetMode ? '⚖️ Wt' : 'Mass', value: `${inst.mass}kg`, color: 'text-cyan-400' },
                { label: cadetMode ? '💰' : 'Cost', value: `$${inst.cost}M`, color: 'text-emerald-400' },
                { label: cadetMode ? '⚡' : 'Power', value: `${inst.power}W`, color: 'text-amber-400' },
                { label: cadetMode ? '🔬' : 'Science', value: `+${inst.scienceValue}`, color: 'text-purple-400' },
              ]}
              onClick={() => togglePayload(inst.id)}
            />
          );
        });

      case 'rocket':
        return LAUNCH_VEHICLES.map((lv) => {
          const canLift = lv.payloadCapacity >= resources.totalMass;
          return (
            <PartCard
              key={lv.id}
              name={lv.name}
              description={lv.description}
              isSelected={state.launchVehicleId === lv.id}
              isRecommended={lv.id === 'launch-medium'}
              isCadet={cadetMode}
              stats={[
                {
                  label: cadetMode ? '📦 Lifts' : 'Capacity',
                  value: `${lv.payloadCapacity.toLocaleString()}kg`,
                  color: canLift ? 'text-emerald-400' : 'text-red-400',
                },
                { label: cadetMode ? '💰' : 'Cost', value: `$${lv.launchCost}M`, color: 'text-emerald-400' },
                { label: cadetMode ? '🔥' : 'Thrust', value: `${lv.thrustKn}kN`, color: 'text-amber-400' },
                { label: cadetMode ? '📏' : 'Height', value: `${lv.heightM}m`, color: 'text-cyan-400' },
              ]}
              onClick={() => selectLaunchVehicle(lv.id)}
            />
          );
        });

      case 'power':
        return POWER_SYSTEMS.map((pw) => (
          <PartCard
            key={pw.id}
            name={pw.name}
            description={pw.description}
            isSelected={state.powerSystemId === pw.id}
            isRecommended={pw.id === 'power-medium'}
            isCadet={cadetMode}
            stats={[
              { label: cadetMode ? '⚡ Makes' : 'Output', value: `${pw.generatedWatts}W`, color: 'text-yellow-400' },
              { label: cadetMode ? '⚖️' : 'Mass', value: `${pw.mass}kg`, color: 'text-cyan-400' },
              { label: cadetMode ? '💰' : 'Cost', value: `$${pw.cost}M`, color: 'text-emerald-400' },
              { label: cadetMode ? '🛡️' : 'Rel', value: `${pw.reliability}%`, color: 'text-purple-400' },
            ]}
            onClick={() => selectPowerSystem(pw.id)}
          />
        ));

      case 'comms':
        return COMMS_SYSTEMS.map((cm) => (
          <PartCard
            key={cm.id}
            name={cm.name}
            description={cm.description}
            isSelected={state.commsSystemId === cm.id}
            isRecommended={cm.id === 'comms-high'}
            isCadet={cadetMode}
            stats={[
              { label: cadetMode ? '📡 Speed' : 'Rate', value: `${cm.dataRateMbps}Mbps`, color: 'text-cyan-400' },
              { label: cadetMode ? '⚖️' : 'Mass', value: `${cm.mass}kg`, color: 'text-cyan-400' },
              { label: cadetMode ? '💰' : 'Cost', value: `$${cm.cost}M`, color: 'text-emerald-400' },
              { label: cadetMode ? '📶' : 'Signal', value: `${cm.signalReliability}%`, color: 'text-purple-400' },
            ]}
            onClick={() => selectCommsSystem(cm.id)}
          />
        ));

      case 'engine':
        return PROPULSION_SYSTEMS.map((pr) => {
          const canReach = pr.deltaV >= resources.deltaVRequired;
          return (
            <PartCard
              key={pr.id}
              name={pr.name}
              description={pr.description}
              isSelected={state.propulsionSystemId === pr.id}
              isRecommended={pr.id === 'prop-hybrid'}
              isCadet={cadetMode}
              stats={[
                {
                  label: cadetMode ? '🚀 Power' : 'Δv',
                  value: `${pr.deltaV}m/s`,
                  color: canReach ? 'text-emerald-400' : 'text-red-400',
                },
                { label: cadetMode ? '⛽ Fuel' : 'Fuel', value: `${pr.fuelMass}kg`, color: 'text-amber-400' },
                { label: cadetMode ? '💰' : 'Cost', value: `$${pr.cost}M`, color: 'text-emerald-400' },
                { label: cadetMode ? '⚡' : 'ISP', value: `${pr.isp}s`, color: 'text-cyan-400' },
              ]}
              onClick={() => selectPropulsionSystem(pr.id)}
            />
          );
        });

      case 'thermal':
        return THERMAL_SYSTEMS.map((th) => (
          <PartCard
            key={th.id}
            name={th.name}
            description={th.description}
            isSelected={state.thermalSystemId === th.id}
            isRecommended={th.id === 'therm-pipes'}
            isCadet={cadetMode}
            stats={[
              { label: cadetMode ? '⚖️' : 'Mass', value: `${th.mass}kg`, color: 'text-cyan-400' },
              { label: cadetMode ? '💰' : 'Cost', value: `$${th.cost}M`, color: 'text-emerald-400' },
              { label: cadetMode ? '🛡️' : 'Rel', value: `${th.reliability}%`, color: 'text-purple-400' },
            ]}
            onClick={() => selectThermalSystem(th.id)}
          />
        ));

      case 'trajectory':
        return TRAJECTORY_OPTIONS.map((tr) => (
          <PartCard
            key={tr.id}
            name={tr.name}
            description={tr.description}
            isSelected={state.trajectoryId === tr.id}
            isRecommended={tr.id === 'traj-balanced'}
            isCadet={cadetMode}
            stats={[
              {
                label: cadetMode ? '🚀 Needs' : 'Δv Req',
                value: `${tr.deltaVRequired}m/s`,
                color: 'text-cyan-400',
              },
              {
                label: cadetMode ? '⛽ Fuel' : 'Fuel×',
                value: `×${tr.fuelModifier}`,
                color: tr.fuelModifier > 1 ? 'text-red-400' : 'text-emerald-400',
              },
              {
                label: cadetMode ? '⚠️ Risk' : 'Risk',
                value: tr.riskModifier,
                color:
                  tr.riskModifier === 'HIGH'
                    ? 'text-red-400'
                    : tr.riskModifier === 'LOW'
                    ? 'text-emerald-400'
                    : 'text-amber-400',
              },
            ]}
            onClick={() => selectTrajectory(tr.id)}
          />
        ));

      default:
        return null;
    }
  };

  const activeCategoryData = CATEGORIES.find((c) => c.id === activeCategory)!;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-[#06070a]">
      {/* Top Game HUD Header (Apple Frosted Glass) */}
      <div className="h-14 bg-black/60 border-b border-white/10 px-3 sm:px-6 flex items-center justify-between z-20 backdrop-blur-2xl">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              setStep('destination');
            }}
            className="px-2.5 sm:px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/[0.08] bg-white/[0.04] text-slate-300 text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
            title="Return to Solar System map"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Worlds</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0071e3] animate-pulse" />
            <span className="text-xs font-semibold text-white tracking-tight truncate max-w-[110px] sm:max-w-none">
              {state.missionName}
            </span>
          </div>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {currentDestination && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-normal">
              <span className="text-[#86868b]">Target:</span>
              <span className="font-semibold text-white">{currentDestination.name}</span>
            </div>
          )}

          {state.isDemoMode && (
            <>
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/35 text-cyan-300 text-xs font-mono font-medium shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>DEMO PRELOADED</span>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  resetMission('hangar');
                }}
                className="hidden md:flex items-center gap-1 px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer"
                title="Clear preloaded demo parts and build from scratch"
              >
                <span>Build From Scratch</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile View Toggle & Quick Launch */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile View Selector Pill */}
          <div className="flex md:hidden items-center p-0.5 rounded-full bg-white/[0.08] border border-white/10 text-[11px]">
            <button
              onClick={() => setMobileView('parts')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                mobileView === 'parts' ? 'bg-white text-black font-semibold shadow-sm' : 'text-slate-300'
              }`}
            >
              Parts
            </button>
            <button
              onClick={() => setMobileView('3d')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                mobileView === '3d' ? 'bg-white text-black font-semibold shadow-sm' : 'text-slate-300'
              }`}
            >
              3D Ship
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-xs text-[#86868b]">
            <span>Subsystems: <strong className="text-white font-medium">{completedCount}/8</strong></span>
            <span>Total Mass: <strong className={resources.isOverMass ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-semibold'}>{resources.totalMass.toLocaleString()} kg</strong></span>
          </div>

          <button
            onClick={handleDirectLaunch}
            className="px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-xs transition-all shadow-md shadow-blue-500/25 flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Launch →</span>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Subsystems Category Bar */}
      <div className="flex md:hidden overflow-x-auto py-2 px-3 gap-1.5 bg-black/40 border-b border-white/10 shrink-0 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const isDone = completionMap[cat.id];
          return (
            <button
              key={cat.id}
              onClick={() => {
                sounds.playClick();
                setActiveCategory(cat.id);
                setMobileView('parts');
              }}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : isDone
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                  : 'bg-white/[0.05] border border-white/10 text-slate-300'
              }`}
            >
              <span className="text-xs">{cat.emoji}</span>
              <span>{cadetMode ? cat.cadetLabel : cat.label}</span>
              {isDone && <Check className="w-3 h-3 text-emerald-400 stroke-[2.5]" />}
            </button>
          );
        })}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* ─── LEFT: Category Tabs (vertical on desktop) ─────── */}
        <div className="hidden md:flex w-[74px] bg-space-900/80 border-r border-slate-800/60 flex-col py-2 overflow-y-auto shrink-0 select-none">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const isDone = completionMap[cat.id];

            return (
              <button
                key={cat.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveCategory(cat.id);
                }}
                className={`relative flex flex-col items-center gap-0.5 py-2 px-1 transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-space-800 text-nasa-cyan'
                    : isDone
                    ? 'text-emerald-400 hover:bg-space-850/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-space-850/30'
                }`}
                title={cat.kidQuestion}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="hangar-tab-indicator"
                    className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full bg-nasa-cyan"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                {/* Step number badge */}
                <span className={`text-[8px] font-mono px-1 rounded ${isActive ? 'bg-nasa-cyan/20 text-nasa-cyan font-bold' : isDone ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-500'}`}>
                  {cat.stepNum}
                </span>

                {/* Big emoji & icon */}
                <span className="text-base leading-none my-0.5">{cat.emoji}</span>

                {/* Label */}
                <span className="text-[9px] font-mono font-bold uppercase tracking-tight leading-tight text-center truncate max-w-[66px]">
                  {cadetMode ? cat.cadetLabel : cat.label}
                </span>

                {/* Completion badge */}
                {isDone && (
                  <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-1.5 h-1.5 text-white stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}

          {/* Progress ring at bottom */}
          <div className="mt-auto pt-3 flex flex-col items-center gap-1 border-t border-slate-800/50 mx-2">
            <div className="relative w-10 h-10">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-slate-800"
                />
                <motion.circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className={allComplete ? 'text-emerald-400' : 'text-nasa-cyan'}
                  initial={false}
                  animate={{
                    strokeDashoffset: 94.25 - (94.25 * completedCount) / 8,
                  }}
                  strokeDasharray="94.25"
                  transition={{ type: 'spring', stiffness: 100 }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-white">
                {completedCount}/8
              </span>
            </div>
            <span className="text-[7px] font-mono text-slate-500 uppercase">DONE</span>
          </div>
        </div>

        {/* ─── CENTER: 3D Spacecraft Viewer ──────────────────── */}
        <div className={`flex-1 relative bg-[#030305] min-w-0 ${mobileView === '3d' ? 'flex flex-col' : 'hidden md:flex md:flex-col'}`}>
          <div className="flex-1 w-full h-full relative">
            <SpaceCanvas cameraPosition={[0, 0.35, 4.4]} fov={45} showStars={false}>
              <SpacecraftViewer
                bus={currentBus}
                power={currentPower}
                comms={currentComms}
                propulsion={currentProp}
                payloads={currentPayloads}
                interactive={true}
                isInLab={true}
              />
            </SpaceCanvas>

            {/* NASA High-Bay Cleanroom Lab Status HUD Overlay */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 border border-red-500/30 backdrop-blur-md shadow-lg shadow-black/80">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[11px] font-bold text-white tracking-wide font-mono">
                  NASA HIGH-BAY INTEGRATION FACILITY // CLEANROOM BAY 04
                </span>
              </div>

              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 backdrop-blur-sm text-[10px] text-slate-300 font-mono">
                <span>Robotic Jig:</span>
                <span className="text-emerald-400 font-semibold">Dual Builder Armatures Active [Clamped]</span>
              </div>

              {currentDestination && (
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 backdrop-blur-sm text-[10px] text-slate-400 font-mono">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: currentDestination.color }}
                  />
                  <span>Target Mission: {currentDestination.name}</span>
                </div>
              )}
            </div>

            {/* Commander Nova Hints (top-right) */}
            <div className="absolute top-4 right-4 z-10 w-64 max-w-[calc(100vw-32px)]">
              <CommanderNova />
            </div>
          </div>

          {/* Resource Gauges Overlay (bottom of 3D view) */}
          <div className="p-3 sm:p-4 bg-gradient-to-t from-[#06070a] via-[#06070a]/95 to-transparent z-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <ResourceGauge
                label="Mass"
                cadetLabel="⚖️ Weight"
                value={resources.totalMass}
                max={resources.massLimit}
                unit="kg"
                isOver={resources.isOverMass}
                isCadet={cadetMode}
                color="bg-cyan-500"
                icon="⚖️"
              />
              <ResourceGauge
                label="Budget"
                cadetLabel="💰 Money"
                value={resources.totalCost}
                max={resources.budgetLimit}
                unit="M"
                isOver={resources.isOverBudget}
                isCadet={cadetMode}
                color="bg-emerald-500"
                icon="💰"
              />
              <ResourceGauge
                label="Power"
                cadetLabel="⚡ Electricity"
                value={resources.powerRequired}
                max={resources.powerGenerated}
                unit="W"
                isOver={resources.isPowerDeficit}
                isCadet={cadetMode}
                color="bg-amber-500"
                icon="⚡"
              />
              <ResourceGauge
                label="Fuel"
                cadetLabel="⛽ Fuel"
                value={resources.deltaVRequired}
                max={resources.deltaVAvailable}
                unit="m/s"
                isOver={resources.isDeltaVDeficit}
                isCadet={cadetMode}
                color="bg-orange-500"
                icon="⛽"
              />
            </div>
          </div>
        </div>

        {/* ─── RIGHT: Parts Panel ────────────────────────────── */}
        <div className={`w-full md:w-[360px] bg-black/40 md:border-l border-white/10 flex flex-col overflow-hidden backdrop-blur-2xl ${mobileView === 'parts' ? 'flex' : 'hidden md:flex'}`}>
          {/* Panel Header - Child-Friendly Step Guidance */}
          <div className="p-3.5 bg-gradient-to-r from-space-900 via-cyan-950/30 to-space-900 border-b border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-nasa-cyan/20 border border-nasa-cyan/40 text-nasa-cyan font-mono font-bold text-[10px] flex items-center justify-center">
                  {activeCategoryData.stepNum}
                </span>
                <span className="text-base">{activeCategoryData.emoji}</span>
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  {cadetMode ? activeCategoryData.cadetLabel : activeCategoryData.label}
                </span>
              </div>
              {completionMap[activeCategory] && (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" /> CHOSEN
                </span>
              )}
            </div>

            <p className="text-xs font-bold text-slate-100 mb-1.5">
              {activeCategoryData.kidQuestion}
            </p>

            <div className="p-2 rounded-xl bg-space-950/80 border border-slate-800 text-[11px] text-cyan-300 font-sans flex items-start gap-1.5 leading-snug">
              <span className="shrink-0">💡</span>
              <span>{activeCategoryData.kidTip}</span>
            </div>
          </div>

          {/* Scrollable Parts List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {renderParts()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Action Bar with Step Navigation */}
          <div className="p-3 border-t border-slate-800/80 bg-space-950/95 space-y-2">
            {allComplete && (
              <div className="p-2.5 rounded-sm bg-emerald-950/90 border border-emerald-500/50 flex items-center justify-between text-xs font-mono text-emerald-300">
                <div>
                  <span className="font-bold text-white block">[ALL 8 SUBSYSTEMS INTEGRATED]</span>
                  <span className="text-[10px] text-emerald-400">
                    {autoLaunchCountdown !== null 
                      ? `Auto-transferring to Launch Pad in ${autoLaunchCountdown}s...` 
                      : 'Spacecraft flight certified.'}
                  </span>
                </div>
                <button
                  onClick={handleDirectLaunch}
                  className="px-3 py-1 rounded-sm bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs cursor-pointer shadow-sm"
                >
                  GO TO PAD NOW ➔
                </button>
              </div>
            )}

            <div className="flex gap-2">
              {activeCategoryData.stepNum > 1 && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    goToPrevCategory();
                  }}
                  className="flex-1 py-2 rounded-sm bg-space-850 hover:bg-space-800 text-slate-300 text-xs font-mono font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>PREV STEP</span>
                </button>
              )}
              {activeCategoryData.stepNum < 8 ? (
                <button
                  onClick={() => {
                    sounds.playClick();
                    goToNextCategory();
                  }}
                  className="flex-1 py-2 rounded-sm bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 border border-cyan-500/40 cursor-pointer"
                >
                  <span>NEXT STEP</span>
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              ) : (
                <button
                  onClick={handleDirectLaunch}
                  className="flex-1 py-2 rounded-sm bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>FINISH SELECTION [✓]</span>
                </button>
              )}
            </div>

            {/* Direct Launch to Pad button */}
            <button
              onClick={handleDirectLaunch}
              className="w-full py-3 rounded-sm text-xs font-mono font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black cursor-pointer shadow-sm"
            >
              <span>{allComplete ? 'PROCEED TO LAUNCH PAD // COMMENCE FLIGHT [➔]' : 'FINISH CONFIGURATION // GO TO LAUNCH PAD [➔]'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
