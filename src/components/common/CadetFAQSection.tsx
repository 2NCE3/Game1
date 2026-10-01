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
    badge: 'Accessibility',
    question: 'Is this simulator suitable for younger cadets aged 10 and above?',
    answer: 'Yes. Cadet Mode features high-contrast visual gauges, automated mass checks, and clear guidance from Commander Nova-9. A cadet can assemble a functional spacecraft and initiate flight in under two minutes without advanced engineering prerequisites.'
  },
  {
    badge: 'NASA Grounding',
    question: 'Where is the underlying planetary and propulsion physics derived from?',
    answer: 'Planetary parameters (gravitational acceleration, atmospheric scale height, escape velocities) are derived directly from official NASA Planetary Fact Sheets. Propulsion math employs the standard Tsiolkovsky Rocket Equation, rendered as real-time delta-v indicators.'
  },
  {
    badge: 'Controls',
    question: 'Which control schemes are supported across platforms?',
    answer: 'Laptops and desktop systems use W/A/S/D or Arrow keys to steer, with Spacebar for engine boost. Touchscreen tablets, iPads, and mobile phones utilize an integrated virtual thumbstick and dedicated boost touch button.'
  },
  {
    badge: 'Flight Systems',
    question: 'How does the game handle asteroid collisions and propellant exhaustion?',
    answer: 'Spacecraft are equipped with an ablative deflector shield. If an asteroid strikes or engines overheat, Nova-9 pauses telemetry to present emergency recovery actions (heat venting, power rerouting) to keep the mission viable.'
  },
  {
    badge: 'Display Modes',
    question: 'How do users toggle between White Cleanroom and Dark Space themes?',
    answer: 'Tap the Light / Dark mode toggle in the upper header at any point. Dark mode renders deep space with star fields; Light mode provides a high-contrast NASA Cleanroom laboratory aesthetic.'
  },
  {
    badge: 'Challenge Alignment',
    question: 'How does MissionForge align with 2026 NASA Space Apps Challenge objectives?',
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
    <section className="w-full max-w-4xl mx-auto my-12 px-4 sm:px-6">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#0071e3] dark:text-blue-400 text-xs font-medium mb-3">
          <span>Knowledge Base</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          Technical specifications for cadets, educators, and NASA Space Apps evaluators.
        </p>
      </div>

      {/* Accordion list */}
      <div className="space-y-3">
        {FAQ_DATA.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 backdrop-blur-xl ${
                isOpen 
                  ? 'border-blue-500/40 bg-white/90 dark:bg-[#121217]/90 shadow-md ring-1 ring-blue-500/15' 
                  : 'border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#121217]/65 hover:border-black/10 dark:hover:border-white/20'
              }`}
            >
              <button
                onClick={() => toggleItem(idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-[10px] font-medium text-slate-600 dark:text-slate-400 border border-black/5 dark:border-white/10 self-start">
                    {item.badge}
                  </span>
                  <span className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                    {item.question}
                  </span>
                </div>
                <div className="w-6 h-6 rounded-full bg-black/[0.04] dark:bg-white/[0.08] flex items-center justify-center text-xs text-slate-500 dark:text-slate-400 shrink-0 font-medium">
                  {isOpen ? '−' : '+'}
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-black/5 dark:border-white/10">
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
