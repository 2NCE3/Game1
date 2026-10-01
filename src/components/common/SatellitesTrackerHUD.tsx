import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Satellite, Globe, ExternalLink, ChevronDown, ChevronUp, Zap, Sparkles } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export interface SpacecraftProbe {
  id: string;
  name: string;
  fullName: string;
  targetBody: string;
  destinationId: string;
  agency: string;
  launchYear: string;
  status: 'ACTIVE' | 'EN ROUTE' | 'LEGENDARY';
  orbitType: string;
  primaryMission: string;
  signalLatency: string;
  icon: string;
  color: string;
}

export const NASA_FLEET_DATA: SpacecraftProbe[] = [
  {
    id: 'iss',
    name: 'ISS',
    fullName: 'International Space Station (Expedition 72)',
    targetBody: 'Earth Orbit',
    destinationId: 'earth-orbit',
    agency: 'NASA / ESA / JAXA / CSA',
    launchYear: '1998–Present',
    status: 'ACTIVE',
    orbitType: 'Low Earth Orbit (408 km)',
    primaryMission: 'Continuous human microgravity laboratory & deep-space systems testbed',
    signalLatency: '0.001s (Real-time TDRS)',
    icon: '🛰️',
    color: '#38bdf8'
  },
  {
    id: 'hubble',
    name: 'Hubble (HST)',
    fullName: 'Hubble Space Telescope',
    targetBody: 'Earth Orbit',
    destinationId: 'earth-orbit',
    agency: 'NASA / ESA',
    launchYear: '1990',
    status: 'ACTIVE',
    orbitType: 'Low Earth Orbit (540 km)',
    primaryMission: 'Deep UV/Optical cosmology & planetary atmospheric observations',
    signalLatency: '0.002s',
    icon: '🔭',
    color: '#0284c7'
  },
  {
    id: 'jwst',
    name: 'JWST',
    fullName: 'James Webb Space Telescope',
    targetBody: 'Earth-Sun L2',
    destinationId: 'earth-orbit',
    agency: 'NASA / ESA / CSA',
    launchYear: '2021',
    status: 'ACTIVE',
    orbitType: 'Halo Orbit (Sun-Earth L2 · 1.5M km)',
    primaryMission: 'Infrared astronomy surveying earliest stars and exoplanet atmospheres',
    signalLatency: '5.0s',
    icon: '✨',
    color: '#f59e0b'
  },
  {
    id: 'lro',
    name: 'LRO',
    fullName: 'Lunar Reconnaissance Orbiter',
    targetBody: 'The Moon',
    destinationId: 'moon',
    agency: 'NASA Goddard',
    launchYear: '2009',
    status: 'ACTIVE',
    orbitType: 'Lunar Polar Orbit (50 km)',
    primaryMission: 'High-res polar water ice mapping & Artemis landing site scouting',
    signalLatency: '1.3s',
    icon: '🌙',
    color: '#cbd5e1'
  },
  {
    id: 'orion',
    name: 'Artemis II Orion',
    fullName: 'Orion Crew Module & European Service Module',
    targetBody: 'The Moon',
    destinationId: 'moon',
    agency: 'NASA / ESA',
    launchYear: '2022–2025',
    status: 'ACTIVE',
    orbitType: 'Distant Retrograde / Translunar',
    primaryMission: 'Human crew transportation to lunar orbit and deep space architectures',
    signalLatency: '1.4s',
    icon: '🚀',
    color: '#10b981'
  },
  {
    id: 'mro',
    name: 'MRO',
    fullName: 'Mars Reconnaissance Orbiter',
    targetBody: 'Mars',
    destinationId: 'mars',
    agency: 'NASA JPL',
    launchYear: '2005',
    status: 'ACTIVE',
    orbitType: 'Sun-synchronous Martian Orbit (300 km)',
    primaryMission: 'Sub-meter HiRISE geological imaging & rover telecommunications relay',
    signalLatency: '4–22 mins',
    icon: '🔴',
    color: '#ef4444'
  },
  {
    id: 'maven',
    name: 'MAVEN',
    fullName: 'Mars Atmosphere and Volatile EvolutioN',
    targetBody: 'Mars',
    destinationId: 'mars',
    agency: 'NASA Goddard',
    launchYear: '2013',
    status: 'ACTIVE',
    orbitType: 'Elliptical Aerobraking Orbit',
    primaryMission: 'Measuring atmospheric loss rate to space over billions of years',
    signalLatency: '4–22 mins',
    icon: '💨',
    color: '#f43f5e'
  },
  {
    id: 'osiris-rex',
    name: 'OSIRIS-REx / APEX',
    fullName: 'Origins, Spectral Interpretation, Resource Identification, Security, Regolith Explorer',
    targetBody: 'Asteroid (Bennu/Apophis)',
    destinationId: 'asteroid',
    agency: 'NASA / Lockheed Martin',
    launchYear: '2016',
    status: 'ACTIVE',
    orbitType: 'Near-Earth Asteroid Proximity',
    primaryMission: 'Delivered carbonaceous sample from Bennu; en route to asteroid Apophis',
    signalLatency: '18 mins',
    icon: '☄️',
    color: '#d97706'
  },
  {
    id: 'juno',
    name: 'Juno',
    fullName: 'Juno Jovian Polar Explorer',
    targetBody: 'Jupiter',
    destinationId: 'jupiter',
    agency: 'NASA JPL',
    launchYear: '2011',
    status: 'ACTIVE',
    orbitType: 'High-Eccentricity Polar Orbit (53 days)',
    primaryMission: 'Gravity fields, auroral magnetosphere & water abundance under cloud tops',
    signalLatency: '35–52 mins',
    icon: '🪐',
    color: '#ea580c'
  },
  {
    id: 'europa-clipper',
    name: 'Europa Clipper',
    fullName: 'Europa Clipper Flagship',
    targetBody: 'Jupiter / Europa',
    destinationId: 'jupiter',
    agency: 'NASA JPL / APL',
    launchYear: '2024 Flagship',
    status: 'EN ROUTE',
    orbitType: 'Jupiter Orbit with 49 Europa Flybys',
    primaryMission: 'Subsurface ocean habitability, ice shell thickness & plume analysis',
    signalLatency: '48 mins',
    icon: '🌊',
    color: '#0284c7'
  },
  {
    id: 'voyager1',
    name: 'Voyager 1',
    fullName: 'Voyager 1 Interstellar Mission',
    targetBody: 'Interstellar Space',
    destinationId: 'new-eden',
    agency: 'NASA JPL',
    launchYear: '1977',
    status: 'LEGENDARY',
    orbitType: 'Hyperbolic Solar Escape (162 AU)',
    primaryMission: 'First human artifact in interstellar space beyond the solar heliopause',
    signalLatency: '22.5 hours',
    icon: '🌟',
    color: '#eab308'
  }
];

