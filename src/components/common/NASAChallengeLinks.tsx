import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe2, 
  BookOpen, 
  Bot, 
  ExternalLink, 
  X, 
  Award, 
  FileText, 
  Compass, 
  Sparkles,
  MapPin
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export const NASA_LINKS = [
  {
    id: 'global-reg',
    title: 'NASA Space Apps Global',
    subtitle: 'Official Hackathon Portal',
    url: 'https://www.spaceappschallenge.org/',
    icon: <Globe2 className="w-5 h-5 text-blue-400" />,
    badge: 'Global Portal',
    description: 'The world’s largest annual space & science hackathon organized by NASA and international space agency partners.'
  },
  {
    id: 'guide-doc',
    title: '2026 Participants Guide',
    subtitle: 'Official Rules & Submission Rubric',
    url: 'https://docs.google.com/document/d/1mSOxplyht5kii8GcCnFaGA-vMHIAVypjl4N6PobnaYQ/edit?usp=sharing',
    icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
    badge: 'Official Rules',
    description: 'Comprehensive guidelines for challenge evaluation, team structure, open science standards, and presentation requirements.'
  },
  {
    id: 'notebook-faq',
    title: 'NotebookLM FAQ Knowledge Base',
    subtitle: 'AI Research & Questions Assistant',
    url: 'https://notebook.google.com/notebook/44e5e9a3-5387-4191-8687-b44766aee09e',
    icon: <Bot className="w-5 h-5 text-purple-400" />,
    badge: 'NotebookLM AI',
    description: 'Google NotebookLM curated knowledge base addressing participant questions, judging criteria, and submission deadlines.'
  },
  {
    id: 'local-reg',
    title: 'NASA Space Apps Local Registration',
    subtitle: 'Regional & Bangladesh Hub',
    url: 'https://www.nasaspaceappsbd.com/registration',
    icon: <MapPin className="w-5 h-5 text-orange-400" />,
    badge: 'Regional Hub',
    description: 'Local chapter registration portal connecting local mentors, workshops, hackathon hubs, and regional award ceremonies.'
  },
  {
    id: 'build-guide',
    title: 'Space Mission Game Build Guide',
    subtitle: 'Architecture & Engineering Spec',
    url: 'https://claude.ai/artifact/PUnJNpKuEXRbvKafSgU6fA',
    icon: <FileText className="w-5 h-5 text-cyan-400" />,
    badge: 'Architecture Spec',
    description: 'Technical architecture blueprint for building interactive, physics-grounded space mission engineering simulations.'
  }
];

export const NASAChallengeLinksModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl select-none font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="w-full max-w-2xl bg-[#121217] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-[#0071e3] dark:text-blue-400 flex items-center justify-center text-xl">
              🚀
            </div>
            <div>
              <h2 className="font-semibold text-base text-white flex items-center gap-2">
                <span>NASA Space Apps Challenge 2026</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-400 font-medium">
                  Official Resources
                </span>
              </h2>
              <p className="text-xs text-[#86868b]">
                Challenge Theme: "Space Mission Design Game"
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resource Cards */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            This project is built directly to solve the <strong>2026 NASA Space Apps Challenge: Space Mission Design Game</strong>. Explore official hackathon portals, technical build guides, and registration links below:
          </p>

          <div className="grid grid-cols-1 gap-2.5">
            {NASA_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sounds.playSelect()}
                className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] transition-all flex items-start justify-between gap-3 group cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 shrink-0 group-hover:border-blue-500/30 transition-colors">
                    {link.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-white text-xs sm:text-sm group-hover:text-blue-400 transition-colors">
                        {link.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-300 border border-white/10 font-normal">
                        {link.badge}
                      </span>
                    </div>
                    <div className="text-[11px] text-blue-400 mb-1">
                      {link.subtitle}
                    </div>
                    <p className="text-xs text-slate-400 leading-snug">
                      {link.description}
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-slate-400 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all shrink-0">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white/[0.02] border-t border-white/10 flex items-center justify-between">
          <div className="text-xs text-[#86868b] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Open Science & Interactive Aerospace Exploration</span>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-full border border-white/10 hover:bg-white/10 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const NASAChallengeFooterBar: React.FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => {
  return (
    <div className="w-full bg-black/60 border-t border-white/10 px-4 py-2.5 flex items-center justify-between text-xs z-20 backdrop-blur-2xl font-sans">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-slate-400 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <strong className="text-white font-medium">NASA Space Apps 2026:</strong>
          <span className="hidden sm:inline text-[#86868b]">Space Mission Design Game</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            sounds.playClick();
            onOpenModal();
          }}
          className="px-3.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Globe2 className="w-3.5 h-3.5 text-blue-400" />
          <span>Official Resources ({NASA_LINKS.length})</span>
        </button>
      </div>
    </div>
  );
};
