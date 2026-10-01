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

  // Status color badge (Minimal Apple Style)
  const getStatusBadge = () => {
    switch (state.status) {
      case 'DRAFT':
        return 'bg-white/5 text-slate-300 border-white/10';
      case 'READY':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'IN FLIGHT':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'COMPLETE':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'FAILED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-white/5 text-slate-300 border-white/10';
    }
  };

  const getStatusLabel = () => {
    switch (state.status) {
      case 'DRAFT': return 'Drafting';
      case 'READY': return 'Ready';
      case 'IN FLIGHT': return 'In Flight';
      case 'COMPLETE': return 'Completed';
      case 'FAILED': return 'Failed';
      default: return 'Draft';
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
      <header className="h-16 bg-black/60 border-b border-white/10 px-4 flex items-center justify-between gap-4 sticky top-0 z-40 backdrop-blur-2xl">
        {/* Left: Brand & Status & Mission Name */}
        <div className="flex items-center gap-4 min-w-[280px]">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0071e3] to-cyan-400 flex items-center justify-center text-white shadow-sm">
              <Rocket className="w-4 h-4 -rotate-45" />
            </div>
            <div>
              <div className="font-semibold text-sm tracking-tight text-white flex items-center gap-2">
                <span>MissionForge</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-400 font-medium">
                  2026 NASA
                </span>
              </div>
              <div className="text-[10px] text-[#86868b] tracking-normal font-normal">
                Design. Decide. Launch.
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-white/10 hidden sm:block" />

          {/* Status Badge */}
          <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${getStatusBadge()}`}>
            {getStatusLabel()}
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
                  className="bg-black/40 border border-[#0071e3]/50 px-2 py-0.5 rounded-lg text-xs font-sans text-white focus:outline-none"
                />
              </form>
            ) : (
              <div 
                onClick={() => {
                  setTempName(state.missionName);
                  setIsEditingName(true);
                }}
                className="text-xs font-sans text-slate-300 hover:text-white cursor-pointer px-2 py-1 rounded-lg hover:bg-white/[0.06] transition-colors flex items-center gap-1.5"
                title="Click to rename mission"
              >
                <span>{state.missionName}</span>
                <span className="text-[10px] text-slate-500">✎</span>
              </div>
            )}
          </div>
        </div>

        {/* Center: Live Resource Indicators */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-2.5">
          {/* BUDGET */}
          <Tooltip 
            title="Mission Budget Allocation" 
            content="Total cost of spacecraft bus, scientific payload, launch vehicle, and systems against Congressional appropriation."
            tip="Exceeding budget risks mission cancellation."
          >
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-sans transition-all ${
              resources.isOverBudget 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                : 'bg-white/[0.04] border-white/10 text-slate-300'
            }`}>
              <DollarSign className={`w-3.5 h-3.5 ${resources.isOverBudget ? 'text-rose-400' : 'text-emerald-400'}`} />
              <div className="flex flex-col">
                <span className="text-[9px] text-[#86868b] leading-none mb-0.5">Budget</span>
                <span className="telemetry-val text-[11px] font-medium">
                  ${resources.totalCost}M <span className="text-slate-500 font-normal">/ ${resources.budgetLimit}M</span>
                </span>
              </div>
            </div>
          </Tooltip>

          {/* MASS */}
          <Tooltip glossaryKey="mass-margin">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-sans transition-all ${
              resources.isOverMass 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                : 'bg-white/[0.04] border-white/10 text-slate-300'
            }`}>
              <Weight className={`w-3.5 h-3.5 ${resources.isOverMass ? 'text-rose-400' : 'text-cyan-400'}`} />
              <div className="flex flex-col">
                <span className="text-[9px] text-[#86868b] leading-none mb-0.5">Mass</span>
                <span className="telemetry-val text-[11px] font-medium">
                  {resources.totalMass.toLocaleString()} kg <span className="text-slate-500 font-normal">/ {resources.massLimit.toLocaleString()}</span>
                </span>
              </div>
              {resources.isOverMass && <AlertTriangle className="w-3.5 h-3.5 text-rose-400 ml-1" />}
            </div>
          </Tooltip>

          {/* POWER */}
          <Tooltip glossaryKey="power-reserve">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-sans transition-all ${
              resources.isPowerDeficit 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                : (resources.powerReservePercent < 20 
                    ? 'bg-amber-500/10 border-amber-500/25 text-amber-300' 
                    : 'bg-white/[0.04] border-white/10 text-slate-300')
            }`}>
              <Zap className={`w-3.5 h-3.5 ${resources.isPowerDeficit ? 'text-rose-400' : 'text-amber-400'}`} />
              <div className="flex flex-col">
                <span className="text-[9px] text-[#86868b] leading-none mb-0.5">Power</span>
                <span className="telemetry-val text-[11px] font-medium">
                  {(resources.powerGenerated / 1000).toFixed(1)} kW <span className="text-slate-500 font-normal">/ {(resources.powerRequired / 1000).toFixed(1)} kW</span>
                </span>
              </div>
            </div>
          </Tooltip>

          {/* FUEL / DELTA-V */}
          <Tooltip glossaryKey="delta-v">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs font-sans text-slate-300">
              <Fuel className="w-3.5 h-3.5 text-orange-400" />
              <div className="flex flex-col">
                <span className="text-[9px] text-[#86868b] leading-none mb-0.5">Delta-V</span>
                <span className="telemetry-val text-[11px] font-medium">
                  {resources.fuelPercent}% <span className="text-slate-500 font-normal">({resources.deltaVAvailable} m/s)</span>
                </span>
              </div>
            </div>
          </Tooltip>

          {/* SCIENCE */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs font-sans text-slate-300">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <div className="flex flex-col">
              <span className="text-[9px] text-[#86868b] leading-none mb-0.5">Science</span>
              <span className="telemetry-val text-[11px] font-medium text-purple-300">
                +{resources.totalScience} <span className="text-slate-500 font-normal">pts</span>
              </span>
            </div>
          </div>

          {/* RELIABILITY */}
          <Tooltip glossaryKey="reliability">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs font-sans text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-[9px] text-[#86868b] leading-none mb-0.5">Reliability</span>
                <span className="telemetry-val text-[11px] font-medium">
                  {resources.overallReliability}%
                </span>
              </div>
            </div>
          </Tooltip>
        </div>

        {/* Right: Quick Actions (Apple Pills) */}
        <div className="flex items-center gap-2">
          {/* Cadet Mode Toggle Button */}
          <button
            onClick={toggleCadetMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
              cadetMode
                ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                : 'bg-white/[0.06] border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.12]'
            }`}
            title="Toggle Kid-Friendly Cadet Mode with step-by-step tips"
          >
            <span>👨‍🚀</span>
            <span className="hidden sm:inline">{cadetMode ? 'Cadet Mode On' : 'Cadet Mode'}</span>
          </button>

          {/* How It Works Button */}
          <button
            onClick={() => setShowEduModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 text-xs font-medium transition-colors"
            title="How It Works"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Guide</span>
          </button>

          {/* Demo Mission Button */}
          <button
            onClick={loadDemoMission}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium transition-all shadow-sm shadow-blue-500/25"
            title="Instantly load preconfigured Lunar Polar Explorer mission"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Demo Mission</span>
          </button>

          {/* Sound Toggle Button */}
          <button
            onClick={toggleAudio}
            className="p-2 rounded-full border border-white/10 bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 transition-colors"
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {/* Reset Button */}
          <button
            onClick={() => setShowResetModal(true)}
            className="p-2 rounded-full border border-white/10 bg-white/[0.06] hover:bg-rose-500/20 hover:border-rose-500/30 text-slate-300 hover:text-rose-400 transition-colors"
            title="Reset Mission"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Confirmation & Guide Modals */}
      <ConfirmationModal
        isOpen={showResetModal}
        title="Reset current mission?"
        message="This will clear all selected spacecraft components, launch vehicles, trajectory plans, and reset the simulation to default. Are you sure you want to proceed?"
        confirmLabel="Reset Mission"
        cancelLabel="Cancel"
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