interface SatellitesTrackerHUDProps {
  onSelectDestination?: (destId: string) => void;
  compact?: boolean;
}

export const SatellitesTrackerHUD: React.FC<SatellitesTrackerHUDProps> = ({
  onSelectDestination,
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProbe, setSelectedProbe] = useState<SpacecraftProbe>(NASA_FLEET_DATA[0]);

  const handleSelect = (probe: SpacecraftProbe) => {
    sounds.playSelect();
    setSelectedProbe(probe);
    if (onSelectDestination) {
      onSelectDestination(probe.destinationId);
    }
  };

  return (
    <div className="relative font-mono z-30">
      {/* Trigger Pill Badge */}
      <button
        onClick={() => {
          sounds.playClick();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/80 hover:bg-black/95 border border-red-500/30 hover:border-red-500/60 backdrop-blur-xl text-white shadow-xl transition-all cursor-pointer group"
      >
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[11px] font-bold tracking-wider uppercase text-slate-200 group-hover:text-white">
          NASA Interplanetary Fleet ({NASA_FLEET_DATA.length})
        </span>
        <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 font-semibold">
          DSN LIVE
        </span>
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        )}
      </button>

      {/* Expanded Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${
              compact ? 'bottom-full mb-3 left-0' : 'top-full mt-2 left-0'
            } w-[340px] sm:w-[460px] max-h-[75vh] flex flex-col rounded-2xl bg-[#090508]/95 border border-red-500/30 backdrop-blur-2xl shadow-2xl shadow-black overflow-hidden`}
          >
            {/* Header */}
            <div className="p-3.5 bg-black/60 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Satellite className="w-4 h-4 text-red-400" />
                <span className="text-xs font-bold text-white tracking-wide">
                  Deep Space Network · Active Spacecraft Fleet
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>DSN 70m Antennas Synced</span>
              </div>
            </div>

            {/* Quick Horizontal Carousel of Probes */}
            <div className="p-2 border-b border-white/5 flex gap-1.5 overflow-x-auto scrollbar-none bg-black/40">
              {NASA_FLEET_DATA.map((probe) => {
                const isSelected = selectedProbe.id === probe.id;
                return (
                  <button
                    key={probe.id}
                    onClick={() => handleSelect(probe)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/30'
                        : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-300'
                    }`}
                  >
                    <span>{probe.icon}</span>
                    <span>{probe.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Spacecraft Full Dossier */}
            <div className="p-4 space-y-3 overflow-y-auto text-xs">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{selectedProbe.icon}</span>
                    <h4 className="font-bold text-sm text-white">{selectedProbe.fullName}</h4>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span className="text-red-400 font-semibold">{selectedProbe.agency}</span>
                    <span>·</span>
                    <span>Launched {selectedProbe.launchYear}</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                  selectedProbe.status === 'ACTIVE'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : selectedProbe.status === 'EN ROUTE'
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}>
                  {selectedProbe.status}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Target World / Region:</span>
                  <span className="text-white font-semibold">{selectedProbe.targetBody}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Orbit / Trajectory:</span>
                  <span className="text-slate-200">{selectedProbe.orbitType}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">DSN 1-Way Latency:</span>
                  <span className="text-red-400 font-bold">{selectedProbe.signalLatency}</span>
                </div>
              </div>

              <p className="text-slate-300 text-[11px] leading-relaxed">
                {selectedProbe.primaryMission}
              </p>

              {/* Action Button */}
              {onSelectDestination && (
                <button
                  onClick={() => {
                    handleSelect(selectedProbe);
                    setIsOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-xl red-gradient-btn text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-red-600/30 active:scale-[0.98]"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Target World in 3D: {selectedProbe.targetBody}</span>
                </button>
              )}
            </div>

            {/* DSN Live Status Footer */}
            <div className="px-3.5 py-2 bg-black/70 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                <span>Goldstone · Madrid · Canberra Interlink</span>
              </span>
              <span className="text-slate-500 font-mono">X-Band & Ka-Band</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
