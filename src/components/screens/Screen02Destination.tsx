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
      {/* Sleek Game Header */}
      <div className="h-12 bg-space-950/90 border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              setStep('start');
            }}
            className="px-2.5 py-1 rounded-lg border border-slate-700/80 hover:bg-slate-800 text-slate-300 font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Return to Main Menu"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>MAIN MENU</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-nasa-orange animate-pulse" />
            <span className="font-mono text-xs font-bold text-white tracking-widest uppercase">
              MISSION TARGET // 3D SOLAR SYSTEM
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playSelect();
            setStep('hangar');
          }}
          className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-nasa-orange to-amber-500 hover:from-orange-500 hover:to-amber-400 text-black font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-nasa-orange/20 flex items-center gap-1.5 cursor-pointer"
        >
          <span>ENTER HANGAR ({selectedDest.name.toUpperCase()})</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left/Center: Interactive 3D Solar System View */}
        <div className="flex-1 h-[50vh] lg:h-full relative bg-space-950">
          <SpaceCanvas cameraPosition={[0, 18, 22]} fov={50}>
            <SolarSystemScene 
              selectedDestinationId={selectedDest.id} 
              onSelectDestination={handleDestinationClick} 
            />
          </SpaceCanvas>

          {/* Quick selector buttons at bottom of viewport */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-center gap-2 overflow-x-auto pb-1 pointer-events-auto">
            {DESTINATIONS.map((dest) => (
              <button
                key={dest.id}
                onClick={() => handleDestinationClick(dest.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all border whitespace-nowrap flex items-center gap-2 ${
                  selectedDest.id === dest.id
                    ? 'bg-space-900 border-nasa-cyan text-white shadow-lg shadow-nasa-cyan/25 ring-2 ring-nasa-cyan'
                    : 'bg-space-950/85 border-slate-800 text-slate-300 hover:text-white hover:bg-space-900'
                }`}
              >
                <span className="text-sm">{getCadetEmoji(dest.id)}</span>
                <span>{dest.name}</span>
                {selectedDest.id === dest.id && <span className="text-nasa-cyan">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Side Telemetry & Environmental Profile Panel */}
        <div className="w-full lg:w-[400px] bg-space-900/90 border-t lg:border-t-0 lg:border-l border-slate-800/80 p-6 flex flex-col justify-between overflow-y-auto z-20 backdrop-blur-md">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono text-nasa-cyan uppercase tracking-widest font-bold">
                {cadetMode ? 'TARGET WORLD FACTS' : 'TARGET SPECIFICATIONS'}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                selectedDest.difficulty === 'EXTREME'
                  ? 'bg-red-950/60 border-red-600/50 text-red-400'
                  : selectedDest.difficulty === 'HARD'
                    ? 'bg-amber-950/60 border-amber-600/50 text-amber-400'
                    : 'bg-emerald-950/60 border-emerald-600/50 text-emerald-400'
              }`}>
                {selectedDest.difficulty} DIFFICULTY
              </span>
            </div>

            <div className="flex items-center gap-3.5 mb-4">
              <div 
                className="w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center text-2xl border border-white/20"
                style={{ backgroundColor: selectedDest.color }}
              >
                {getCadetEmoji(selectedDest.id)}
              </div>
              <div>
                <h3 className="font-display font-black text-2xl text-white">
                  {selectedDest.name}
                </h3>
                <span className="text-xs font-mono text-nasa-cyan font-semibold">
                  {selectedDest.type}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              {selectedDest.description}
            </p>

            {/* Environmental Metrics Table */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-space-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-nasa-cyan" />
                  {cadetMode ? 'Distance from Earth' : 'DISTANCE'}
                </span>
                <span className="text-white font-bold telemetry-val">
                  {selectedDest.distance}
                </span>
              </div>

              <div className="p-3 bg-space-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  {cadetMode ? 'Trip Duration' : 'TRANSIT TIME'}
                </span>
                <span className="text-amber-300 font-bold telemetry-val">
                  {selectedDest.travelTime}
                </span>
              </div>

              <div className="p-3 bg-space-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-purple-400" />
                  {cadetMode ? 'Gravity Pull' : 'SURFACE GRAVITY'}
                </span>
                <span className="text-purple-300 font-bold telemetry-val">
                  {selectedDest.gravity}
                </span>
              </div>

              <div className="p-3 bg-space-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-blue-400" />
                  {cadetMode ? 'Radio Call Delay' : 'COMMS LATENCY'}
                </span>
                <span className="text-blue-300 font-bold telemetry-val">
                  {selectedDest.commDelay}
                </span>
              </div>

              <div className="p-3 bg-space-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  {cadetMode ? 'Radiation Hazard' : 'RADIATION LEVEL'}
                </span>
                <span className={`font-bold ${
                  selectedDest.radiation === 'EXTREME' ? 'text-red-400 glow-red' : (selectedDest.radiation === 'HIGH' ? 'text-amber-400' : 'text-emerald-400')
                }`}>
                  {selectedDest.radiation}
                </span>
              </div>
            </div>
          </div>

          {/* Child-Friendly Flight Tip */}
          <div className="mt-4 p-3 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 flex items-start gap-2">
            <span className="text-base">🤖</span>
            <div className="leading-snug">
              <span className="font-bold text-white">Nova's Advice: </span>
              {selectedDest.id === 'new-eden' && 'Humanity\'s promised haven! Liquid oceans, green lowlands, and breathable air. Make sure you pack the Colony Seed Vault, high radiation shields, and retro-thrusters for landing!'}
              {selectedDest.id === 'moon' && 'The Moon is right next door (3 days trip)! Perfect for testing your first rocket design with solar power.'}
              {selectedDest.id === 'mars' && 'The Red Planet has thin air! You will need a strong radio dish and good solar arrays for the 7-month cruise.'}
              {selectedDest.id === 'jupiter' && 'Jupiter is deep in the cold outer space! Solar panels won’t get enough sunlight — choose a Nuclear RTG!'}
              {selectedDest.id === 'asteroid' && 'Asteroids have almost zero gravity! You will need precise thrusters to rendezvous and sample rocks.'}
              {selectedDest.id === 'earth-orbit' && 'Low Earth Orbit is our home backyard! Easy communication and fast data relay.'}
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={() => {
                sounds.playSuccess();
                setStep('hangar');
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-nasa-orange via-amber-500 to-red-500 hover:from-orange-500 hover:to-red-400 text-black font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-nasa-orange/25 flex items-center justify-center gap-2 cursor-pointer ring-2 ring-yellow-400"
            >
              <span>LOCK DESTINATION & ENTER HANGAR 🚀</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
