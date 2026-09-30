import React, { useState } from 'react';
import { 
  Rocket, 
  DollarSign, 
  Weight, 
  Zap, 
  Fuel, 
  Award, 
  ShieldCheck, 
  RotateCcw, 
  HelpCircle, 
  Sparkles,
  AlertTriangle,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { Tooltip } from '../common/Tooltip';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { EducationModal } from '../common/EducationModal';
import { sounds } from '../../utils/soundEffects';

export const TopBar: React.FC = () => {
  const { 
    state, 
    resources, 
    cadetMode,
    toggleCadetMode,
    loadDemoMission, 
    resetMission, 
    setMissionName 
  } = useMission();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(state.missionName);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showEduModal, setShowEduModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sounds.enabled);

  const toggleAudio = () => {
    const next = sounds.toggleSound();
    setSoundEnabled(next);
  };

  // Status color badge
  const getStatusBadge = () => {
    switch (state.status) {
      case 'DRAFT':
        return 'bg-slate-800/80 text-slate-300 border-slate-700';
      case 'READY':
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-600/50 glow-green';
      case 'IN FLIGHT':
        return 'bg-cyan-950/60 text-nasa-cyan border-nasa-cyan/60 animate-pulse';
      case 'COMPLETE':
        return 'bg-blue-950/60 text-blue-400 border-blue-500/50';
      case 'FAILED':
        return 'bg-red-950/80 text-red-400 border-red-500/60 glow-red';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      setMissionName(tempName.trim());
    }
    setIsEditingName(false);
  };

  return (
    <>
      <header className="h-16 bg-space-950/90 border-b border-slate-800/80 px-4 flex items-center justify-between gap-4 sticky top-0 z-40 backdrop-blur-md">
        {/* Left: Brand & Status & Mission Name */}
        <div className="flex items-center gap-4 min-w-[280px]">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nasa-orange to-red-600 flex items-center justify-center text-white shadow-lg shadow-nasa-orange/20 border border-orange-400/30">
              <Rocket className="w-4 h-4 -rotate-45" />
            </div>
            <div>
              <div className="font-display font-black text-sm tracking-wider text-white flex items-center gap-1.5">
                <span>MISSIONFORGE</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-nasa-orange/20 border border-nasa-orange/40 text-nasa-orange font-mono font-normal">
                  2026 NASA
                </span>
              </div>
              <div className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">
                DESIGN. DECIDE. LAUNCH.
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          {/* Status Badge */}
          <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest uppercase border ${getStatusBadge()}`}>
            {state.status}
          </div>

          {/* Mission Name */}
          <div className="hidden md:block">
            {isEditingName ? (
              <form onSubmit={handleNameSubmit}>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  autoFocus
                  className="bg-space-900 border border-nasa-cyan px-2 py-0.5 rounded text-xs font-mono text-white focus:outline-none"
                />
              </form>
            ) : (
              <div 
                onClick={() => {
                  setTempName(state.missionName);
                  setIsEditingName(true);
                }}
                className="text-xs font-mono text-slate-300 hover:text-white cursor-pointer px-1.5 py-0.5 rounded hover:bg-slate-800/60 transition-colors flex items-center gap-1"
                title="Click to rename mission"
              >
                <span>{state.missionName}</span>
                <span className="text-[10px] text-slate-500">✎</span>
              </div>
            )}
          </div>
        </div>

        {/* Center: Live Resource Indicators */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3">
          {/* BUDGET */}
          <Tooltip 
            title="Mission Budget Allocation" 
            content="Total cost of spacecraft bus, scientific payload, launch vehicle, and systems against Congressional appropriation."
            tip="Exceeding budget risks mission cancellation."
          >
            <div className={`flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs font-mono transition-all ${
              resources.isOverBudget 
                ? 'bg-red-950/50 border-red-500/60 text-red-400' 
                : 'bg-space-900/60 border-slate-800 text-slate-300'
            }`}>
              <DollarSign className={`w-3.5 h-3.5 ${resources.isOverBudget ? 'text-red-400' : 'text-emerald-400'}`} />
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 leading-none">BUDGET</span>
                <span className="telemetry-val text-[11px] font-bold font-mono">
                  ${resources.totalCost}M <span className="text-slate-500 font-normal">/ ${resources.budgetLimit}M</span>
                </span>
              </div>
            </div>
          </Tooltip>

          {/* MASS */}
          <Tooltip glossaryKey="mass-margin">
            <div className={`flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs font-mono transition-all ${
              resources.isOverMass 
                ? 'bg-red-950/60 border-red-500/80 text-red-400 animate-pulse' 
                : 'bg-space-900/60 border-slate-800 text-slate-300'
            }`}>
              <Weight className={`w-3.5 h-3.5 ${resources.isOverMass ? 'text-red-400' : 'text-cyan-400'}`} />
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 leading-none">MASS</span>
                <span className="telemetry-val text-[11px] font-bold font-mono">
                  {resources.totalMass.toLocaleString()} kg <span className="text-slate-500 font-normal">/ {resources.massLimit.toLocaleString()}</span>
                </span>
              </div>
              {resources.isOverMass && <AlertTriangle className="w-3.5 h-3.5 text-red-400 ml-1" />}
            </div>
          </Tooltip>

          {/* POWER */}
          <Tooltip glossaryKey="power-reserve">
            <div className={`flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs font-mono transition-all ${
              resources.isPowerDeficit 
                ? 'bg-red-950/50 border-red-500/60 text-red-400' 
                : (resources.powerReservePercent < 20 
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-400' 
                    : 'bg-space-900/60 border-slate-800 text-slate-300')
            }`}>
              <Zap className={`w-3.5 h-3.5 ${resources.isPowerDeficit ? 'text-red-400' : 'text-yellow-400'}`} />
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 leading-none">POWER</span>
                <span className="telemetry-val text-[11px] font-bold font-mono">
                  {(resources.powerGenerated / 1000).toFixed(1)} kW <span className="text-slate-500 font-normal">/ {(resources.powerRequired / 1000).toFixed(1)} kW</span>
                </span>
              </div>
            </div>
          </Tooltip>

          {/* FUEL / DELTA-V */}
          <Tooltip glossaryKey="delta-v">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md border border-slate-800 bg-space-900/60 text-xs font-mono text-slate-300">
              <Fuel className="w-3.5 h-3.5 text-orange-400" />
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 leading-none">DELTA-V</span>
                <span className="telemetry-val text-[11px] font-bold font-mono">
                  {resources.fuelPercent}% <span className="text-slate-500 font-normal">({resources.deltaVAvailable} m/s)</span>
                </span>
              </div>
            </div>
          </Tooltip>

          {/* SCIENCE */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md border border-slate-800 bg-space-900/60 text-xs font-mono text-slate-300">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 leading-none">SCIENCE</span>
              <span className="telemetry-val text-[11px] font-bold font-mono text-purple-300">
                +{resources.totalScience} <span className="text-slate-500 font-normal">pts</span>
              </span>
            </div>
          </div>

          {/* RELIABILITY */}
          <Tooltip glossaryKey="reliability">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md border border-slate-800 bg-space-900/60 text-xs font-mono text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 leading-none">RELIABILITY</span>
                <span className="telemetry-val text-[11px] font-bold font-mono">
                  {resources.overallReliability}%
                </span>
              </div>
            </div>
          </Tooltip>
        </div>

        {/* Right: Quick Actions (Cadet Mode toggle, Demo Mission, Help, Reset) */}
        <div className="flex items-center gap-2">
          {/* Cadet Mode Toggle Button */}
          <button
            onClick={toggleCadetMode}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all shadow-sm ${
              cadetMode
                ? 'bg-gradient-to-r from-nasa-orange/20 to-amber-500/20 border-nasa-orange/60 text-nasa-orange'
                : 'bg-space-900 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Kid-Friendly Cadet Mode with step-by-step tips"
          >
            <span>👨‍🚀</span>
            <span className="hidden sm:inline">{cadetMode ? 'CADET GUIDE ON' : 'CADET GUIDE'}</span>
          </button>

          {/* How It Works Button */}
          <button
            onClick={() => setShowEduModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700/80 hover:bg-slate-800 text-slate-300 text-xs font-mono transition-colors"
            title="How It Works"
          >
            <HelpCircle className="w-3.5 h-3.5 text-nasa-cyan" />
            <span className="hidden sm:inline">GUIDE</span>
          </button>

          {/* Demo Mission Button */}
          <button
            onClick={loadDemoMission}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-nasa-orange/20 hover:bg-nasa-orange/30 border border-nasa-orange/50 text-nasa-orange hover:text-white text-xs font-mono font-semibold transition-all shadow-sm"
            title="Instantly load preconfigured Lunar Polar Explorer mission"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">DEMO MISSION</span>
          </button>

          {/* Sound Toggle Button */}
          <button
            onClick={toggleAudio}
            className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Reset Button */}
          <button
            onClick={() => setShowResetModal(true)}
            className="p-1.5 rounded-lg border border-slate-800 hover:bg-red-950/40 hover:border-red-600/40 text-slate-400 hover:text-red-400 transition-colors"
            title="Reset Mission"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Confirmation & Guide Modals */}
      <ConfirmationModal
        isOpen={showResetModal}
        title="RESET CURRENT MISSION?"
        message="This will clear all selected spacecraft components, launch vehicles, trajectory plans, and reset the simulation to default. Are you sure you want to proceed?"
        confirmLabel="YES, RESET MISSION"
        cancelLabel="CANCEL"
        onConfirm={() => {
          resetMission();
          setShowResetModal(false);
        }}
        onCancel={() => setShowResetModal(false)}
      />

      <EducationModal
        isOpen={showEduModal}
        onClose={() => setShowEduModal(false)}
        onStartDemo={() => {
          loadDemoMission();
          setShowEduModal(false);
        }}
      />
    </>
  );
};
