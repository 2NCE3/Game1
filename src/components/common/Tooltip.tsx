import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { EDUCATIONAL_GLOSSARY } from '../../data/missionsData';

interface TooltipProps {
  glossaryKey?: string;
  title?: string;
  content?: string;
  tip?: string;
  children?: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({
  glossaryKey,
  title,
  content,
  tip,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const entry = glossaryKey ? EDUCATIONAL_GLOSSARY[glossaryKey] : null;
  const header = title || entry?.term || 'Aerospace Note';
  const body = content || entry?.definition || '';
  const practical = tip || entry?.practicalTip || '';

  return (
    <div 
      className="relative inline-flex items-center group cursor-help"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
    >
      {children ? children : (
        <span className="text-slate-400 hover:text-nasa-cyan transition-colors ml-1 inline-flex items-center">
          <Info className="w-3.5 h-3.5" />
        </span>
      )}

      {isOpen && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-space-900/95 border border-nasa-cyan/40 rounded-lg shadow-2xl backdrop-blur-md text-left pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center gap-1.5 pb-1.5 mb-1.5 border-b border-slate-700/60 text-xs font-semibold tracking-wider text-nasa-cyan font-mono uppercase">
            <Info className="w-3.5 h-3.5 text-nasa-cyan" />
            <span>{header}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {body}
          </p>
          {practical && (
            <div className="mt-2 pt-1.5 border-t border-slate-800 text-[11px] text-amber-300/90 font-mono">
              <span className="font-semibold text-nasa-orange uppercase mr-1">NASA Tip:</span>
              {practical}
            </div>
          )}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-space-900/95" />
        </div>
      )}
    </div>
  );
};
