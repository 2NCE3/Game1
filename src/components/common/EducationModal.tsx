import React, { useState } from 'react';
import { Rocket, ShieldCheck, Cpu, Radio, Zap, X, Award, CheckCircle2, Sparkles, Star, Compass } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDemo: () => void;
}

export const EducationModal: React.FC<EducationModalProps> = ({
  isOpen,
  onClose,
  onStartDemo
}) => {
  const [tab, setTab] = useState<'cadet' | 'aerospace'>('cadet');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-space-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-space-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-nasa-orange/20 border border-nasa-orange/40 text-nasa-orange flex items-center justify-center text-xl">
              👨‍🚀
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-base tracking-wide flex items-center gap-2">
                <span>CADET SPACEFLIGHT HANDBOOK</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                2026 NASA Space Apps Challenge — Space Mission Design Game
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-space-950/60 px-6 pt-2 gap-4 text-xs font-mono">
          <button
            onClick={() => setTab('cadet')}
            className={`pb-2.5 font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              tab === 'cadet'
                ? 'border-nasa-orange text-nasa-orange'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🌟 KIDS & CADET GUIDE</span>
          </button>
          <button
            onClick={() => setTab('aerospace')}
            className={`pb-2.5 font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              tab === 'aerospace'
                ? 'border-nasa-cyan text-nasa-cyan'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🔬 ENGINEERING SPECIFICATIONS</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300 font-sans">
          {tab === 'cadet' ? (
            <>
              {/* Cadet Mission Story */}
              <div className="bg-space-850 p-4 rounded-2xl border border-nasa-orange/30">
                <h4 className="text-nasa-orange font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>The Story: What is your mission?</span>
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Deep in space, secrets are waiting to be uncovered! NASA wants to know: Is there water ice on the Moon? Did life ever exist on Mars? What lies beneath Europa’s frozen crust?
                  <br /><br />
                  As the <strong>Chief Mission Commander</strong>, you will build a robotic space probe, pick its science tools, strap it to a giant rocket, and fly across the solar system!
                </p>
              </div>

              {/* The 8 Simple Steps */}
              <div>
                <h4 className="font-mono text-xs text-slate-400 uppercase tracking-widest mb-3">
                  Your 8-Step Space Journey
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 bg-space-950/60 border border-slate-800 rounded-xl flex items-center gap-3">
                    <span className="text-xl">🎯</span>
                    <div>
                      <div className="font-bold text-white text-xs">Step 1: Mission Goal</div>
                      <div className="text-[11px] text-slate-400">Choose what secret you want to investigate.</div>
                    </div>
                  </div>

                  <div className="p-3 bg-space-950/60 border border-slate-800 rounded-xl flex items-center gap-3">
                    <span className="text-xl">🪐</span>
                    <div>
                      <div className="font-bold text-white text-xs">Step 2: Target Planet</div>
                      <div className="text-[11px] text-slate-400">Pick where your spacecraft will travel.</div>
                    </div>
                  </div>

                  <div className="p-3 bg-space-950/60 border border-slate-800 rounded-xl flex items-center gap-3">
                    <span className="text-xl">🛰️</span>
                    <div>
                      <div className="font-bold text-white text-xs">Step 3: Spacecraft Body</div>
                      <div className="text-[11px] text-slate-400">Choose the chassis that holds your computers.</div>
                    </div>
                  </div>

                  <div className="p-3 bg-space-950/60 border border-slate-800 rounded-xl flex items-center gap-3">
                    <span className="text-xl">🔬</span>
                    <div>
                      <div className="font-bold text-white text-xs">Step 4: Science Tools</div>
                      <div className="text-[11px] text-slate-400">Add HD cameras, lasers, and radar scanners.</div>
                    </div>
                  </div>

                  <div className="p-3 bg-space-950/60 border border-slate-800 rounded-xl flex items-center gap-3">
                    <span className="text-xl">🚀</span>
                    <div>
                      <div className="font-bold text-white text-xs">Step 5: Rocket Ship</div>
                      <div className="text-[11px] text-slate-400">Pick a rocket strong enough to lift the weight.</div>
                    </div>
                  </div>

                  <div className="p-3 bg-space-950/60 border border-slate-800 rounded-xl flex items-center gap-3">
                    <span className="text-xl">⚡</span>
                    <div>
                      <div className="font-bold text-white text-xs">Step 6: Power & Radio</div>
                      <div className="text-[11px] text-slate-400">Add solar wings and radio dishes to talk to Earth.</div>
                    </div>
                  </div>

                  <div className="p-3 bg-space-950/60 border border-slate-800 rounded-xl flex items-center gap-3">
                    <span className="text-xl">🗺️</span>
                    <div>
                      <div className="font-bold text-white text-xs">Step 7: Flight Path</div>
                      <div className="text-[11px] text-slate-400">Chart a fast path or a fuel-saving path.</div>
                    </div>
                  </div>

                  <div className="p-3 bg-space-950/60 border border-slate-800 rounded-xl flex items-center gap-3">
                    <span className="text-xl">✔️</span>
                    <div>
                      <div className="font-bold text-white text-xs">Step 8: Blast Off!</div>
                      <div className="text-[11px] text-slate-400">Run the countdown and launch into space!</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Golden Rules */}
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>The 3 Rules of Rocket Science</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5">
                  <li><strong>1. ⚖️ Weight (Mass):</strong> Your spaceship can't weigh more than what your rocket is able to lift into orbit.</li>
                  <li><strong>2. 🔋 Power (Sunlight):</strong> Near Earth, solar panels are super bright. But far out at Jupiter, the Sun is weak, so we need nuclear space batteries (RTGs)!</li>
                  <li><strong>3. 💰 Budget:</strong> Don't spend more money than NASA gave you!</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* Technical Engineering Specifications */}
              <div className="bg-space-850 p-4 rounded-2xl border border-nasa-cyan/20">
                <h4 className="text-nasa-cyan font-mono font-semibold text-xs uppercase tracking-wider mb-1">
                  Aerospace Engineering Physics
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  MISSIONFORGE uses deterministic aerospace calculations grounded in real NASA mission parameters. The Tsiolkovsky rocket equation, inverse-square solar radiation laws (1/r²), and Deep Space Network (DSN) link budgets govern every mission outcome.
                </p>
              </div>

              <div>
                <h4 className="font-mono text-xs text-slate-400 uppercase tracking-widest mb-3">
                  Trade-Off Formulations
                </h4>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-3 bg-space-950/60 border border-slate-800 rounded-xl">
                    <strong className="text-white block">Mass Margin:</strong>
                    <span className="text-slate-400">Total Wet Mass = Bus + Payload + Power + Comms + Thermal + Propellant Dry & Wet Mass &le; Rocket Injection Limit.</span>
                  </div>

                  <div className="p-3 bg-space-950/60 border border-slate-800 rounded-xl">
                    <strong className="text-white block">Solar Flux Decay:</strong>
                    <span className="text-slate-400">Solar irradiance at Jupiter (5.2 AU) falls to ~3.7% of 1 AU solar constant (1361 W/m²). High-efficiency RTG radioisotope systems are required.</span>
                  </div>

                  <div className="p-3 bg-space-950/60 border border-slate-800 rounded-xl">
                    <strong className="text-white block">DSN Telemetry Link:</strong>
                    <span className="text-slate-400">Low-gain omni antennas experience carrier dropouts beyond cislunar space. Deep space High-Gain Cassegrain dish or Optical Laser arrays prevent science data bottlenecks.</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-space-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-mono text-xs transition-colors"
          >
            CLOSE
          </button>
          <button
            onClick={() => {
              sounds.playSelect();
              onClose();
              onStartDemo();
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-nasa-orange to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-mono font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-nasa-orange/20 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>TRY DEMO MISSION (3 MIN)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
