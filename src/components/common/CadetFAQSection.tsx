import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '../../utils/soundEffects';

interface FAQItem {
  question: string;
  answer: string;
  badge: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    badge: 'ACCESSIBILITY',
    question: 'Is this simulator suitable for younger cadets aged 10 and above?',
    answer: 'Yes. Cadet Mode features high-contrast visual gauges, automated mass checks, and clear guidance from Commander Nova-9. A cadet can assemble a functional spacecraft and initiate flight in under two minutes without advanced engineering prerequisites.'
  },
  {
    badge: 'NASA GROUNDING',
    question: 'Where is the underlying planetary and propulsion physics derived from?',
    answer: 'Planetary parameters (gravitational acceleration, atmospheric scale height, escape velocities) are derived directly from official NASA Planetary Fact Sheets. Propulsion math employs the standard Tsiolkovsky Rocket Equation, rendered as real-time delta-v indicators.'
  },
  {
    badge: 'CONTROLS',
    question: 'Which control schemes are supported across platforms?',
    answer: 'Laptops and desktop systems use [W/A/S/D] or Arrow keys to steer, with [SPACEBAR] for engine boost. Touchscreen tablets, iPads, and mobile phones utilize an integrated virtual thumbstick and dedicated boost touch button.'
  },
  {
    badge: 'COLLISION & DAMAGE',
    question: 'How does the game handle asteroid collisions and propellant exhaustion?',
    answer: 'Spacecraft are equipped with an ablative deflector shield. If an asteroid strikes or engines overheat, Nova-9 pauses telemetry to present emergency recovery actions (heat venting, power rerouting) to keep the mission viable.'
  },
  {
    badge: 'DISPLAY MODES',
    question: 'How do users toggle between White Cleanroom and Dark Space themes?',
    answer: 'Tap the [LIGHT] / [DARK] button in the upper header at any point. Dark mode renders deep space with star fields; Light mode provides a high-contrast NASA Cleanroom laboratory aesthetic.'
  },
  {
    badge: 'CHALLENGE GOAL',
    question: 'How does MISSIONFORGE align with 2026 NASA Space Apps Challenge objectives?',
    answer: 'The project addresses space mission design and education through an end-to-end loop: scenario briefing, subsystem modular assembly, real-time 3D orbital space flight, and scientific debriefing, fully open-source and browser-based.'
  }
];

export const CadetFAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    sounds.playClick();
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <section className="w-full max-w-4xl mx-auto my-10 px-4 sm:px-6">
      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
          <span>[KNOWLEDGE BASE]</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight mb-1">
          FREQUENTLY ASKED QUESTIONS
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans">
          Technical specifications for cadets, educators, and NASA Space Apps evaluators.
        </p>
      </div>

      {/* Accordion list */}
      <div className="space-y-2">
        {FAQ_DATA.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-md border transition-colors ${
                isOpen 
                  ? 'border-amber-500/50 bg-[#f8f7f4] dark:bg-[#111117]' 
                  : 'border-slate-300 dark:border-white/10 bg-[#f8f7f4]/80 dark:bg-[#111117]/60 hover:border-slate-400 dark:hover:border-white/20'
              }`}
            >
              <button
                onClick={() => toggleItem(idx)}
                className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left gap-3 cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5">
                  <span className="px-1.5 py-0.5 rounded-sm bg-slate-200 dark:bg-[#181822] text-[9px] font-mono font-bold text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-white/10 self-start">
                    [{item.badge}]
                  </span>
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white font-sans">
                    {item.question}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-amber-600 dark:text-amber-400 shrink-0">
                  {isOpen ? '[-]' : '[+]'}
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4 pt-1 text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed border-t border-slate-200 dark:border-white/10">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};
