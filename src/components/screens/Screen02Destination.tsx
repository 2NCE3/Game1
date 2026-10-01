import React from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, 
  Clock, 
  Radio, 
  ShieldAlert, 
  MapPin, 
  ArrowRight, 
  Globe2, 
  Zap,
  Check,
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import { DESTINATIONS } from '../../data/missionsData';
import { useMission } from '../../context/MissionContext';
import { SpaceCanvas } from '../3d/SpaceCanvas';
import { SolarSystemScene } from '../3d/SolarSystemScene';
import { CadetGuideBanner } from '../common/CadetGuideBanner';
import { SatellitesTrackerHUD } from '../common/SatellitesTrackerHUD';
import { sounds } from '../../utils/soundEffects';

export const Screen02Destination: React.FC = () => {
  const { state, selectDestination, setStep, cadetMode, goToNextStep, goToPrevStep } = useMission();

  const selectedDest = DESTINATIONS.find(d => d.id === state.destinationId) || DESTINATIONS[0];

  const handleDestinationClick = (id: string) => {
    sounds.playSelect();
    selectDestination(id);
  };

  const getCadetEmoji = (id: string) => {
    switch (id) {
      case 'new-eden': return '🌿';
      case 'moon': return '🌙';
      case 'mars': return '🔴';
      case 'asteroid': return '☄️';
      case 'earth-orbit': return '🌍';
      case 'jupiter': return '🪐';
      default: return '🛰️';
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-space-950">
      {/* Sleek Apple Header */}
      <div className="h-14 bg-black/40 border-b border-white/10 px-4 sm:px-6 flex items-center justify-between z-20 backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              setStep('start');
            }}
            className="px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            title="Return to Main Menu"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Main Menu</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0071e3]" />
            <span className="text-xs font-semibold text-white tracking-tight">
              Mission Target · 3D Solar System
            </span>
          </div>

          <div className="hidden sm:block">
            <SatellitesTrackerHUD onSelectDestination={handleDestinationClick} />
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playSelect();
            setStep('hangar');
          }}
          className="px-5 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs tracking-tight transition-all shadow-md shadow-[#0071e3]/20 flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
        >
          <span>Enter Hangar ({selectedDest.name})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left/Center: Interactive 3D Solar System View */}
        <div className="flex-1 h-[42vh] sm:h-[48vh] lg:h-full relative bg-space-950 shrink-0">
          {/* Top-Left Fleet Status on Mobile */}
          <div className="absolute top-3 left-3 z-10 sm:hidden">
            <SatellitesTrackerHUD onSelectDestination={handleDestinationClick} />
          </div>

          <SpaceCanvas cameraPosition={[0, 18, 22]} fov={50}>
            <SolarSystemScene 
              selectedDestinationId={selectedDest.id} 
              onSelectDestination={handleDestinationClick} 
            />
          </SpaceCanvas>

          {/* Quick selector buttons at bottom of viewport */}
          <div className="absolute bottom-3 sm:bottom-5 left-2 right-2 sm:left-4 sm:right-4 z-10 flex items-center justify-start sm:justify-center overflow-x-auto pb-1 pointer-events-auto scrollbar-none px-2">
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/70 backdrop-blur-2xl border border-white/15 shadow-2xl shrink-0">
              {DESTINATIONS.map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => handleDestinationClick(dest.id)}
                  className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    selectedDest.id === dest.id
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-sm">{getCadetEmoji(dest.id)}</span>
                  <span>{dest.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Side Telemetry & Environmental Profile Panel */}
        <div className="w-full lg:w-[380px] bg-black/50 border-t lg:border-t-0 lg:border-l border-white/10 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto z-20 backdrop-blur-2xl font-sans">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {cadetMode ? 'Target World Facts' : 'Target Specifications'}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase border ${
                selectedDest.difficulty === 'EXTREME'
                  ? 'bg-red-500/10 border-red-500/25 text-red-400'
                  : selectedDest.difficulty === 'HARD'
                    ? 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                    : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
              }`}>
                {selectedDest.difficulty} Difficulty
              </span>
            </div>

            <div className="flex items-center gap-3.5 mb-4">
              <div 
                className="w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center text-2xl border border-white/15"
                style={{ backgroundColor: selectedDest.color }}
              >
                {getCadetEmoji(selectedDest.id)}
              </div>
              <div>
                <h3 className="font-display font-bold text-2xl text-white tracking-tight">
                  {selectedDest.name}
                </h3>
                <span className="text-xs text-sky-400 font-medium">
                  {selectedDest.type}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6 font-normal">
              {selectedDest.description}
            </p>

            {/* Environmental Metrics Table */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-400" />
                  {cadetMode ? 'Distance from Earth' : 'Distance'}
                </span>
                <span className="text-white font-medium">
                  {selectedDest.distance}
                </span>
              </div>

              <div className="p-3 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  {cadetMode ? 'Trip Duration' : 'Transit Time'}
                </span>
                <span className="text-amber-300 font-medium">
                  {selectedDest.travelTime}
                </span>
              </div>

              <div className="p-3 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-purple-400" />
                  {cadetMode ? 'Gravity Pull' : 'Surface Gravity'}
                </span>
                <span className="text-purple-300 font-medium">
                  {selectedDest.gravity}
                </span>
              </div>

              <div className="p-3 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-blue-400" />
                  {cadetMode ? 'Radio Call Delay' : 'Comms Latency'}
                </span>
                <span className="text-blue-300 font-medium">
                  {selectedDest.commDelay}
                </span>
              </div>

              <div className="p-3 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  {cadetMode ? 'Radiation Hazard' : 'Radiation Level'}
                </span>
                <span className={`font-semibold ${
                  selectedDest.radiation === 'EXTREME' ? 'text-red-400' : (selectedDest.radiation === 'HIGH' ? 'text-amber-400' : 'text-emerald-400')
                }`}>
                  {selectedDest.radiation}
                </span>
              </div>
            </div>
          </div>

          {/* Child-Friendly Flight Tip */}
          <div className="mt-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-slate-300 flex items-start gap-2.5">
            <span className="text-base">🤖</span>
            <div className="leading-relaxed">
              <span className="font-semibold text-white">Nova's Guidance: </span>
              {selectedDest.id === 'new-eden' && 'Humanity\'s promised haven! Liquid oceans, green lowlands, and breathable air. Make sure you pack the Colony Seed Vault, high radiation shields, and retro-thrusters for landing.'}
              {selectedDest.id === 'moon' && 'The Moon is right next door (3 days trip). Perfect for testing your first rocket design with solar power.'}
              {selectedDest.id === 'mars' && 'The Red Planet has thin air. You will need a strong radio dish and good solar arrays for the 7-month cruise.'}
              {selectedDest.id === 'jupiter' && 'Jupiter is deep in cold outer space. Solar panels won’t get enough sunlight — choose a Nuclear RTG.'}
              {selectedDest.id === 'asteroid' && 'Asteroids have almost zero gravity. You will need precise thrusters to rendezvous and sample rocks.'}
              {selectedDest.id === 'earth-orbit' && 'Low Earth Orbit is our home backyard — fast communication and direct ground station coverage.'}
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-5 pt-3 border-t border-white/10">
            <button
              onClick={() => {
                sounds.playSuccess();
                setStep('hangar');
              }}
              className="w-full py-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs tracking-tight transition-all shadow-md shadow-[#0071e3]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>Confirm Destination & Enter Hangar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
