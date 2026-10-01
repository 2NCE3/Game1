import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  ISSModel,
  HubbleModel,
  JWSTModel,
  LROModel,
  MROModel,
  MAVENModel,
  AsteroidProbesModel,
  JunoModel,
  EuropaClipperModel,
  VoyagerModel,
} from './SatellitesFleet';

interface GalaxySpaceSceneProps {
  highlightedDestination?: string | null;
  onSelectDestination?: (destinationId: string) => void;
}

export const GalaxySpaceScene: React.FC<GalaxySpaceSceneProps> = ({
  highlightedDestination,
  onSelectDestination
}) => {
  const galaxyRef = useRef<THREE.Points>(null);
  const coreRef = useRef<THREE.Group>(null);
  const planetsGroupRef = useRef<THREE.Group>(null);
  const dustCloudRef = useRef<THREE.Points>(null);

  // Generate spiral galaxy particles (tasteful, crisp, reduced count)
  const { positions, colors } = useMemo(() => {
    const count = 1200; // Reduced from 4000 to keep scene clean and not cluttered
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const arms = 3;
    const radius = 18;
    const spin = 1.2;

    const insideColor = new THREE.Color('#e11d48');  // Deep crimson
    const midColor = new THREE.Color('#991b1b');     // Dark red
    const outsideColor = new THREE.Color('#38bdf8'); // Outer cosmic fringe
    const starWhite = new THREE.Color('#ffffff');

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = Math.pow(Math.random(), 1.5) * radius;
      const armAngle = ((i % arms) * 2 * Math.PI) / arms;
      const spinAngle = r * spin;

      // Random scatter
      const randomX = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.7) * (r * 0.4);
      const randomY = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.4) * (r * 0.3);
      const randomZ = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.7) * (r * 0.4);

      pos[i3] = Math.cos(armAngle + spinAngle) * r + randomX;
      pos[i3 + 1] = randomY;
      pos[i3 + 2] = Math.sin(armAngle + spinAngle) * r + randomZ;

      // Blend color based on radius
      let mixedColor: THREE.Color;
      const normRadius = r / radius;
      if (normRadius < 0.25) {
        mixedColor = insideColor.clone().lerp(starWhite, Math.random() * 0.5);
      } else if (normRadius < 0.65) {
        mixedColor = insideColor.clone().lerp(midColor, (normRadius - 0.25) / 0.4);
      } else {
        mixedColor = midColor.clone().lerp(outsideColor, (normRadius - 0.65) / 0.35);
      }

      col[i3] = mixedColor.r;
      col[i3 + 1] = mixedColor.g;
      col[i3 + 2] = mixedColor.b;
    }

    return { positions: pos, colors: col };
  }, []);

  // Ambient cosmic dust particles (reduced and subtle)
  const dustPositions = useMemo(() => {
    const count = 180;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return pos;
  }, []);

  // Animation loop
  useFrame((_, delta) => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y += delta * 0.04;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y -= delta * 0.08;
    }
    if (dustCloudRef.current) {
      dustCloudRef.current.rotation.y += delta * 0.015;
    }
    if (planetsGroupRef.current) {
      planetsGroupRef.current.children.forEach((child, idx) => {
        child.rotation.y += delta * (0.05 + idx * 0.015);
      });
    }
  });

  return (
    <>
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        autoRotate={true}
        autoRotateSpeed={0.4}
        minDistance={4}
        maxDistance={40}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 3.2}
      />

      {/* Atmospheric Space Lighting */}
      <ambientLight intensity={0.5} color="#180a12" />
      <directionalLight position={[10, 15, 10]} intensity={1.8} color="#ffffff" />
      <directionalLight position={[-15, -10, -10]} intensity={0.8} color="#ef4444" />
      <pointLight position={[0, 0, 0]} intensity={3.5} distance={30} color="#ff3344" />

      {/* Background Starfield */}
      <Stars 
        radius={90} 
        depth={40} 
        count={3500} 
        factor={4} 
        saturation={0.5} 
        fade 
        speed={0.4} 
      />

      {/* Central Galactic Core / Sun System */}
      <group ref={coreRef} position={[0, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.65, 32, 32]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.95, 32, 32]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.35} />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.4, 32, 32]} />
          <meshBasicMaterial color="#991b1b" transparent opacity={0.15} />
        </mesh>
      </group>

      {/* Rotating Spiral Galaxy Points */}
      <points ref={galaxyRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.11}
          vertexColors
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Ambient Cosmic Dust Cloud */}
      <points ref={dustCloudRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={dustPositions.length / 3}
            array={dustPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#f43f5e"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* ── ALL PLANETS IN THE SOLAR SYSTEM & EXOPLANET CORRIDOR ─────── */}
      <group ref={planetsGroupRef}>
        {/* 1. Mercury */}
        <group position={[2.6, -0.2, 1.8]}>
          <mesh>
            <sphereGeometry args={[0.2, 24, 24]} />
            <meshStandardMaterial color="#64748b" roughness={0.9} />
          </mesh>
          <Html distanceFactor={9} position={[0, 0.4, 0]}>
            <div className="px-1.5 py-0.5 rounded text-[8px] font-mono whitespace-nowrap bg-space-950/80 border border-slate-700 text-slate-300 pointer-events-none">
              Mercury
            </div>
          </Html>
        </group>

        {/* 2. Venus */}
        <group position={[3.6, 0.3, -2.6]}>
          <mesh>
            <sphereGeometry args={[0.38, 32, 32]} />
            <meshStandardMaterial color="#ca8a04" roughness={0.6} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.395, 20, 20]} />
            <meshBasicMaterial color="#fef08a" transparent opacity={0.2} />
          </mesh>
          <Html distanceFactor={9} position={[0, 0.58, 0]}>
            <div className="px-1.5 py-0.5 rounded text-[8px] font-mono whitespace-nowrap bg-space-950/80 border border-amber-600/40 text-amber-200 pointer-events-none">
              Venus
            </div>
          </Html>
        </group>

        {/* 3. Earth & Moon System */}
        <group position={[-3.5, 0.8, 5.2]}>
          <mesh onClick={() => onSelectDestination && onSelectDestination('earth-orbit')}>
            <sphereGeometry args={[0.55, 32, 32]} />
            <meshStandardMaterial color="#1e40af" roughness={0.35} metalness={0.1} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.575, 24, 24]} />
            <meshBasicMaterial color="#60a5fa" transparent opacity={0.25} />
          </mesh>
          <Html distanceFactor={9} position={[0, 0.8, 0]}>
            <div 
              onClick={() => onSelectDestination && onSelectDestination('earth-orbit')}
              className="px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap bg-space-950/85 border border-cyan-500/40 text-cyan-200 cursor-pointer hover:border-cyan-400"
            >
              Earth
            </div>
          </Html>

          {/* Earth Satellites */}
          <ISSModel orbitRadius={0.92} speed={0.45} />
          <HubbleModel orbitRadius={1.25} speed={0.32} />
          <JWSTModel position={[1.8, 0.3, 0.8]} />

          {/* Moon */}
          <group position={[1.1, 0.2, 0]}>
            <mesh onClick={() => onSelectDestination && onSelectDestination('moon')}>
              <sphereGeometry args={[0.16, 20, 20]} />
              <meshStandardMaterial color="#64748b" roughness={0.9} metalness={0.02} />
            </mesh>
            <LROModel orbitRadius={0.32} speed={0.7} />
            <Html distanceFactor={8} position={[0, 0.32, 0]}>
              <div 
                onClick={() => onSelectDestination && onSelectDestination('moon')}
                className="px-1 py-0.2 rounded text-[7.5px] font-mono whitespace-nowrap bg-space-950/85 border border-slate-700 text-slate-300 cursor-pointer"
              >
                Moon
              </div>
            </Html>
          </group>
        </group>

        {/* 4. Mars */}
        <group position={[-5.8, -0.4, -4.5]}>
          <mesh onClick={() => onSelectDestination && onSelectDestination('mars')}>
            <sphereGeometry args={[0.48, 32, 32]} />
            <meshStandardMaterial color="#b45309" roughness={0.85} metalness={0.05} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.51, 20, 20]} />
            <meshBasicMaterial color="#d97706" transparent opacity={0.14} />
          </mesh>
          <Html distanceFactor={9} position={[0, 0.7, 0]}>
            <div 
              onClick={() => onSelectDestination && onSelectDestination('mars')}
              className="px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap bg-space-950/85 border border-orange-500/40 text-orange-200 cursor-pointer hover:border-orange-400"
            >
              Mars
            </div>
          </Html>
          <MROModel orbitRadius={0.78} speed={0.5} />
          <MAVENModel orbitRadius={1.05} speed={0.35} />
        </group>

        {/* 5. Asteroid Belt */}
        <group position={[5.2, -0.5, -6.5]}>
          <mesh rotation={[0.4, 0.8, 0.2]} onClick={() => onSelectDestination && onSelectDestination('asteroid')}>
            <dodecahedronGeometry args={[0.26, 1]} />
            <meshStandardMaterial color="#475569" roughness={0.95} metalness={0.15} />
          </mesh>
          <Html distanceFactor={9} position={[0, 0.45, 0]}>
            <div 
              onClick={() => onSelectDestination && onSelectDestination('asteroid')}
              className="px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap bg-space-950/85 border border-slate-600/40 text-slate-300 cursor-pointer"
            >
              Asteroid Belt
            </div>
          </Html>
          <AsteroidProbesModel />
        </group>

        {/* 6. Jupiter & Europa */}
        <group position={[-8.5, 0.3, 1.2]}>
          <mesh onClick={() => onSelectDestination && onSelectDestination('jupiter')}>
            <sphereGeometry args={[0.9, 32, 32]} />
            <meshStandardMaterial color="#b45309" roughness={0.55} metalness={0.05} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.915, 24, 24]} />
            <meshStandardMaterial color="#fed7aa" wireframe transparent opacity={0.18} />
          </mesh>
          <Html distanceFactor={10} position={[0, 1.25, 0]}>
            <div 
              onClick={() => onSelectDestination && onSelectDestination('jupiter')}
              className="px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap bg-space-950/85 border border-amber-500/40 text-amber-200 cursor-pointer"
            >
              Jupiter
            </div>
          </Html>
          <JunoModel orbitRadius={1.5} speed={0.3} />
          <EuropaClipperModel orbitRadius={2.0} speed={0.22} />
        </group>

        {/* 7. Saturn */}
        <group position={[9.8, -0.5, -3.2]}>
          <mesh>
            <sphereGeometry args={[0.75, 32, 32]} />
            <meshStandardMaterial color="#e2d6b5" roughness={0.55} metalness={0.05} />
          </mesh>
          <mesh rotation={[Math.PI / 2.5, 0, 0]}>
            <ringGeometry args={[0.98, 1.6, 48]} />
            <meshStandardMaterial color="#d4b996" transparent opacity={0.7} side={THREE.DoubleSide} />
          </mesh>
          <Html distanceFactor={10} position={[0, 1.1, 0]}>
            <div className="px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap bg-space-950/85 border border-amber-500/40 text-amber-200 pointer-events-none">
              Saturn
            </div>
          </Html>
        </group>

        {/* 8. Uranus */}
        <group position={[-11.2, 0.6, -5.8]}>
          <mesh>
            <sphereGeometry args={[0.55, 32, 32]} />
            <meshStandardMaterial color="#7dd3fc" roughness={0.5} metalness={0.1} />
          </mesh>
          <mesh rotation={[0.2, 0, Math.PI / 2]}>
            <ringGeometry args={[0.75, 0.9, 32]} />
            <meshBasicMaterial color="#bae6fd" transparent opacity={0.25} side={THREE.DoubleSide} />
          </mesh>
          <Html distanceFactor={10} position={[0, 0.85, 0]}>
            <div className="px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap bg-space-950/85 border border-sky-500/40 text-sky-200 pointer-events-none">
              Uranus
            </div>
          </Html>
        </group>

        {/* 9. Neptune */}
        <group position={[12.8, 0.4, 5.2]}>
          <mesh>
            <sphereGeometry args={[0.52, 32, 32]} />
            <meshStandardMaterial color="#1d4ed8" roughness={0.4} metalness={0.1} />
          </mesh>
          <Html distanceFactor={10} position={[0, 0.8, 0]}>
            <div className="px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap bg-space-950/85 border border-blue-500/40 text-blue-200 pointer-events-none">
              Neptune
            </div>
          </Html>
        </group>

        {/* 10. New Eden (Proxima b Exoplanet) */}
        <group position={[7.5, 0.6, 2]}>
          <mesh onClick={() => onSelectDestination && onSelectDestination('new-eden')}>
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
          <Html distanceFactor={10} position={[0, 1.05, 0]}>
            <div 
              onClick={() => onSelectDestination && onSelectDestination('new-eden')}
              className="px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap bg-emerald-950/90 border border-emerald-400 text-white cursor-pointer shadow-lg shadow-emerald-500/30"
            >
              New Eden (Exoplanet)
            </div>
          </Html>
        </group>
      </group>

      {/* Voyager 1 Deep Space Interstellar Trajectory */}
      <VoyagerModel position={[14, 4.5, -8]} />
    </>
  );
};
