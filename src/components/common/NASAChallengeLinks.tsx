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
    badge: 'GLOBAL',
    description: 'The world’s largest annual space & science hackathon organized by NASA and international space agency partners.'
  },
  {
    id: 'guide-doc',
    title: '2026 Participants Guide',
    subtitle: 'Official Rules & Submission Rubric',
    url: 'https://docs.google.com/document/d/1mSOxplyht5kii8GcCnFaGA-vMHIAVypjl4N6PobnaYQ/edit?usp=sharing',
    icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
    badge: 'RULES',
    description: 'Comprehensive guidelines for challenge evaluation, team structure, open science standards, and presentation requirements.'
  },
  {
    id: 'notebook-faq',
    title: 'NotebookLM FAQ Knowledge Base',
    subtitle: 'AI Research & Questions Assistant',
    url: 'https://notebook.google.com/notebook/44e5e9a3-5387-4191-8687-b44766aee09e',
    icon: <Bot className="w-5 h-5 text-purple-400" />,
    badge: 'AI FAQ',
    description: 'Google NotebookLM curated knowledge base addressing participant questions, judging criteria, and submission deadlines.'
  },
  {
    id: 'local-reg',
    title: 'NASA Space Apps Local Registration',
    subtitle: 'Regional & Bangladesh Hub',
    url: 'https://www.nasaspaceappsbd.com/registration',
    icon: <MapPin className="w-5 h-5 text-orange-400" />,
    badge: 'REGIONAL',
    description: 'Local chapter registration portal connecting local mentors, workshops, hackathon hubs, and regional award ceremonies.'
  },
  {
    id: 'build-guide',
    title: 'Space Mission Game Build Guide',
    subtitle: 'Architecture & Engineering Spec',
    url: 'https://claude.ai/artifact/PUnJNpKuEXRbvKafSgU6fA',
    icon: <FileText className="w-5 h-5 text-cyan-400" />,
    badge: 'DESIGN DOC',
    description: 'Technical architecture blueprint for building interactive, physics-grounded space mission engineering simulations.'
  }
];

export const NASAChallengeLinksModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-space-950 border-2 border-nasa-cyan/60 rounded-3xl shadow-2xl overflow-hidden ring-4 ring-nasa-cyan/15 flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-space-900 via-cyan-950/40 to-space-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xl shadow-lg border border-cyan-400/40">
              🚀
            </div>
            <div>
              <h2 className="font-display font-black text-base text-white flex items-center gap-2">
                <span>NASA SPACE APPS CHALLENGE 2026</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-nasa-cyan/20 border border-nasa-cyan/40 text-nasa-cyan font-mono">
                  OFFICIAL RESOURCES
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Challenge Theme: "Space Mission Design Game"
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resource Cards */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <p className="text-xs text-slate-300 font-sans leading-relaxed mb-3">
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
                className="p-3.5 rounded-2xl bg-space-900/90 border border-slate-800 hover:border-nasa-cyan/60 hover:bg-space-850/90 transition-all flex items-start justify-between gap-3 group cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-space-950 border border-slate-800 shrink-0 group-hover:border-nasa-cyan/40 transition-colors">
                    {link.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-white text-xs sm:text-sm group-hover:text-nasa-cyan transition-colors">
                        {link.title}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {link.badge}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-cyan-300 mb-1">
                      {link.subtitle}
                    </div>
                    <p className="text-xs text-slate-400 font-sans leading-snug">
                      {link.description}
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-space-950 border border-slate-800 text-slate-400 group-hover:text-nasa-cyan group-hover:border-nasa-cyan/40 transition-all shrink-0">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-space-900 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>Open Science & Interactive Aerospace Exploration</span>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-space-800 hover:bg-space-700 text-white font-mono text-xs font-bold border border-slate-700 cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const NASAChallengeFooterBar: React.FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => {
  return (
    <div className="w-full bg-space-950/95 border-t border-slate-800/80 px-4 py-2.5 flex items-center justify-between text-xs z-20 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 font-mono text-slate-400 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-nasa-orange animate-pulse" />
          <strong className="text-white">NASA SPACE APPS 2026:</strong>
          <span className="hidden sm:inline">Space Mission Design Game</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            sounds.playClick();
            onOpenModal();
          }}
          className="px-3 py-1 rounded-lg bg-space-900 border border-nasa-cyan/50 hover:border-nasa-cyan text-nasa-cyan hover:text-white text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
        >
          <Globe2 className="w-3.5 h-3.5" />
          <span>RESOURCES & GUIDES ({NASA_LINKS.length})</span>
        </button>
      </div>
    </div>
  );
};
