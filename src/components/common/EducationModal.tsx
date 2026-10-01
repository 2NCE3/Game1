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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#121217] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col font-sans">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-[#0071e3] dark:text-blue-400 flex items-center justify-center text-xl">
              👨‍🚀
            </div>
            <div>
              <h3 className="font-semibold text-white text-base tracking-tight flex items-center gap-2">
                <span>Cadet Spaceflight Handbook</span>
              </h3>
              <p className="text-xs text-[#86868b]">
                2026 NASA Space Apps Challenge · Space Mission Design Guide
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 bg-black/20 px-6 pt-2 gap-4 text-xs">
          <button
            onClick={() => setTab('cadet')}
            className={`pb-2.5 font-medium transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              tab === 'cadet'
                ? 'border-[#0071e3] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Cadet & Visual Guide</span>
          </button>
          <button
            onClick={() => setTab('aerospace')}
            className={`pb-2.5 font-medium transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              tab === 'aerospace'
                ? 'border-[#0071e3] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Engineering Specifications</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {tab === 'cadet' ? (
            <>
              {/* Cadet Mission Story */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                <h4 className="text-blue-400 font-semibold text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>The Story: What is your mission?</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Deep in space, secrets are waiting to be uncovered. NASA asks: Is there water ice on the Moon? Did life ever exist on Mars? What lies beneath Europa’s frozen crust?
                  <br /><br />
                  As the <strong>Chief Mission Commander</strong>, you design a robotic starship, integrate scientific sensors, choose a launch vehicle, and navigate interplanetary space.
                </p>
              </div>

              {/* The 8 Simple Steps */}
              <div>
                <h4 className="text-xs text-[#86868b] uppercase tracking-wider mb-3 font-semibold">
                  Flight Architecture in 8 Steps
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-3">
                    <span className="text-xl">🎯</span>
                    <div>
                      <div className="font-semibold text-white text-xs">Step 1 · Mission Goal</div>
                      <div className="text-[11px] text-slate-400">Choose what scientific mystery to investigate.</div>
                    </div>
                  </div>

                  <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-3">
                    <span className="text-xl">🪐</span>
                    <div>
                      <div className="font-semibold text-white text-xs">Step 2 · Target World</div>
                      <div className="text-[11px] text-slate-400">Pick where your spacecraft will travel.</div>
                    </div>
                  </div>

                  <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-3">
                    <span className="text-xl">🛰️</span>
                    <div>
                      <div className="font-semibold text-white text-xs">Step 3 · Spacecraft Body</div>
                      <div className="text-[11px] text-slate-400">Select structural chassis to house avionics.</div>
                    </div>
                  </div>

                  <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-3">
                    <span className="text-xl">🔬</span>
                    <div>
                      <div className="font-semibold text-white text-xs">Step 4 · Science Tools</div>
                      <div className="text-[11px] text-slate-400">Add spectrometers, cameras, and radar sensors.</div>
                    </div>
                  </div>

                  <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-3">
                    <span className="text-xl">🚀</span>
                    <div>
                      <div className="font-semibold text-white text-xs">Step 5 · Rocket Vehicle</div>
                      <div className="text-[11px] text-slate-400">Select a launcher with sufficient payload margin.</div>
                    </div>
                  </div>

                  <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-3">
                    <span className="text-xl">⚡</span>
                    <div>
                      <div className="font-semibold text-white text-xs">Step 6 · Power & Comms</div>
                      <div className="text-[11px] text-slate-400">Install solar arrays and telemetry dishes.</div>
                    </div>
                  </div>

                  <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-3">
                    <span className="text-xl">🗺️</span>
                    <div>
                      <div className="font-semibold text-white text-xs">Step 7 · Flight Path</div>
                      <div className="text-[11px] text-slate-400">Chart direct transfer or gravity-assist slingshots.</div>
                    </div>
                  </div>

                  <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-3">
                    <span className="text-xl">✔️</span>
                    <div>
                      <div className="font-semibold text-white text-xs">Step 8 · Launch & Fly</div>
                      <div className="text-[11px] text-slate-400">Execute count and pilot spacecraft to destination.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Golden Rules */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold text-xs">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>The 3 Fundamental Rules of Space Design</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5">
                  <li><strong>1. Weight (Mass):</strong> Your spaceship cannot exceed the payload capacity of your rocket.</li>
                  <li><strong>2. Power (Sunlight):</strong> Near Earth, solar panels generate high flux. Far out at deep-space targets, radioisotope generators (RTGs) provide constant power.</li>
                  <li><strong>3. Budget:</strong> Keep total subsystem costs within NASA mission appropriations.</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* Technical Engineering Specifications */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                <h4 className="text-blue-400 font-semibold text-xs uppercase tracking-wider mb-1">
                  Aerospace Engineering Grounding
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  MissionForge uses deterministic aerospace calculations grounded in real NASA mission parameters. The Tsiolkovsky rocket equation, inverse-square solar radiation laws (1/r²), and Deep Space Network (DSN) link budgets govern every mission outcome.
                </p>
              </div>

              <div>
                <h4 className="text-xs text-[#86868b] uppercase tracking-wider mb-3 font-semibold">
                  Trade-Off Formulations
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl">
                    <strong className="text-white block mb-0.5">Mass Margin:</strong>
                    <span className="text-slate-400">Total Wet Mass = Bus + Payload + Power + Comms + Thermal + Propellant Dry & Wet Mass &le; Rocket Injection Limit.</span>
                  </div>

                  <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl">
                    <strong className="text-white block mb-0.5">Solar Flux Decay:</strong>
                    <span className="text-slate-400">Solar irradiance at Jupiter (5.2 AU) falls to ~3.7% of 1 AU solar constant (1361 W/m²). High-efficiency RTG radioisotope systems are required.</span>
                  </div>

                  <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl">
                    <strong className="text-white block mb-0.5">DSN Telemetry Link:</strong>
                    <span className="text-slate-400">Low-gain omni antennas experience carrier dropouts beyond cislunar space. Deep space High-Gain Cassegrain dish or Optical Laser arrays prevent science data bottlenecks.</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white/[0.02] border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              sounds.playSelect();
              onClose();
              onStartDemo();
            }}
            className="px-5 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Try Demo Mission</span>
          </button>
        </div>
      </div>
    </div>
  );
};
