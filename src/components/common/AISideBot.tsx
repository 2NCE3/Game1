// AI Side Bot Companion: "NOVA-AI"
// A smart, encouraging, animated AI co-pilot that suggests good engineering decisions,
// explains space concepts in kid-friendly terms, and guides players step-by-step.

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  HelpCircle, 
  ChevronRight, 
  ChevronDown, 
  Wand2, 
  Volume2, 
  Zap, 
  Rocket, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb,
  X,
  MessageSquare,
  Bot
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { DESTINATIONS } from '../../data/missionsData';
import { sounds } from '../../utils/soundEffects';

interface BotSuggestion {
  id: string;
  type: 'action' | 'warning' | 'tip' | 'success';
  title: string;
  message: string;
  explanation: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const AISideBot: React.FC = () => {
  const { 
    state, 
    resources, 
    setStep, 
    selectBus, 
    togglePayload, 
    selectLaunchVehicle, 
    selectPowerSystem, 
    selectCommsSystem, 
    selectPropulsionSystem, 
    selectThermalSystem, 
    selectTrajectory,
    startSimulation,
    cadetMode 
  } = useMission();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'tips' | 'ask' | 'autobuild'>('tips');
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [hasNewTip, setHasNewTip] = useState(true);

  const destination = DESTINATIONS.find(d => d.id === state.destinationId) || DESTINATIONS[0];

  // Intelligent Contextual Suggestions based on player's current step and build state
  const suggestions: BotSuggestion[] = useMemo(() => {
    const list: BotSuggestion[] = [];

    // Destination phase
    if (state.currentStep === 'destination') {
      list.push({
        id: 'dest-moon-pick',
        type: 'tip',
        title: 'Start with the Moon! 🌙',
        message: 'The Moon is only 3 days away! It’s the best place for your first test flight.',
        explanation: 'Because the Moon is close, you need less fuel, a smaller rocket, and solar panels work great there!',
        actionLabel: 'Select Moon & Enter Hangar',
        onAction: () => {
          sounds.playSelect();
          setStep('hangar');
        }
      });
      return list;
    }

    // Hangar phase: Analyze spacecraft engineering trade-offs!
    if (state.currentStep === 'hangar') {
      // 1. Critical Mass Deficit
      if (resources.isOverMass) {
        list.push({
          id: 'fix-mass',
          type: 'warning',
          title: 'Your rocket is too heavy! ⚖️',
          message: `Your probe weighs ${resources.totalMass} kg, which is more than your rocket can lift!`,
          explanation: 'Real rockets need a Thrust-to-Weight ratio above 1.0 to climb into the sky. You can pick a bigger rocket or remove one tool.',
          actionLabel: 'Upgrade to Heavy Rocket 🚀',
          onAction: () => {
            sounds.playSuccess();
            selectLaunchVehicle('launch-heavy');
          }
        });
      }

      // 2. Critical Power Deficit
      if (resources.isPowerDeficit) {
        list.push({
          id: 'fix-power',
          type: 'warning',
          title: 'Not enough electricity! ⚡',
          message: `Your tools need ${resources.powerRequired}W, but you only make ${resources.powerGenerated}W.`,
          explanation: 'Instruments go offline if batteries drain! Add bigger solar arrays or a nuclear RTG generator.',
          actionLabel: 'Install Large Solar Array ☀️',
          onAction: () => {
            sounds.playSuccess();
            selectPowerSystem('power-large');
          }
        });
      }

      // 3. Critical Delta-V (Fuel) Deficit
      if (resources.isDeltaVDeficit) {
        list.push({
          id: 'fix-fuel',
          type: 'warning',
          title: 'Need more rocket fuel (Delta-V)! ⛽',
          message: `Trajectory needs ${resources.deltaVRequired} m/s, but you have ${resources.deltaVAvailable} m/s.`,
          explanation: 'Delta-V is the total speed change your engines can produce. Without enough fuel, you will fall short of the destination.',
          actionLabel: 'Switch to Hybrid Thruster 🚀',
          onAction: () => {
            sounds.playSuccess();
            selectPropulsionSystem('prop-hybrid');
          }
        });
      }

      // 4. Missing Payload Tools
      if (state.payloadIds.length === 0) {
        list.push({
          id: 'add-tools',
          type: 'action',
          title: 'Add science cameras & tools! 🔬',
          message: 'Your spacecraft has no instruments installed yet!',
          explanation: 'NASA sends probes to make scientific discoveries. Cameras take pictures, spectrometers find water ice, and radars map terrain.',
          actionLabel: 'Add Camera & Spectrometer 📸',
          onAction: () => {
            sounds.playSelect();
            togglePayload('inst-camera');
            togglePayload('inst-spectrometer');
          }
        });
      }

      // 5. Jupiter specific tip
      if (state.destinationId === 'jupiter' && state.powerSystemId?.includes('small')) {
        list.push({
          id: 'jupiter-power',
          type: 'tip',
          title: 'Jupiter is far from the Sun! 🪐',
          message: 'Solar panels receive 25x less sunlight at Jupiter than on Earth!',
          explanation: 'Consider installing a Nuclear Stirling RTG generator for steady power in the deep cold outer solar system.',
          actionLabel: 'Switch to Nuclear RTG ☢️',
          onAction: () => {
            sounds.playSuccess();
            selectPowerSystem('power-advanced');
          }
        });
      }

      // 6. New Eden Exodus tip
      if (state.destinationId === 'new-eden') {
        if (!state.payloadIds.includes('inst-seed-vault')) {
          list.push({
            id: 'new-eden-seed-vault',
            type: 'warning',
            title: 'Equip the Colony Seed Vault! 🌱',
            message: 'Humanity cannot colonize New Eden without the Biosphere Seed & Genome Vault!',
            explanation: 'The cryogenic vault stores plant seeds, agricultural crops, and genetic archives needed to restart civilization.',
            actionLabel: 'Add Colony Seed Vault 🌾',
            onAction: () => {
              sounds.playSuccess();
              togglePayload('inst-seed-vault');
            }
          });
        }
      }

      // 7. Good build praise!
      if (!resources.isOverMass && !resources.isPowerDeficit && !resources.isDeltaVDeficit && state.payloadIds.length > 0) {
        list.push({
          id: 'build-ready',
          type: 'success',
          title: 'Rocket design is nominal! 🌟',
          message: `Readiness Score: ${resources.readinessScore}%. All systems are green and ready for launch!`,
          explanation: 'Your mass is within launcher limits, electricity is balanced, and engines have plenty of fuel!',
          actionLabel: 'Launch to Pad! 🚀',
          onAction: () => {
            sounds.playLaunch();
            startSimulation();
          }
        });
      }
    }

    // Launch phase tips
    if (state.currentStep === 'simulation') {
      list.push({
        id: 'flight-tips',
        type: 'tip',
        title: 'Flight Director Secret! 🚀',
        message: 'Hold SPACE to throttle up! Between 10-18 km altitude, ease back to 50% throttle to survive Max-Q!',
        explanation: 'Max-Q is Maximum Aerodynamic Pressure: the thick air tries to crush the rocket as it breaks the sound barrier. Throttling down protects the airframe!',
      });
    }

    return list;
  }, [state, resources, selectLaunchVehicle, selectPowerSystem, selectPropulsionSystem, togglePayload, setStep, startSimulation]);

  // Cheerful sound when new suggestion pops up
  useEffect(() => {
    if (suggestions.length > 0) {
      setHasNewTip(true);
    }
  }, [suggestions.length, suggestions[0]?.id]);

  // Frequently Asked Questions for Kids & Cadets
  const FAQ = [
    {
      q: 'Why are we leaving Mars for New Eden?',
      a: 'After Earth was destroyed, humanity lived in the Ares Underground Colonies on Mars. But Mars life-support domes and groundwater reactors are failing! New Eden has real liquid oceans, magnetic shields, and clean breathable air — our true second home!'
    },
    {
      q: 'How do we land safely on New Eden?',
      a: 'First, the heat shield absorbs the roaring plasma heat of atmospheric entry. Then below 1,500 meters, fire your retro-thrusters (hold SPACE) to slow down below 5.0 m/s before touching the landing pad!'
    },
    {
      q: 'Why does my rocket shake or overheat?',
      a: 'When climbing through thick lower air (10-18 km), your rocket hits Max-Q (Maximum Dynamic Pressure)! If you go too fast in thick air, the wind pushes hard on the nose cone. Ease off the throttle to ~50% to pass through safely!'
    },
    {
      q: 'What is a "Gravity Turn"?',
      a: 'Instead of flying straight up forever, rockets gently tilt sideways toward the east! This lets planetary gravity curve flight into an orbit around the world.'
    },
    {
      q: 'Why do we drop the booster (Staging)?',
      a: 'Heavy empty fuel tanks are useless dead weight! Dropping Stage 1 makes the spacecraft much lighter, so the smaller upper stage engine can accelerate across space.'
    }
  ];

  // Auto-tune optimal build for the destination
  const handleAutoTuneBuild = () => {
    sounds.playSuccess();
    if (state.destinationId === 'new-eden') {
      selectBus('bus-heavy');
      togglePayload('inst-seed-vault');
      togglePayload('inst-camera');
      selectLaunchVehicle('launch-heavy');
      selectPowerSystem('power-advanced');
      selectCommsSystem('comms-laser');
      selectPropulsionSystem('prop-ion');
      selectThermalSystem('therm-pipes');
      selectTrajectory('traj-efficient');
      setIsOpen(false);
      return;
    }

    selectBus('bus-standard');
    togglePayload('inst-camera');
    togglePayload('inst-spectrometer');
    if (state.destinationId === 'jupiter') {
      selectLaunchVehicle('launch-heavy');
      selectPowerSystem('power-advanced');
    } else if (state.destinationId === 'mars') {
      selectLaunchVehicle('launch-medium');
      selectPowerSystem('power-large');
    } else {
      selectLaunchVehicle('launch-medium');
      selectPowerSystem('power-medium');
    }
    selectCommsSystem('comms-high');
    selectPropulsionSystem('prop-hybrid');
    selectThermalSystem('therm-pipes');
    selectTrajectory('traj-balanced');
    setIsOpen(false);
  };

  const primarySuggestion = suggestions[0];

  return (
    <>
      {/* ─── FLOATING BOT COMPANION (COMPACT CIRCLE BUBBLE ON LEFT SIDE) ─────────────── */}
      <div className={`fixed z-40 select-none print:hidden ${
        state.currentStep === 'hangar' 
          ? 'bottom-24 left-3 sm:bottom-28 sm:left-[88px]' 
          : 'bottom-24 left-4 sm:bottom-28 sm:left-6'
      }`}>
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="relative"
        >
          {/* Animated notification ping */}
          {hasNewTip && !isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 z-10">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 border border-white/20 text-[9px] font-bold text-white items-center justify-center shadow-sm">
                !
              </span>
            </span>
          )}

          <button
            onClick={() => {
              sounds.playClick();
              setIsOpen(prev => !prev);
              setHasNewTip(false);
            }}
            className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#070913]/90 hover:bg-[#0c1222] border-2 border-red-500/40 hover:border-red-500 text-white shadow-xl shadow-red-950/40 backdrop-blur-xl flex items-center justify-center cursor-pointer group transition-all duration-200 ring-2 ring-red-500/20 hover:ring-red-500/40"
            title="Open NOVA-9 AI Assistant"
            aria-label="Open NOVA-9 AI Assistant"
          >
            {/* Cute Animated Bot Face in Circular Bubble */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 via-rose-600 to-cyan-500 flex items-center justify-center text-base shadow-sm group-hover:scale-110 transition-transform">
              🤖
            </div>
          </button>
        </motion.div>
      </div>

      {/* ─── EXPANDED BOT CHAT & ASSISTANT MODAL (ANCHORED SAFELY ABOVE BUBBLE) ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`fixed z-50 w-[calc(100vw-24px)] sm:w-[380px] max-w-[390px] max-h-[calc(100vh-160px)] sm:max-h-[500px] bg-[#070913]/98 border border-red-500/30 rounded-3xl shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden ring-4 ring-red-500/10 select-none print:hidden ${
              state.currentStep === 'hangar'
                ? 'bottom-40 left-3 sm:bottom-44 sm:left-[88px]'
                : 'bottom-40 left-4 sm:bottom-44 sm:left-6'
            }`}
          >
            {/* Bot Header */}
            <div className="p-4 bg-gradient-to-r from-space-900 via-cyan-950/40 to-space-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-2xl animate-bounce">
                  🤖
                </div>
                <div>
                  <h3 className="font-display font-black text-sm text-white flex items-center gap-1.5">
                    <span>NOVA-9 AI SMART BOT</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                      ONLINE
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    NASA Flight Systems AI Co-Pilot
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.playClick();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800 bg-space-900/60 font-mono text-xs">
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('tips');
                }}
                className={`flex-1 py-2 text-center font-bold transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                  activeTab === 'tips'
                    ? 'border-nasa-cyan text-nasa-cyan bg-space-850'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>SMART TIPS ({suggestions.length})</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('ask');
                }}
                className={`flex-1 py-2 text-center font-bold transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                  activeTab === 'ask'
                    ? 'border-nasa-cyan text-nasa-cyan bg-space-850'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>ASK BOT ❓</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('autobuild');
                }}
                className={`flex-1 py-2 text-center font-bold transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                  activeTab === 'autobuild'
                    ? 'border-nasa-cyan text-nasa-cyan bg-space-850'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                <span>AUTO-TUNE</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[380px]">
              {/* TAB 1: Smart Contextual Tips */}
              {activeTab === 'tips' && (
                <div className="space-y-3">
                  {suggestions.map((sug) => {
                    const isWarn = sug.type === 'warning';
                    const isSuccess = sug.type === 'success';

                    return (
                      <div
                        key={sug.id}
                        className={`p-3.5 rounded-2xl border text-xs font-sans transition-all ${
                          isWarn
                            ? 'bg-amber-950/40 border-amber-500/60 ring-2 ring-amber-500/10'
                            : isSuccess
                            ? 'bg-emerald-950/40 border-emerald-500/60'
                            : 'bg-space-900 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold mb-1">
                          {isWarn ? (
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                          ) : isSuccess ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Lightbulb className="w-4 h-4 text-nasa-cyan" />
                          )}
                          <span className={isWarn ? 'text-amber-300' : isSuccess ? 'text-emerald-300' : 'text-white'}>
                            {sug.title}
                          </span>
                        </div>

                        <p className="text-slate-200 font-medium leading-relaxed">
                          {sug.message}
                        </p>

                        <div className="p-2.5 mt-2 rounded-xl bg-space-950/70 border border-slate-800/80 text-[11px] text-slate-400 font-sans italic">
                          💡 <strong>Why this matters:</strong> {sug.explanation}
                        </div>

                        {sug.actionLabel && sug.onAction && (
                          <button
                            onClick={() => {
                              sug.onAction?.();
                            }}
                            className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-nasa-cyan via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>{sug.actionLabel}</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 2: Ask Bot / Science FAQs for Kids */}
              {activeTab === 'ask' && (
                <div className="space-y-2">
                  <div className="text-[11px] text-slate-400 font-mono mb-2">
                    Click any space engineering question to learn:
                  </div>

                  {FAQ.map((item, idx) => {
                    const isSelected = selectedQuestion === item.q;
                    return (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-800 bg-space-900/80 overflow-hidden text-xs"
                      >
                        <button
                          onClick={() => {
                            sounds.playClick();
                            setSelectedQuestion(isSelected ? null : item.q);
                          }}
                          className="w-full p-3 text-left font-bold text-white hover:text-nasa-cyan flex items-center justify-between gap-2"
                        >
                          <span>{item.q}</span>
                          <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'rotate-180 text-nasa-cyan' : 'text-slate-500'}`} />
                        </button>

                        {isSelected && (
                          <div className="p-3 bg-space-950 border-t border-slate-800 text-slate-300 leading-relaxed font-sans text-xs">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 3: Auto-Tune Assistant */}
              {activeTab === 'autobuild' && (
                <div className="p-4 rounded-2xl bg-space-900 border border-slate-800 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl mx-auto">
                    🪄
                  </div>
                  <h4 className="font-display font-black text-sm text-white">
                    Need help with the perfect ship?
                  </h4>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    NOVA-9 can assemble a balanced configuration tuned specifically for <strong>{destination.name}</strong>, with safe mass margins, optimal solar power, and sufficient Delta-V fuel!
                  </p>
                  <button
                    onClick={handleAutoTuneBuild}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>APPLY BALANCED BUILD FOR {destination.name.toUpperCase()} ✨</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
