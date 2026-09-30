import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Radio, 
  Fuel, 
  Thermometer, 
  Check, 
  AlertTriangle, 
  ArrowRight, 
  Gauge, 
  Activity,
  Wifi,
  Sparkles,
  Wand2
} from 'lucide-react';
import { 
  POWER_SYSTEMS, 
  COMMS_SYSTEMS, 
  PROPULSION_SYSTEMS, 
  THERMAL_SYSTEMS,
  DESTINATIONS
} from '../../data/missionsData';
import { useMission } from '../../context/MissionContext';
import { CadetGuideBanner } from '../common/CadetGuideBanner';
import { sounds } from '../../utils/soundEffects';

type SystemTab = 'power' | 'comms' | 'propulsion' | 'thermal';

export const Screen06Systems: React.FC = () => {
  const { 
    state, 
    resources, 
    selectPowerSystem, 
    selectCommsSystem, 
    selectPropulsionSystem, 
    selectThermalSystem,
    setStep,
    cadetMode,
    autoBalanceMission,
    goToNextStep,
    goToPrevStep
  } = useMission();

  const [activeTab, setActiveTab] = useState<SystemTab>('power');

  const currentPower = POWER_SYSTEMS.find(p => p.id === state.powerSystemId) || POWER_SYSTEMS[1];
  const currentComms = COMMS_SYSTEMS.find(c => c.id === state.commsSystemId) || COMMS_SYSTEMS[2];
  const currentProp = PROPULSION_SYSTEMS.find(p => p.id === state.propulsionSystemId) || PROPULSION_SYSTEMS[2];
  const currentTherm = THERMAL_SYSTEMS.find(t => t.id === state.thermalSystemId) || THERMAL_SYSTEMS[1];
  const destination = DESTINATIONS.find(d => d.id === state.destinationId) || DESTINATIONS[0];

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-space-950">
      {/* Friendly Cadet Step Banner */}
      <CadetGuideBanner
        currentStep="systems"
        stepNumber={6}
        totalSteps={8}
        title="Power & Subsystems"
        childQuestion="Let's power up your ship and set up your deep space radio!"
        childTip="Tip: Solar panels generate electricity for your instruments. Make sure your power reserve is green (+20% or more)!"
        onNext={goToNextStep}
        onPrev={goToPrevStep}
      />

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6 overflow-x-auto">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('power');
            }}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'power'
                ? 'bg-amber-950/70 border-2 border-amber-500 text-amber-300 shadow-md shadow-amber-500/20'
                : 'bg-space-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{cadetMode ? '⚡ 1. SOLAR POWER' : '1. POWER GENERATION'}</span>
            {resources.isPowerDeficit && (
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            )}
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('comms');
            }}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'comms'
                ? 'bg-blue-950/70 border-2 border-blue-500 text-blue-300 shadow-md shadow-blue-500/20'
                : 'bg-space-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-4 h-4 text-blue-400" />
            <span>{cadetMode ? '📡 2. RADIO DISH' : '2. COMMUNICATIONS'}</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('propulsion');
            }}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'propulsion'
                ? 'bg-orange-950/70 border-2 border-orange-500 text-orange-300 shadow-md shadow-orange-500/20'
                : 'bg-space-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Fuel className="w-4 h-4 text-orange-400" />
            <span>{cadetMode ? '🚀 3. ENGINES & FUEL' : '3. PROPULSION & DELTA-V'}</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('thermal');
            }}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'thermal'
                ? 'bg-cyan-950/70 border-2 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/20'
                : 'bg-space-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Thermometer className="w-4 h-4 text-cyan-400" />
            <span>{cadetMode ? '❄️ 4. HEAT COOLING' : '4. THERMAL CONTROL'}</span>
          </button>
        </div>

        {/* ================= TAB 1: POWER ================= */}
        {activeTab === 'power' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border ${
              resources.isPowerDeficit 
                ? 'bg-red-950/50 border-red-500/80 shadow-lg shadow-red-500/20' 
                : 'bg-space-900/80 border-slate-800'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                    {cadetMode ? '⚡ ELECTRICAL HEALTH STATUS' : 'ELECTRICAL LINK BUDGET'}
                  </span>
                  <h3 className="font-display font-bold text-lg text-white">
                    {cadetMode ? 'Electricity Generation vs Sensor Usage' : 'Power Generation vs Operating Consumption'}
                  </h3>
                </div>

                {resources.isPowerDeficit ? (
                  <div className="px-3.5 py-2 rounded-xl bg-red-900/90 border border-red-500 text-red-200 font-mono text-xs font-bold flex items-center gap-2 animate-pulse">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>NOT ENOUGH POWER: {(resources.powerRequired - resources.powerGenerated)}W SHORT!</span>
                  </div>
                ) : (
                  <div className="px-3.5 py-2 rounded-xl bg-emerald-950/70 border border-emerald-500 text-emerald-300 font-mono text-xs font-bold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>PLENTY OF ELECTRICITY: +{resources.powerReservePercent}% SAFE</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs mb-3">
                <div className="p-3 bg-space-950/70 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block">POWER GENERATED</span>
                  <span className="text-amber-400 font-bold text-base telemetry-val">
                    {(resources.powerGenerated / 1000).toFixed(2)} kW ({resources.powerGenerated}W)
                  </span>
                </div>
                <div className="p-3 bg-space-950/70 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block">POWER CONSUMED</span>
                  <span className="text-cyan-400 font-bold text-base telemetry-val">
                    {(resources.powerRequired / 1000).toFixed(2)} kW ({resources.powerRequired}W)
                  </span>
                </div>
                <div className="p-3 bg-space-950/70 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block">EXTRA SAFETY BUFFER</span>
                  <span className={`font-bold text-base telemetry-val ${
                    resources.isPowerDeficit ? 'text-red-400' : (resources.powerReservePercent < 20 ? 'text-amber-400' : 'text-emerald-400')
                  }`}>
                    {resources.powerReservePercent}%
                  </span>
                </div>
              </div>
            </div>

            {/* Power Options Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {POWER_SYSTEMS.map((power) => {
                const isSelected = (state.powerSystemId || 'power-medium') === power.id;

                return (
                  <div
                    key={power.id}
                    onClick={() => selectPowerSystem(power.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-space-850 border-amber-500 shadow-lg shadow-amber-500/15 ring-2 ring-amber-500'
                        : 'bg-space-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="text-[9px] font-mono text-amber-400 font-bold uppercase">
                            {power.type} GENERATOR
                          </span>
                          <h4 className="font-display font-bold text-sm text-white">
                            {power.name}
                          </h4>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mb-3">
                        {power.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-2.5 border-t border-slate-800 font-mono text-[11px]">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">OUTPUT</span>
                        <span className="text-amber-400 font-bold telemetry-val">+{power.generatedWatts}W</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">WEIGHT</span>
                        <span className="text-cyan-400 font-bold telemetry-val">+{power.mass} kg</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">COST</span>
                        <span className="text-emerald-400 font-bold telemetry-val">+${power.cost}M</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">SAFETY</span>
                        <span className="text-purple-400 font-bold telemetry-val">{power.reliability}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 2: COMMUNICATIONS ================= */}
        {activeTab === 'comms' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-space-900/80 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] font-mono text-nasa-cyan uppercase tracking-widest font-bold">
                    {cadetMode ? 'DEEP SPACE RADIO CALLS' : 'DEEP SPACE NETWORK (DSN) LINK'}
                  </span>
                  <h3 className="font-display font-bold text-lg text-white">
                    {cadetMode ? 'Talking Back to Earth Ground Stations' : 'Ground Station Uplink / Downlink Capability'}
                  </h3>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-950/70 border border-blue-500 text-blue-200 font-mono text-xs font-bold">
                  <Wifi className="w-4 h-4 text-blue-400 animate-pulse" />
                  <span>DATA SPEED: {currentComms.dataRateMbps} Mbps</span>
                </div>
              </div>

              {/* Earth <---> Spacecraft Link Visualizer */}
              <div className="p-4 bg-space-950/80 border border-slate-800/80 rounded-xl flex items-center justify-between font-mono text-xs">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-400 flex items-center justify-center mx-auto mb-1 text-lg">
                    🌍
                  </div>
                  <div className="font-bold text-white text-[11px]">EARTH (NASA)</div>
                  <div className="text-[10px] text-slate-400">Deep Space Antennas</div>
                </div>

                <div className="flex-1 mx-6 flex flex-col items-center">
                  <div className="text-[10px] text-nasa-cyan font-bold mb-1">
                    Radio Speed: {currentComms.dataRateMbps} Mbps • Call Delay: {destination.commDelay}
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-nasa-cyan to-blue-500 animate-pulse" />
                  </div>
                  <div className="text-[9px] text-slate-400 mt-1">
                    Signal Quality: {currentComms.signalReliability}% Clear
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-purple-600/30 border border-purple-400 flex items-center justify-center mx-auto mb-1 text-lg">
                    🛰️
                  </div>
                  <div className="font-bold text-white text-[11px]">YOUR PROBE</div>
                  <div className="text-[10px] text-slate-400">{currentComms.name.split(' ')[0]}</div>
                </div>
              </div>
            </div>

            {/* Cards for Comms Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {COMMS_SYSTEMS.map((comms) => {
                const isSelected = (state.commsSystemId || 'comms-high') === comms.id;

                return (
                  <div
                    key={comms.id}
                    onClick={() => selectCommsSystem(comms.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-space-850 border-blue-500 shadow-lg shadow-blue-500/15 ring-2 ring-blue-500'
                        : 'bg-space-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="text-[9px] font-mono text-blue-400 font-bold uppercase">
                            {comms.type.replace('_', ' ')}
                          </span>
                          <h4 className="font-display font-bold text-sm text-white">
                            {comms.name}
                          </h4>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mb-3">
                        {comms.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-2.5 border-t border-slate-800 font-mono text-[11px]">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">SPEED</span>
                        <span className="text-blue-400 font-bold telemetry-val">{comms.dataRateMbps} Mbps</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">WEIGHT</span>
                        <span className="text-cyan-400 font-bold telemetry-val">+{comms.mass} kg</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">COST</span>
                        <span className="text-emerald-400 font-bold telemetry-val">+${comms.cost}M</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">SIGNAL</span>
                        <span className="text-purple-400 font-bold telemetry-val">{comms.signalReliability}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 3: PROPULSION ================= */}
        {activeTab === 'propulsion' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-space-900/80 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] font-mono text-nasa-orange uppercase tracking-widest font-bold">
                    {cadetMode ? '🚀 ROCKET THRUSTERS & FUEL' : 'PROPULSION & DELTA-V'}
                  </span>
                  <h3 className="font-display font-bold text-lg text-white">
                    {cadetMode ? 'How Far & Fast Can Your Engines Push?' : 'Maneuvering Velocity (Delta-V)'}
                  </h3>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl bg-orange-950/70 border border-orange-500 text-orange-200 font-mono text-xs font-bold">
                  DELIVERED PUSH: {currentProp.deltaV} m/s
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 bg-space-950/70 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block">
                    {cadetMode ? '🚀 Engine Push (Delta-V)' : 'DELTA-V DELIVERED'}
                  </span>
                  <span className="text-orange-400 font-bold text-base telemetry-val">{currentProp.deltaV} m/s</span>
                </div>
                <div className="p-3 bg-space-950/70 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block">
                    {cadetMode ? '⛽ Fuel Tank Weight' : 'PROPELLANT WET MASS'}
                  </span>
                  <span className="text-cyan-400 font-bold text-base telemetry-val">{currentProp.fuelMass.toLocaleString()} kg</span>
                </div>
                <div className="p-3 bg-space-950/70 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block">
                    {cadetMode ? '💡 Fuel Efficiency' : 'SPECIFIC IMPULSE (ISP)'}
                  </span>
                  <span className="text-purple-400 font-bold text-base telemetry-val">{currentProp.isp} seconds</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PROPULSION_SYSTEMS.map((prop) => {
                const isSelected = (state.propulsionSystemId || 'prop-hybrid') === prop.id;

                return (
                  <div
                    key={prop.id}
                    onClick={() => selectPropulsionSystem(prop.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-space-850 border-orange-500 shadow-lg shadow-orange-500/15 ring-2 ring-orange-500'
                        : 'bg-space-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="text-[9px] font-mono text-orange-400 font-bold uppercase">
                            {prop.efficiency} EFFICIENCY
                          </span>
                          <h4 className="font-display font-bold text-sm text-white">
                            {prop.name}
                          </h4>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mb-3">
                        {prop.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-800 font-mono text-[11px]">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">DELTA-V</span>
                        <span className="text-orange-400 font-bold telemetry-val">+{prop.deltaV} m/s</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">FUEL WEIGHT</span>
                        <span className="text-cyan-400 font-bold telemetry-val">+{prop.fuelMass} kg</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 4: THERMAL ================= */}
        {activeTab === 'thermal' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-space-900/80 border border-slate-800">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                {cadetMode ? '❄️ KEEPING COOL IN SPACE' : 'THERMAL REJECTION SYSTEM'}
              </span>
              <h3 className="font-display font-bold text-lg text-white mb-2">
                Heat Pipes & Cold Radiator Blankets
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                In space vacuum, sunlight boils computers and shadow freezes them. Gold foil insulation and heat pipes keep your computers at cozy room temperature!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {THERMAL_SYSTEMS.map((therm) => {
                const isSelected = (state.thermalSystemId || 'therm-pipes') === therm.id;

                return (
                  <div
                    key={therm.id}
                    onClick={() => selectThermalSystem(therm.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-space-850 border-cyan-500 shadow-lg shadow-cyan-500/15 ring-2 ring-cyan-500'
                        : 'bg-space-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-display font-bold text-sm text-white">
                          {therm.name}
                        </h4>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-cyan-500 text-black flex items-center justify-center font-bold">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mb-3">
                        {therm.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-800 font-mono text-[11px]">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">WEIGHT</span>
                        <span className="text-cyan-400 font-bold telemetry-val">+{therm.mass} kg</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">COST</span>
                        <span className="text-emerald-400 font-bold telemetry-val">+${therm.cost}M</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">SAFETY</span>
                        <span className="text-purple-400 font-bold telemetry-val">{therm.reliability}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Proceed Action */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs font-mono text-slate-400">
            {cadetMode ? '✓ Power, radio, engine, and cooling systems locked!' : 'All 4 critical subsystems active'}
          </div>

          <button
            onClick={() => setStep('trajectory')}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-nasa-orange to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-nasa-orange/20 flex items-center gap-2 cursor-pointer"
          >
            <span>CONFIRM SYSTEMS & PLOT FLIGHT ROUTE ➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};
