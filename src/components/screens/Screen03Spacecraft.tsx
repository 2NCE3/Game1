import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Weight, 
  DollarSign, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Sparkles,
  Layers,
  Star
} from 'lucide-react';
import { SPACECRAFT_BUSES, POWER_SYSTEMS, COMMS_SYSTEMS, PROPULSION_SYSTEMS, PAYLOAD_INSTRUMENTS } from '../../data/missionsData';
import { useMission } from '../../context/MissionContext';
import { SpaceCanvas } from '../3d/SpaceCanvas';
import { SpacecraftViewer } from '../3d/SpacecraftViewer';
import { CadetGuideBanner } from '../common/CadetGuideBanner';
import { sounds } from '../../utils/soundEffects';

export const Screen03Spacecraft: React.FC = () => {
  const { state, selectBus, setStep, cadetMode, goToNextStep, goToPrevStep } = useMission();

  const currentBus = SPACECRAFT_BUSES.find(b => b.id === state.busId) || SPACECRAFT_BUSES[1];
  const currentPower = POWER_SYSTEMS.find(p => p.id === state.powerSystemId) || null;
  const currentComms = COMMS_SYSTEMS.find(c => c.id === state.commsSystemId) || null;
  const currentProp = PROPULSION_SYSTEMS.find(p => p.id === state.propulsionSystemId) || null;
  const currentPayloads = PAYLOAD_INSTRUMENTS.filter(p => state.payloadIds.includes(p.id));

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-space-950">
      {/* Friendly Cadet Step Banner */}
      <CadetGuideBanner
        currentStep="spacecraft"
        stepNumber={3}
        totalSteps={8}
        title="Spacecraft Body (Bus)"
        childQuestion="What size probe body should we build?"
        childTip="Tip: Think of the bus as the car's body and computer. The Standard Bus (Titan-II) is balanced and perfect for most missions!"
        onNext={goToNextStep}
        onPrev={goToPrevStep}
      />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* 3D Spacecraft Center Stage */}
        <div className="flex-1 h-[50vh] lg:h-full relative bg-space-950">
          <SpaceCanvas cameraPosition={[0, 0, 4.2]} fov={45}>
            <SpacecraftViewer
              bus={currentBus}
              power={currentPower}
              comms={currentComms}
              propulsion={currentProp}
              payloads={currentPayloads}
              interactive={true}
            />
          </SpaceCanvas>

          {/* Status Callout Pill on 3D viewport */}
          <div className="absolute bottom-4 left-4 z-10 p-3 rounded-xl bg-space-900/85 border border-slate-800 text-xs font-mono text-slate-300 backdrop-blur-md pointer-events-none">
            <div className="flex items-center gap-2 text-nasa-cyan text-[10px] uppercase font-bold tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>3D SPACECRAFT MODEL</span>
            </div>
            <div>Body: <span className="text-white font-bold">{currentBus.name}</span></div>
            <div className="text-[10px] text-slate-400">
              Drag mouse to inspect from any angle
            </div>
          </div>
        </div>

        {/* Right Selection Panel */}
        <div className="w-full lg:w-[420px] bg-space-900/90 border-t lg:border-t-0 lg:border-l border-slate-800/80 p-6 flex flex-col justify-between overflow-y-auto z-20 backdrop-blur-md">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-nasa-cyan uppercase tracking-widest font-bold">
                {cadetMode ? 'PROBE CHASSIS CHOICES' : 'BUS SELECTION'}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                3 OPTIONS AVAILABLE
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              {cadetMode 
                ? 'Your spacecraft bus holds the flight computers, reaction wheels, and sensors. Pick one below:'
                : 'The spacecraft bus serves as the structural backbone, housing attitude determination, fault-tolerant flight computers, and thermal loops.'}
            </p>

            {/* Cards for Bus Options */}
            <div className="space-y-3.5">
              {SPACECRAFT_BUSES.map((bus) => {
                const isSelected = (state.busId || 'bus-standard') === bus.id;
                const isRecommended = bus.id === 'bus-standard';

                return (
                  <div
                    key={bus.id}
                    onClick={() => {
                      sounds.playSelect();
                      selectBus(bus.id);
                    }}
                    className={`relative p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-space-850 border-nasa-orange shadow-lg shadow-nasa-orange/15 ring-2 ring-nasa-orange'
                        : 'bg-space-950/60 border-slate-800 hover:border-slate-700 hover:bg-space-850/40'
                    }`}
                  >
                    {isRecommended && cadetMode && (
                      <div className="absolute -top-2.5 right-4 px-2 py-0.2 rounded-full bg-amber-500 text-black font-mono font-bold text-[9px] uppercase shadow-sm flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-black" />
                        <span>RECOMMENDED</span>
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-display font-bold text-sm text-white">
                          {bus.name}
                        </h4>
                        <p className="text-[11px] text-slate-300 mt-1">
                          {bus.description}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-nasa-orange text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Metrics grid */}
                    <div className="grid grid-cols-4 gap-2 pt-2.5 mt-2.5 border-t border-slate-800 font-mono text-[11px]">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">
                          {cadetMode ? '⚖️ Weight' : 'MASS'}
                        </span>
                        <span className="text-cyan-400 font-bold telemetry-val">
                          {bus.mass} kg
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">
                          {cadetMode ? '💰 Cost' : 'COST'}
                        </span>
                        <span className="text-emerald-400 font-bold telemetry-val">
                          ${bus.cost}M
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">
                          {cadetMode ? '⚡ Drain' : 'DRAIN'}
                        </span>
                        <span className="text-amber-400 font-bold telemetry-val">
                          {bus.basePowerReq}W
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">
                          {cadetMode ? '🛡️ Safety' : 'RELIABILITY'}
                        </span>
                        <span className="text-purple-400 font-bold telemetry-val">
                          {bus.reliability}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Proceed Action */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={() => setStep('payload')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-nasa-orange to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-nasa-orange/20 flex items-center justify-center gap-2"
            >
              <span>CONFIRM BODY & ADD SCIENCE TOOLS ➔</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
