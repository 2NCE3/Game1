import React from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Weight, 
  DollarSign, 
  ShieldCheck, 
  ArrowRight, 
  AlertTriangle, 
  Check, 
  Zap,
  Gauge,
  Sparkles,
  Wand2
} from 'lucide-react';
import { LAUNCH_VEHICLES } from '../../data/missionsData';
import { useMission } from '../../context/MissionContext';
import { SpaceCanvas } from '../3d/SpaceCanvas';
import { RocketViewer } from '../3d/RocketViewer';
import { CadetGuideBanner } from '../common/CadetGuideBanner';
import { sounds } from '../../utils/soundEffects';

export const Screen05LaunchVehicle: React.FC = () => {
  const { state, selectLaunchVehicle, setStep, resources, cadetMode, autoBalanceMission, goToNextStep, goToPrevStep } = useMission();

  const selectedVehicle = LAUNCH_VEHICLES.find(v => v.id === state.launchVehicleId) || LAUNCH_VEHICLES[1];

  const remainingCapacity = selectedVehicle.payloadCapacity - resources.totalMass;
  const isOverCapacity = remainingCapacity < 0;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-space-950">
      {/* Friendly Cadet Step Banner */}
      <CadetGuideBanner
        currentStep="launch"
        stepNumber={5}
        totalSteps={8}
        title="Launch Vehicle (Rocket)"
        childQuestion="Which rocket has enough lifting muscle to blast your ship into space?"
        childTip="Tip: Check your weight meter below. If the rocket is too small, simply tap a Medium Lift or Heavy Lift rocket!"
        onNext={goToNextStep}
        onPrev={goToPrevStep}
        disableNext={isOverCapacity}
      />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left/Center: 3D Rocket Stage View */}
        <div className="flex-1 h-[50vh] lg:h-full relative bg-space-950">
          <SpaceCanvas cameraPosition={[0, 0, 5.5]} fov={45}>
            <RocketViewer vehicle={selectedVehicle} />
          </SpaceCanvas>

          {/* Over-Capacity Warning Banner on 3D Viewport */}
          {isOverCapacity && (
            <div className="absolute top-4 left-4 right-4 z-10 p-4 bg-red-950/95 border-2 border-red-500 rounded-2xl text-xs font-mono text-red-200 shadow-2xl backdrop-blur-md flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
                <div>
                  <strong className="text-white uppercase font-bold text-sm block">
                    {cadetMode ? '🚀 ROCKET IS TOO SMALL FOR YOUR SHIP!' : 'RED WARNING: PAYLOAD OVER CAPACITY'}
                  </strong>
                  <p className="text-xs text-red-200 mt-0.5">
                    Your probe weighs {resources.totalMass.toLocaleString()} kg, but this rocket can only lift {selectedVehicle.payloadCapacity.toLocaleString()} kg. Pick a bigger rocket below!
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.playSuccess();
                  autoBalanceMission();
                }}
                className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs shrink-0 shadow-lg"
              >
                AUTO-SELECT BIGGER ROCKET ✨
              </button>
            </div>
          )}

          {/* Rocket Telemetry Pill */}
          <div className="absolute bottom-4 left-4 right-4 z-10 p-3.5 bg-space-900/90 border border-slate-800 rounded-2xl backdrop-blur-md flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-400 uppercase">
                {cadetMode ? '🚀 Rocket Model' : 'LAUNCH VEHICLE'}
              </span>
              <div className="text-white font-bold">{selectedVehicle.name}</div>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase">
                {cadetMode ? '⚖️ Lifting Power' : 'PAYLOAD CAPACITY'}
              </span>
              <div className="text-cyan-400 font-bold telemetry-val">
                {selectedVehicle.payloadCapacity.toLocaleString()} kg
              </div>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase">
                {cadetMode ? '✅ Extra Weight Space' : 'PAYLOAD MARGIN'}
              </span>
              <div className={`font-bold telemetry-val ${isOverCapacity ? 'text-red-400' : 'text-emerald-400'}`}>
                {remainingCapacity >= 0 ? `+${remainingCapacity.toLocaleString()} kg Safe` : `${remainingCapacity.toLocaleString()} kg Over!`}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Rocket Selection Cards */}
        <div className="w-full lg:w-[420px] bg-space-900/90 border-t lg:border-t-0 lg:border-l border-slate-800/80 p-6 flex flex-col justify-between overflow-y-auto z-20 backdrop-blur-md">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-nasa-cyan uppercase tracking-widest font-bold">
                {cadetMode ? 'CHOOSE YOUR ROCKET LAUNCHER' : 'LAUNCH VEHICLES'}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                4 TIERS
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              {cadetMode 
                ? 'Your rocket must be strong enough to carry your probe into orbit. Bigger rockets carry heavier ships!'
                : 'Selecting an underpowered rocket causes launch aborts. Over-sized rockets eliminate mass anxiety but impose severe budgetary penalties.'}
            </p>

            <div className="space-y-3.5">
              {LAUNCH_VEHICLES.map((vehicle) => {
                const isSelected = selectedVehicle.id === vehicle.id;
                const vehicleRemaining = vehicle.payloadCapacity - resources.totalMass;
                const vehicleOver = vehicleRemaining < 0;

                return (
                  <div
                    key={vehicle.id}
                    onClick={() => {
                      sounds.playSelect();
                      selectLaunchVehicle(vehicle.id);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? (vehicleOver 
                            ? 'bg-red-950/50 border-red-500 shadow-lg shadow-red-500/20 ring-2 ring-red-500' 
                            : 'bg-space-850 border-nasa-orange shadow-lg shadow-nasa-orange/20 ring-2 ring-nasa-orange')
                        : 'bg-space-950/60 border-slate-800 hover:border-slate-700 hover:bg-space-850/40'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 font-bold uppercase">
                            {vehicle.tier}
                          </span>
                          <h4 className="font-display font-bold text-sm text-white">
                            {vehicle.name}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1">
                          {vehicle.description}
                        </p>
                      </div>

                      {isSelected && (
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${vehicleOver ? 'bg-red-600' : 'bg-nasa-orange'} text-white`}>
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-2 pt-2.5 mt-2.5 border-t border-slate-800 font-mono text-[11px]">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">
                          {cadetMode ? '⚖️ Capacity' : 'CAPACITY'}
                        </span>
                        <span className="text-cyan-400 font-bold telemetry-val">
                          {vehicle.payloadCapacity.toLocaleString()} kg
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">
                          {cadetMode ? '💰 Cost' : 'LAUNCH COST'}
                        </span>
                        <span className="text-emerald-400 font-bold telemetry-val">
                          ${vehicle.launchCost}M
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">
                          {cadetMode ? '🛡️ Safety' : 'RELIABILITY'}
                        </span>
                        <span className="text-purple-400 font-bold telemetry-val">
                          {vehicle.reliability}%
                        </span>
                      </div>
                    </div>

                    {/* Capacity Bar vs current spacecraft mass */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                        <span className="text-slate-400">
                          {cadetMode ? 'Rocket Weight Load' : 'PAYLOAD UTILIZATION'}
                        </span>
                        <span className={vehicleOver ? 'text-red-400 font-bold' : 'text-slate-300 font-bold'}>
                          {vehicleOver 
                            ? `TOO HEAVY (${Math.round((resources.totalMass / vehicle.payloadCapacity) * 100)}%)` 
                            : `${Math.round((resources.totalMass / vehicle.payloadCapacity) * 100)}% Safe`}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${vehicleOver ? 'bg-red-500' : 'bg-cyan-500'}`}
                          style={{ width: `${Math.min(100, (resources.totalMass / vehicle.payloadCapacity) * 100)}%` }}
                        />
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
              onClick={() => setStep('systems')}
              disabled={isOverCapacity}
              className={`w-full py-3.5 rounded-xl font-mono font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                isOverCapacity
                  ? 'bg-red-950/60 border border-red-500 text-red-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-nasa-orange to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-lg shadow-nasa-orange/20 cursor-pointer'
              }`}
            >
              <span>{isOverCapacity ? 'CHOOSE BIGGER ROCKET TO CONTINUE' : 'CONFIRM ROCKET & POWER UP SHIP ➔'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
