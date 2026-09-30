import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  Plus, 
  Minus, 
  Award, 
  Weight, 
  DollarSign, 
  Zap, 
  Radio, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Camera,
  Radar,
  RadioTower,
  Eye
} from 'lucide-react';
import { PAYLOAD_INSTRUMENTS, SPACECRAFT_BUSES, POWER_SYSTEMS, COMMS_SYSTEMS, PROPULSION_SYSTEMS } from '../../data/missionsData';
import { useMission } from '../../context/MissionContext';
import { SpaceCanvas } from '../3d/SpaceCanvas';
import { SpacecraftViewer } from '../3d/SpacecraftViewer';
import { CadetGuideBanner } from '../common/CadetGuideBanner';
import { sounds } from '../../utils/soundEffects';

export const Screen04Payload: React.FC = () => {
  const { state, togglePayload, setStep, resources, cadetMode, goToNextStep, goToPrevStep } = useMission();

  const currentBus = SPACECRAFT_BUSES.find(b => b.id === state.busId) || SPACECRAFT_BUSES[1];
  const currentPower = POWER_SYSTEMS.find(p => p.id === state.powerSystemId) || null;
  const currentComms = COMMS_SYSTEMS.find(c => c.id === state.commsSystemId) || null;
  const currentProp = PROPULSION_SYSTEMS.find(p => p.id === state.propulsionSystemId) || null;
  const selectedInstruments = PAYLOAD_INSTRUMENTS.filter(p => state.payloadIds.includes(p.id));

  const getToolIcon = (id: string) => {
    switch (id) {
      case 'inst-camera': return '📷';
      case 'inst-spectrometer': return '🌈';
      case 'inst-radar': return '📡';
      case 'inst-gpr': return '⛏️';
      case 'inst-magnetometer': return '🧭';
      case 'inst-radiation': return '☢️';
      case 'inst-thermal': return '🌡️';
      case 'inst-atmosphere': return '💨';
      default: return '🔬';
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-space-950">
      {/* Friendly Cadet Step Banner */}
      <CadetGuideBanner
        currentStep="payload"
        stepNumber={4}
        totalSteps={8}
        title="Scientific Payload"
        childQuestion="What instruments do you want to pack for discovery?"
        childTip="Tip: Cameras take amazing photos and Ground Radar discovers ice underground! Watch your electricity & weight meters in the bottom bar!"
        onNext={goToNextStep}
        onPrev={goToPrevStep}
        disableNext={state.payloadIds.length === 0}
      />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Column: 3D Spacecraft with Live Mounted Sensors */}
        <div className="w-full lg:w-2/5 h-[40vh] lg:h-full relative bg-space-950 border-b lg:border-b-0 lg:border-r border-slate-800">
          <SpaceCanvas cameraPosition={[0, 0, 4.5]} fov={45}>
            <SpacecraftViewer
              bus={currentBus}
              power={currentPower}
              comms={currentComms}
              propulsion={currentProp}
              payloads={selectedInstruments}
              interactive={true}
            />
          </SpaceCanvas>

          {/* Mounted Instrument Inventory Pill */}
          <div className="absolute bottom-4 left-4 right-4 z-10 p-3 bg-space-900/90 border border-slate-800 rounded-2xl backdrop-blur-md">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-slate-400">
                {cadetMode ? 'PACKED SCIENCE TOOLS:' : 'MOUNTED SENSORS:'}
              </span>
              <span className="text-nasa-cyan font-bold">{selectedInstruments.length} of 8 ATTACHED</span>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {selectedInstruments.length === 0 ? (
                <span className="text-[11px] text-amber-300 font-mono italic">
                  No tools mounted yet! Click "+ ADD" on any tool on the right.
                </span>
              ) : (
                selectedInstruments.map(inst => (
                  <span 
                    key={inst.id} 
                    className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-purple-950/70 border border-purple-600/50 text-purple-200 flex items-center gap-1.5"
                  >
                    <span>{getToolIcon(inst.id)}</span>
                    <span className="font-semibold">{inst.name.split(' ')[0]}</span>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Instrument Selection Grid */}
        <div className="flex-1 h-full p-6 flex flex-col justify-between overflow-y-auto bg-space-900/40">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  {cadetMode ? 'Select Your Scientific Instruments 🔬' : 'Available Scientific Sensors'}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {cadetMode 
                    ? 'Click ADD to equip a tool. Each tool earns you Science Points for NASA!'
                    : 'Click ADD / REMOVE to balance mass, electrical power drain, and science return.'}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-950/50 border border-purple-600/60 text-purple-200 font-mono text-xs flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                <span>Total Science: <strong className="text-white text-sm">+{resources.totalScience} pts</strong></span>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-6">
              {PAYLOAD_INSTRUMENTS.map((inst) => {
                const isSelected = state.payloadIds.includes(inst.id);
                const isTargetSynergy = state.destinationId && inst.primaryTargetIds.includes(state.destinationId);

                return (
                  <motion.div
                    key={inst.id}
                    whileHover={{ y: -2 }}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-space-850/95 border-purple-500 shadow-lg shadow-purple-500/15 ring-2 ring-purple-500/60'
                        : 'bg-space-950/70 border-slate-800 hover:border-slate-700 hover:bg-space-850/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xl p-1 rounded-lg bg-space-900 border border-slate-800">
                            {getToolIcon(inst.id)}
                          </span>
                          <div>
                            <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                              {inst.category}
                            </span>
                            <h4 className="font-display font-bold text-xs text-white">
                              {inst.name}
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {isTargetSynergy && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-950/70 text-emerald-400 border border-emerald-700/60 font-bold" title="High scientific synergy for target destination">
                              ⭐ MATCH
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950/70 text-purple-300 font-bold border border-purple-700/50">
                            +{inst.scienceValue} PTS
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-snug mb-3">
                        {inst.description}
                      </p>

                      {/* Metrics row */}
                      <div className="grid grid-cols-4 gap-1.5 py-2 px-2.5 bg-space-950/80 border border-slate-800/80 rounded-xl font-mono text-[10px] mb-3">
                        <div>
                          <span className="text-[8px] text-slate-400 uppercase block">
                            {cadetMode ? '⚖️ Weight' : 'MASS'}
                          </span>
                          <span className="text-cyan-400 font-bold telemetry-val">+{inst.mass} kg</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-400 uppercase block">
                            {cadetMode ? '💰 Cost' : 'COST'}
                          </span>
                          <span className="text-emerald-400 font-bold telemetry-val">+${inst.cost}M</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-400 uppercase block">
                            {cadetMode ? '⚡ Power' : 'POWER'}
                          </span>
                          <span className="text-amber-400 font-bold telemetry-val">+{inst.power}W</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-400 uppercase block">DATA</span>
                          <span className="text-blue-400 font-bold telemetry-val">{inst.dataRate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Add / Remove Toggle Button */}
                    <button
                      onClick={() => {
                        sounds.playSelect();
                        togglePayload(inst.id);
                      }}
                      className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-purple-950/70 hover:bg-red-950/70 text-purple-200 hover:text-red-200 border border-purple-500/60 hover:border-red-500/60'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Minus className="w-3.5 h-3.5 text-red-400" />
                          <span>REMOVE TOOL ✕</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-nasa-cyan" />
                          <span>+ ADD TOOL TO SHIP</span>
                        </>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Bottom Proceed Action */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs font-mono text-slate-300">
              {state.payloadIds.length === 0 ? (
                <span className="text-amber-300 font-bold">⚠ Pick at least one science tool to proceed!</span>
              ) : (
                <span className="text-emerald-400 font-bold">✓ {state.payloadIds.length} tools mounted (+{resources.totalScience} discovery points)</span>
              )}
            </div>

            <button
              onClick={() => setStep('launch')}
              disabled={state.payloadIds.length === 0}
              className={`px-6 py-3.5 rounded-xl font-mono font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-2 ${
                state.payloadIds.length > 0
                  ? 'bg-gradient-to-r from-nasa-orange to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-lg shadow-nasa-orange/20 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>CONFIRM TOOLS & PICK ROCKET ➔</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
