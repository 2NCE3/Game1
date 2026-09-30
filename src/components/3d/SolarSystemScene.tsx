import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { DESTINATIONS } from '../../data/missionsData';

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
        maxDistance={45}
        maxPolarAngle={Math.PI / 2.1}
      />

      {/* Central Sun */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshBasicMaterial color="#f59e0b" />
        <pointLight color="#ffedd5" intensity={4} distance={80} />
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
        {/* 1. Earth Orbit */}
        <group>
          {/* Orbit trace */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[5.95, 6.05, 64]} />
            <meshBasicMaterial color="#0284c7" transparent opacity={0.2} side={THREE.DoubleSide} />
          </mesh>

          {/* Earth Body */}
          <group 
            position={[6, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectDestination('earth-orbit');
            }}
          >
            <mesh>
              <sphereGeometry args={[0.5, 32, 32]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.5} />
            </mesh>
            {/* Atmosphere */}
            <mesh>
              <sphereGeometry args={[0.55, 16, 16]} />
              <meshBasicMaterial color="#00e5ff" transparent opacity={0.15} />
            </mesh>

            {/* Selection marker */}
            {selectedDestinationId === 'earth-orbit' && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.7, 0.78, 32]} />
                <meshBasicMaterial color="#00e5ff" side={THREE.DoubleSide} />
              </mesh>
            )}

            <Html distanceFactor={18} position={[0, 0.8, 0]}>
              <div 
                className={`px-2 py-0.5 rounded text-xs font-mono whitespace-nowrap cursor-pointer transition-all border ${
                  selectedDestinationId === 'earth-orbit' 
                    ? 'bg-nasa-cyan/20 border-nasa-cyan text-white shadow-lg shadow-nasa-cyan/20' 
                    : 'bg-space-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                Earth Orbit (LEO)
              </div>
            </Html>

            {/* Moon orbiting Earth */}
            <group position={[1.1, 0, 0]}>
              <mesh 
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectDestination('moon');
                }}
              >
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
              </mesh>

              {selectedDestinationId === 'moon' && (
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.26, 0.32, 24]} />
                  <meshBasicMaterial color="#00e5ff" side={THREE.DoubleSide} />
                </mesh>
              )}

              <Html distanceFactor={15} position={[0, 0.4, 0]}>
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDestination('moon');
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono whitespace-nowrap cursor-pointer border ${
                    selectedDestinationId === 'moon' 
                      ? 'bg-nasa-cyan/20 border-nasa-cyan text-white' 
                      : 'bg-space-900/80 border-slate-700 text-slate-300'
                  }`}
                >
                  The Moon
                </div>
              </Html>
            </group>
          </group>
        </group>

        {/* 2. Mars Orbit */}
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[9.95, 10.05, 64]} />
            <meshBasicMaterial color="#ef4444" transparent opacity={0.2} side={THREE.DoubleSide} />
          </mesh>

          <group 
            position={[10, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectDestination('mars');
            }}
          >
            <mesh>
              <sphereGeometry args={[0.38, 32, 32]} />
              <meshStandardMaterial color="#ef4444" roughness={0.7} />
            </mesh>

            {selectedDestinationId === 'mars' && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.55, 0.62, 32]} />
                <meshBasicMaterial color="#00e5ff" side={THREE.DoubleSide} />
              </mesh>
            )}

            <Html distanceFactor={18} position={[0, 0.7, 0]}>
              <div 
                className={`px-2 py-0.5 rounded text-xs font-mono whitespace-nowrap cursor-pointer transition-all border ${
                  selectedDestinationId === 'mars' 
                    ? 'bg-nasa-cyan/20 border-nasa-cyan text-white shadow-lg shadow-nasa-cyan/20' 
                    : 'bg-space-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                Mars
              </div>
            </Html>
          </group>
        </group>

        {/* 3. Asteroid Belt (Psyche/Bennu) */}
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[13.9, 14.1, 64]} />
            <meshBasicMaterial color="#d97706" transparent opacity={0.2} side={THREE.DoubleSide} />
          </mesh>

          <group 
            position={[14, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectDestination('asteroid');
            }}
          >
            {/* Irregular asteroid mesh (dodecahedron) */}
            <mesh rotation={[0.4, 0.8, 0.2]}>
              <dodecahedronGeometry args={[0.22, 1]} />
              <meshStandardMaterial color="#b45309" roughness={0.9} />
            </mesh>

            {selectedDestinationId === 'asteroid' && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.38, 0.44, 24]} />
                <meshBasicMaterial color="#00e5ff" side={THREE.DoubleSide} />
              </mesh>
            )}

            <Html distanceFactor={20} position={[0, 0.55, 0]}>
              <div 
                className={`px-2 py-0.5 rounded text-xs font-mono whitespace-nowrap cursor-pointer transition-all border ${
                  selectedDestinationId === 'asteroid' 
                    ? 'bg-nasa-cyan/20 border-nasa-cyan text-white shadow-lg shadow-nasa-cyan/20' 
                    : 'bg-space-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                Asteroid (Psyche/Bennu)
              </div>
            </Html>
          </group>
        </group>

        {/* 4. Jupiter Orbit */}
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[18.9, 19.1, 64]} />
            <meshBasicMaterial color="#f97316" transparent opacity={0.2} side={THREE.DoubleSide} />
          </mesh>

          <group 
            position={[19, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectDestination('jupiter');
            }}
          >
            <mesh>
              <sphereGeometry args={[0.9, 32, 32]} />
              <meshStandardMaterial color="#ea580c" roughness={0.4} />
            </mesh>
            {/* Atmospheric cloud bands */}
            <mesh>
              <sphereGeometry args={[0.91, 16, 16]} />
              <meshStandardMaterial color="#fed7aa" wireframe transparent opacity={0.15} />
            </mesh>

            {selectedDestinationId === 'jupiter' && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[1.2, 1.3, 32]} />
                <meshBasicMaterial color="#00e5ff" side={THREE.DoubleSide} />
              </mesh>
            )}

            <Html distanceFactor={22} position={[0, 1.25, 0]}>
              <div 
                className={`px-2 py-0.5 rounded text-xs font-mono whitespace-nowrap cursor-pointer transition-all border ${
                  selectedDestinationId === 'jupiter' 
                    ? 'bg-nasa-cyan/20 border-nasa-cyan text-white shadow-lg shadow-nasa-cyan/20' 
                    : 'bg-space-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                Jupiter / Europa
              </div>
            </Html>
          </group>
        </group>

        {/* 5. New Eden (Exoplanet Corridor) */}
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[23.9, 24.1, 64]} />
            <meshBasicMaterial color="#10b981" transparent opacity={0.35} side={THREE.DoubleSide} />
          </mesh>

          <group 
            position={[24, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectDestination('new-eden');
            }}
          >
            {/* Planet Body: Ocean Blue & Emerald Continents */}
            <mesh>
              <sphereGeometry args={[0.7, 32, 32]} />
              <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.1} />
            </mesh>
            {/* Green Continents overlay */}
            <mesh>
              <sphereGeometry args={[0.705, 16, 16]} />
              <meshStandardMaterial color="#10b981" wireframe transparent opacity={0.4} />
            </mesh>
            {/* Atmosphere Halo */}
            <mesh>
              <sphereGeometry args={[0.78, 16, 16]} />
              <meshBasicMaterial color="#34d399" transparent opacity={0.25} />
            </mesh>

            {selectedDestinationId === 'new-eden' && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.95, 1.05, 32]} />
                <meshBasicMaterial color="#10b981" side={THREE.DoubleSide} />
              </mesh>
            )}

            <Html distanceFactor={24} position={[0, 1.1, 0]}>
              <div 
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold whitespace-nowrap cursor-pointer transition-all border flex items-center gap-1.5 ${
                  selectedDestinationId === 'new-eden' 
                    ? 'bg-emerald-950/90 border-emerald-400 text-white shadow-xl shadow-emerald-500/30 ring-2 ring-emerald-400' 
                    : 'bg-space-900/90 border-emerald-600/50 text-emerald-300 hover:border-emerald-400'
                }`}
              >
                <span>🌿</span>
                <span>NEW EDEN (Habitable)</span>
              </div>
            </Html>
          </group>
        </group>
      </group>
    </>
  );
};
