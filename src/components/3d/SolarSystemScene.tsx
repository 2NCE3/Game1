import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  ISSModel,
  HubbleModel,
  JWSTModel,
  LROModel,
  OrionCSMModel,
  MROModel,
  MAVENModel,
  AsteroidProbesModel,
  JunoModel,
  EuropaClipperModel,
  VoyagerModel,
} from './SatellitesFleet';

interface SolarSystemSceneProps {
  selectedDestinationId: string | null;
  onSelectDestination: (id: string) => void;
}

export const SolarSystemScene: React.FC<SolarSystemSceneProps> = ({
  selectedDestinationId,
  onSelectDestination,
}) => {
  const orbitsRef = useRef<THREE.Group>(null);

  // Slow planetary orbit animation
  useFrame((_, delta) => {
    if (orbitsRef.current) {
      orbitsRef.current.children.forEach((child, index) => {
        // Individual speed based on Kepler's 3rd law approximation
        const speed = 0.05 / Math.sqrt(index + 1);
        child.rotation.y += delta * speed;
      });
    }
  });

  return (
    <>
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        minDistance={5}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2.1}
      />

      {/* Central Sun */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshBasicMaterial color="#f59e0b" />
        <pointLight color="#ffedd5" intensity={4} distance={90} />
      </mesh>
      {/* Sun Corona Glow */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.7, 32, 32]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.25} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial color="#ff5722" transparent opacity={0.1} />
      </mesh>

      <group ref={orbitsRef}>
        {/* ── 1. MERCURY ────────────────────────────────────────────── */}
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[3.35, 3.45, 64]} />
            <meshBasicMaterial color="#94a3b8" transparent opacity={0.18} side={THREE.DoubleSide} />
          </mesh>
          <group position={[3.4, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.22, 24, 24]} />
              <meshStandardMaterial color="#64748b" roughness={0.9} metalness={0.2} />
            </mesh>
            <Html distanceFactor={8} position={[0, 0.42, 0]}>
              <div className="px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap bg-space-900/85 border border-slate-700 text-slate-300 shadow-sm pointer-events-none">
                Mercury
              </div>
            </Html>
          </group>
        </group>

        {/* ── 2. VENUS ──────────────────────────────────────────────── */}
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[4.75, 4.85, 64]} />
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.18} side={THREE.DoubleSide} />
          </mesh>
          <group position={[4.8, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.44, 32, 32]} />
              <meshStandardMaterial color="#ca8a04" roughness={0.6} metalness={0.05} />
            </mesh>
            {/* Dense Sulphuric Atmosphere */}
            <mesh>
              <sphereGeometry args={[0.46, 20, 20]} />
              <meshBasicMaterial color="#fef08a" transparent opacity={0.25} />
            </mesh>
            <Html distanceFactor={8} position={[0, 0.65, 0]}>
              <div className="px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap bg-space-900/85 border border-yellow-700/60 text-amber-200 shadow-sm pointer-events-none">
                Venus
              </div>
            </Html>
          </group>
        </group>

        {/* ── 3. EARTH & MOON SYSTEM ────────────────────────────────── */}
        <group>
          {/* Orbit trace */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[6.55, 6.65, 64]} />
            <meshBasicMaterial color="#0284c7" transparent opacity={0.22} side={THREE.DoubleSide} />
          </mesh>

          {/* Earth Body */}
          <group 
            position={[6.6, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectDestination('earth-orbit');
            }}
          >
            <mesh>
              <sphereGeometry args={[0.52, 32, 32]} />
              <meshStandardMaterial color="#1e40af" roughness={0.4} metalness={0.1} />
            </mesh>
            {/* Continents & Atmosphere */}
            <mesh>
              <sphereGeometry args={[0.525, 20, 20]} />
              <meshStandardMaterial color="#15803d" wireframe transparent opacity={0.25} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.55, 20, 20]} />
              <meshBasicMaterial color="#60a5fa" transparent opacity={0.2} />
            </mesh>

            {/* Selection marker */}
            {selectedDestinationId === 'earth-orbit' && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.68, 0.76, 32]} />
                <meshBasicMaterial color="#00e5ff" side={THREE.DoubleSide} />
              </mesh>
            )}

            <Html distanceFactor={9} position={[0, 0.75, 0]}>
              <div 
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono whitespace-nowrap cursor-pointer transition-all border ${
                  selectedDestinationId === 'earth-orbit' 
                    ? 'bg-nasa-cyan/20 border-nasa-cyan text-white shadow-lg shadow-nasa-cyan/20' 
                    : 'bg-space-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                Earth Orbit
              </div>
            </Html>

            {/* Earth Orbital Fleet: ISS, Hubble & JWST */}
            <ISSModel orbitRadius={0.95} speed={0.45} />
            <HubbleModel orbitRadius={1.35} speed={0.32} />
            <JWSTModel position={[1.9, 0.4, 0.8]} />

            {/* Moon orbiting Earth */}
            <group position={[1.1, 0, 0]}>
              <mesh 
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectDestination('moon');
                }}
              >
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshStandardMaterial color="#64748b" roughness={0.9} />
              </mesh>

              {selectedDestinationId === 'moon' && (
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.26, 0.32, 24]} />
                  <meshBasicMaterial color="#00e5ff" side={THREE.DoubleSide} />
                </mesh>
              )}

              {/* Lunar Reconnaissance & Artemis Orion */}
              <LROModel orbitRadius={0.34} speed={0.7} />
              <OrionCSMModel orbitRadius={0.48} speed={0.45} />

              <Html distanceFactor={8} position={[0, 0.35, 0]}>
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDestination('moon');
                  }}
                  className={`px-1 py-0.2 rounded text-[8px] font-mono whitespace-nowrap cursor-pointer border ${
                    selectedDestinationId === 'moon' 
                      ? 'bg-nasa-cyan/20 border-nasa-cyan text-white' 
                      : 'bg-space-900/80 border-slate-700 text-slate-300'
                  }`}
                >
                  Moon
                </div>
              </Html>
            </group>
          </group>
        </group>

        {/* ── 4. MARS ───────────────────────────────────────────────── */}
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[9.15, 9.25, 64]} />
            <meshBasicMaterial color="#b45309" transparent opacity={0.18} side={THREE.DoubleSide} />
          </mesh>

          <group 
            position={[9.2, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectDestination('mars');
            }}
          >
            <mesh>
              <sphereGeometry args={[0.4, 32, 32]} />
              <meshStandardMaterial color="#b45309" roughness={0.85} metalness={0.05} />
            </mesh>
            {/* Polar Cap */}
            <mesh position={[0, 0.38, 0]}>
              <sphereGeometry args={[0.12, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.3]} />
              <meshStandardMaterial color="#ffffff" roughness={0.4} />
            </mesh>

            {selectedDestinationId === 'mars' && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.54, 0.6, 32]} />
                <meshBasicMaterial color="#00e5ff" side={THREE.DoubleSide} />
              </mesh>
            )}

            <Html distanceFactor={9} position={[0, 0.65, 0]}>
              <div 
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono whitespace-nowrap cursor-pointer transition-all border ${
                  selectedDestinationId === 'mars' 
                    ? 'bg-nasa-cyan/20 border-nasa-cyan text-white shadow-lg shadow-nasa-cyan/20' 
                    : 'bg-space-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                Mars
              </div>
            </Html>

            {/* NASA Mars Orbiters: MRO & MAVEN */}
            <MROModel orbitRadius={0.82} speed={0.5} />
            <MAVENModel orbitRadius={1.12} speed={0.35} />
          </group>
        </group>

        {/* ── 5. ASTEROID BELT (CERES / PSYCHE / BENNU) ─────────────── */}
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[11.85, 12.15, 64]} />
            <meshBasicMaterial color="#64748b" transparent opacity={0.16} side={THREE.DoubleSide} />
          </mesh>

          <group 
            position={[12.0, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectDestination('asteroid');
            }}
          >
            <mesh rotation={[0.4, 0.8, 0.2]}>
              <dodecahedronGeometry args={[0.24, 1]} />
              <meshStandardMaterial color="#475569" roughness={0.95} metalness={0.15} />
            </mesh>

            {selectedDestinationId === 'asteroid' && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.38, 0.44, 24]} />
                <meshBasicMaterial color="#00e5ff" side={THREE.DoubleSide} />
              </mesh>
            )}

            <Html distanceFactor={9} position={[0, 0.48, 0]}>
              <div 
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono whitespace-nowrap cursor-pointer transition-all border ${
                  selectedDestinationId === 'asteroid' 
                    ? 'bg-nasa-cyan/20 border-nasa-cyan text-white shadow-lg shadow-nasa-cyan/20' 
                    : 'bg-space-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                Asteroid Belt
              </div>
            </Html>

            {/* Asteroid Exploration Fleet: OSIRIS-REx & Psyche */}
            <AsteroidProbesModel />
          </group>
        </group>

        {/* ── 6. JUPITER & EUROPA ───────────────────────────────────── */}
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[15.5, 15.7, 64]} />
            <meshBasicMaterial color="#d97706" transparent opacity={0.18} side={THREE.DoubleSide} />
          </mesh>

          <group 
            position={[15.6, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectDestination('jupiter');
            }}
          >
            <mesh>
              <sphereGeometry args={[0.95, 32, 32]} />
              <meshStandardMaterial color="#b45309" roughness={0.55} metalness={0.05} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.965, 24, 24]} />
              <meshStandardMaterial color="#fed7aa" wireframe transparent opacity={0.18} />
            </mesh>

            {selectedDestinationId === 'jupiter' && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[1.25, 1.35, 32]} />
                <meshBasicMaterial color="#00e5ff" side={THREE.DoubleSide} />
              </mesh>
            )}

            <Html distanceFactor={10} position={[0, 1.3, 0]}>
              <div 
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono whitespace-nowrap cursor-pointer transition-all border ${
                  selectedDestinationId === 'jupiter' 
                    ? 'bg-nasa-cyan/20 border-nasa-cyan text-white shadow-lg shadow-nasa-cyan/20' 
                    : 'bg-space-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                Jupiter
              </div>
            </Html>

            {/* Jovian Fleet: Juno & Europa Clipper */}
            <JunoModel orbitRadius={1.6} speed={0.3} />
            <EuropaClipperModel orbitRadius={2.2} speed={0.22} />
          </group>
        </group>

        {/* ── 7. SATURN (WITH MAJESTIC RINGS) ───────────────────────── */}
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[19.4, 19.6, 64]} />
            <meshBasicMaterial color="#eab308" transparent opacity={0.16} side={THREE.DoubleSide} />
          </mesh>

          <group position={[19.5, 0, 0]}>
            {/* Saturn Body */}
            <mesh>
              <sphereGeometry args={[0.8, 32, 32]} />
              <meshStandardMaterial color="#e2d6b5" roughness={0.55} metalness={0.05} />
            </mesh>
            {/* Ring System (Concentric planar discs) */}
            <mesh rotation={[Math.PI / 2.5, 0, 0]}>
              <ringGeometry args={[1.05, 1.75, 48]} />
              <meshStandardMaterial color="#d4b996" transparent opacity={0.7} side={THREE.DoubleSide} />
            </mesh>
            <mesh rotation={[Math.PI / 2.5, 0, 0]}>
              <ringGeometry args={[1.82, 2.1, 48]} />
              <meshStandardMaterial color="#bfa181" transparent opacity={0.4} side={THREE.DoubleSide} />
            </mesh>

            <Html distanceFactor={10} position={[0, 1.15, 0]}>
              <div className="px-1.5 py-0.5 rounded text-[10px] font-mono whitespace-nowrap bg-space-900/85 border border-amber-500/40 text-amber-200 shadow-sm pointer-events-none">
                Saturn
              </div>
            </Html>
          </group>
        </group>

        {/* ── 8. URANUS ─────────────────────────────────────────────── */}
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[23.3, 23.5, 64]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.16} side={THREE.DoubleSide} />
          </mesh>

          <group position={[23.4, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.58, 32, 32]} />
              <meshStandardMaterial color="#7dd3fc" roughness={0.5} metalness={0.1} />
            </mesh>
            {/* Faint Vertical Ring */}
            <mesh rotation={[0.2, 0, Math.PI / 2]}>
              <ringGeometry args={[0.8, 0.95, 32]} />
              <meshBasicMaterial color="#bae6fd" transparent opacity={0.25} side={THREE.DoubleSide} />
            </mesh>

            <Html distanceFactor={10} position={[0, 0.9, 0]}>
              <div className="px-1.5 py-0.5 rounded text-[10px] font-mono whitespace-nowrap bg-space-900/85 border border-sky-500/40 text-sky-200 shadow-sm pointer-events-none">
                Uranus
              </div>
            </Html>
          </group>
        </group>

        {/* ── 9. NEPTUNE ────────────────────────────────────────────── */}
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[26.7, 26.9, 64]} />
            <meshBasicMaterial color="#2563eb" transparent opacity={0.16} side={THREE.DoubleSide} />
          </mesh>

          <group position={[26.8, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.55, 32, 32]} />
              <meshStandardMaterial color="#1d4ed8" roughness={0.4} metalness={0.1} />
            </mesh>
            {/* White Storm Cloud Feature */}
            <mesh position={[0.2, 0.1, 0.45]}>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
            </mesh>

            <Html distanceFactor={10} position={[0, 0.85, 0]}>
              <div className="px-1.5 py-0.5 rounded text-[10px] font-mono whitespace-nowrap bg-space-900/85 border border-blue-500/40 text-blue-200 shadow-sm pointer-events-none">
                Neptune
              </div>
            </Html>
          </group>
        </group>

        {/* ── 10. NEW EDEN (EXOPLANET CORRIDOR) ─────────────────────── */}
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[30.8, 31.2, 64]} />
            <meshBasicMaterial color="#10b981" transparent opacity={0.35} side={THREE.DoubleSide} />
          </mesh>

          <group 
            position={[31.0, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectDestination('new-eden');
            }}
          >
            {/* Planet Body: Ocean Blue & Emerald Continents */}
            <mesh>
              <sphereGeometry args={[0.7, 32, 32]} />
              <meshStandardMaterial color="#0f766e" roughness={0.4} metalness={0.1} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.704, 20, 20]} />
              <meshStandardMaterial color="#15803d" wireframe transparent opacity={0.3} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.75, 24, 24]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.2} />
            </mesh>

            {selectedDestinationId === 'new-eden' && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.95, 1.05, 32]} />
                <meshBasicMaterial color="#10b981" side={THREE.DoubleSide} />
              </mesh>
            )}

            <Html distanceFactor={11} position={[0, 1.1, 0]}>
              <div 
                className={`px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap cursor-pointer transition-all border flex items-center gap-1 ${
                  selectedDestinationId === 'new-eden' 
                    ? 'bg-emerald-950/90 border-emerald-400 text-white shadow-xl shadow-emerald-500/30' 
                    : 'bg-space-900/90 border-emerald-600/50 text-emerald-300 hover:border-emerald-400'
                }`}
              >
                <span>New Eden (Exoplanet)</span>
              </div>
            </Html>
          </group>
        </group>
      </group>

      {/* Interstellar Deep Space Trajectory: Voyager 1 */}
      <VoyagerModel position={[34, 3.5, -10]} />
    </>
  );
};
