import React from 'react';
import { motion } from 'framer-motion';
import { 
  Share2, 
  Clock, 
  Fuel, 
  DollarSign, 
  ShieldAlert, 
  ArrowRight, 
  Check, 
  Zap,
  RotateCw,
  Star
} from 'lucide-react';
import { TRAJECTORY_OPTIONS, DESTINATIONS } from '../../data/missionsData';
import { useMission } from '../../context/MissionContext';
import { SpaceCanvas } from '../3d/SpaceCanvas';
import { TrajectoryScene } from '../3d/TrajectoryScene';
import { CadetGuideBanner } from '../common/CadetGuideBanner';
import { sounds } from '../../utils/soundEffects';

export const Screen07Trajectory: React.FC = () => {
  const { state, selectTrajectory, setStep, resources, cadetMode, goToNextStep, goToPrevStep } = useMission();

  const currentTraj = TRAJECTORY_OPTIONS.find(t => t.id === state.trajectoryId) || TRAJECTORY_OPTIONS[1];
  const destination = DESTINATIONS.find(d => d.id === state.destinationId) || DESTINATIONS[0];

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-space-950">
      {/* Friendly Cadet Step Banner */}
      <CadetGuideBanner
        currentStep="trajectory"
        stepNumber={7}
        totalSteps={8}
        title="Flight Route (Trajectory)"
        childQuestion="Which path across space will your probe navigate?"
        childTip="Tip: Balanced Transfer is the classic path NASA uses. Click any route to watch your animated probe travel along the orbital curve!"
        onNext={goToNextStep}
        onPrev={goToPrevStep}
      />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* 3D Orbital Trajectory Visualization */}
        <div className="flex-1 h-[50vh] lg:h-full relative bg-space-950">
          <SpaceCanvas cameraPosition={[6, 12, 16]} fov={45}>
            <TrajectoryScene
              destination={destination}
              selectedTrajectory={currentTraj}
              onSelectTrajectory={selectTrajectory}
            />
          </SpaceCanvas>

          {/* Trajectory Delta-V Status Pill */}
          <div className="absolute bottom-4 left-4 right-4 z-10 p-3.5 bg-space-900/90 border border-slate-800 rounded-2xl backdrop-blur-md flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-400 uppercase">
                {cadetMode ? '🚀 Engine Fuel Power' : 'AVAILABLE DELTA-V'}
              </span>
              <div className="text-white font-bold telemetry-val">
                {resources.deltaVAvailable} m/s
              </div>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase">
                {cadetMode ? '📍 Needed for Trip' : 'REQUIRED DELTA-V'}
              </span>
              <div className={`font-bold telemetry-val ${resources.isDeltaVDeficit ? 'text-red-400' : 'text-cyan-400'}`}>
                {resources.deltaVRequired} m/s
              </div>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase">
                {cadetMode ? '✅ Fuel Safety' : 'MANEUVER MARGIN'}
              </span>
              <div className={`font-bold telemetry-val ${resources.isDeltaVDeficit ? 'text-red-400' : 'text-emerald-400'}`}>
                {resources.deltaVAvailable >= resources.deltaVRequired 
                  ? `+${resources.deltaVAvailable - resources.deltaVRequired} m/s Safe` 
                  : `${resources.deltaVAvailable - resources.deltaVRequired} m/s SHORT!`}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3 Trajectory Options */}
        <div className="w-full lg:w-[420px] bg-space-900/90 border-t lg:border-t-0 lg:border-l border-slate-800/80 p-6 flex flex-col justify-between overflow-y-auto z-20 backdrop-blur-md">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-nasa-cyan uppercase tracking-widest font-bold">
                {cadetMode ? 'ORBITAL FLIGHT ROUTES' : 'TRANSFER PROFILES'}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                TARGET: {destination.name}
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              {cadetMode 
                ? 'Faster routes get you there quickly, but need extra rocket fuel. Balanced routes are smooth and reliable!'
                : 'Astrodynamic maneuvers trade transit duration against fuel mass. Fast trajectories cut radiation exposure but demand extreme propellant expenditures.'}
            </p>

            <div className="space-y-4">
              {TRAJECTORY_OPTIONS.map((traj) => {
                const isSelected = currentTraj.id === traj.id;
                const isRecommended = traj.id === 'traj-balanced';

                return (
                  <div
                    key={traj.id}
                    onClick={() => {
                      sounds.playSelect();
                      selectTrajectory(traj.id);
                    }}
                    className={`relative p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-space-850 border-nasa-orange shadow-lg shadow-nasa-orange/20 ring-2 ring-nasa-orange'
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
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                            traj.riskModifier === 'HIGH' 
                              ? 'bg-red-950 text-red-400 border border-red-800' 
                              : (traj.riskModifier === 'BALANCED' 
                                  ? 'bg-cyan-950 text-nasa-cyan border border-cyan-800' 
                                  : 'bg-emerald-950 text-emerald-400 border border-emerald-800')
                          }`}>
                            {traj.riskModifier} RISK
                          </span>
                          <h4 className="font-display font-bold text-sm text-white">
                            {traj.name}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1">
                          {traj.description}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-nasa-orange text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Metrics grid */}
                    <div className="grid grid-cols-3 gap-2 pt-2.5 mt-2.5 border-t border-slate-800 font-mono text-[11px]">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">FUEL PUSH REQ</span>
                        <span className="text-orange-400 font-bold telemetry-val">
                          ~{traj.deltaVRequired} m/s
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">FUEL BURN</span>
                        <span className="text-cyan-400 font-bold telemetry-val">
                          {Math.round(traj.fuelModifier * 100)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">SPEED</span>
                        <span className="text-amber-400 font-bold telemetry-val">
                          {traj.id === 'traj-fast' ? '⚡ FAST' : (traj.id === 'traj-efficient' ? '🐢 SLOW' : 'NORMAL')}
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
              onClick={() => setStep('review')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-nasa-orange to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-nasa-orange/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>CONFIRM ROUTE & PRE-FLIGHT CHECK ➔</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
