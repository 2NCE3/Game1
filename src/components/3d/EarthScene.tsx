import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export interface EarthSceneProps {
  sceneVariant?: 'depleted' | 'lunar' | 'deep_space' | 'new_eden' | number;
}

export const EarthScene: React.FC<EarthSceneProps> = ({ sceneVariant = 'depleted' }) => {
  const earthRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const satelliteRef = useRef<THREE.Group>(null);

  // Normalize variant key
  let variantKey = 'depleted';
  if (typeof sceneVariant === 'number') {
    const keys = ['depleted', 'lunar', 'deep_space', 'new_eden'];
    variantKey = keys[sceneVariant % keys.length];
  } else {
    variantKey = sceneVariant;
  }

  // Planet color palettes per slide
  const PALETTES = {
    depleted: {
      ocean: '#78350f',       // Scorched amber/brown oceans
      land: '#b45309',        // Arid desert ochre
      clouds: '#fef3c7',      // Thin smoky dust haze
      cloudOpacity: 0.22,
      atmosphere: '#ea580c',  // Fading reddish-amber atmosphere
      atmoOpacity: 0.18,
    },
    lunar: {
      ocean: '#334155',       // Deep basalt sea
      land: '#94a3b8',        // Silvery cratered highlands
      clouds: '#e2e8f0',      // Orbital particles
      cloudOpacity: 0.12,
      atmosphere: '#cbd5e1',  // Pale vacuum specular rim
      atmoOpacity: 0.08,
    },
    deep_space: {
      ocean: '#1e1b4b',       // Cosmic abyss
      land: '#2563eb',        // Interstellar icy ridge
      clouds: '#818cf8',      // Stardust nebular dust
      cloudOpacity: 0.28,
      atmosphere: '#38bdf8',  // Deep space cyan aurora
      atmoOpacity: 0.25,
    },
    new_eden: {
      ocean: '#0284c7',       // Pristine azure turquoise oceans
      land: '#059669',        // Lush photosynthetic emerald haven
      clouds: '#ffffff',      // Pure white spiraling clouds
      cloudOpacity: 0.48,
      atmosphere: '#10b981',  // Glowing emerald-cyan life aura
      atmoOpacity: 0.35,
    },
  };

  const palette = PALETTES[variantKey as keyof typeof PALETTES] || PALETTES.depleted;

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.06;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.08;
    }
    if (satelliteRef.current) {
      satelliteRef.current.rotation.y += delta * 0.22;
      satelliteRef.current.rotation.x += delta * 0.04;
    }
  });

  return (
    <>
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate={false} 
        maxPolarAngle={Math.PI / 1.7} 
        minPolarAngle={Math.PI / 2.5} 
      />

      <group ref={earthRef} position={[0, -0.2, 0]}>
        {/* Core Planet Oceanic Sphere */}
        <mesh>
          <sphereGeometry args={[2.5, 64, 64]} />
          <meshStandardMaterial 
            color={palette.ocean} 
            roughness={0.55} 
            metalness={0.15} 
          />
        </mesh>

        {/* Continents (procedural stylized landmasses) */}
        <mesh>
          <sphereGeometry args={[2.51, 64, 64]} />
          <meshStandardMaterial 
            color={palette.land} 
            roughness={0.78} 
            metalness={0.08} 
            transparent={true}
            opacity={0.88}
          />
        </mesh>

        {/* Atmospheric Clouds Layer */}
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[2.56, 48, 48]} />
          <meshStandardMaterial 
            color={palette.clouds} 
            transparent={true} 
            opacity={palette.cloudOpacity} 
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Atmospheric Glow Shell */}
        <mesh>
          <sphereGeometry args={[2.72, 32, 32]} />
          <meshBasicMaterial 
            color={palette.atmosphere} 
            transparent={true} 
            opacity={palette.atmoOpacity} 
            side={THREE.BackSide} 
          />
        </mesh>
      </group>

      {/* Orbiting Satellite Marker (Kapton Gold Foil & Silver Aluminum) */}
      <group ref={satelliteRef}>
        <group position={[3.6, 0.4, 0]}>
          {/* Main Satellite Body - Kapton Gold Foil */}
          <mesh>
            <boxGeometry args={[0.09, 0.09, 0.13]} />
            <meshStandardMaterial color="#eab308" metalness={0.96} roughness={0.12} />
          </mesh>

          {/* Instrument Deck - Aerospace Silver */}
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.08, 0.015, 0.12]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.92} roughness={0.2} />
          </mesh>

          {/* Left Solar Wing with Silver Truss */}
          <group position={[0.22, 0, 0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.26, 0.01, 0.09]} />
              <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.3} />
            </mesh>
            <mesh position={[-0.14, 0, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.06]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
            </mesh>
          </group>

          {/* Right Solar Wing with Silver Truss */}
          <group position={[-0.22, 0, 0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.26, 0.01, 0.09]} />
              <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.3} />
            </mesh>
            <mesh position={[0.14, 0, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.06]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
            </mesh>
          </group>

          {/* Parabolic High-Gain Dish - Silver & Gold */}
          <mesh position={[0, 0, 0.07]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.008, 0.02, 16, 1, true]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.8} roughness={0.2} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, 0.085]}>
            <sphereGeometry args={[0.008, 8, 8]} />
            <meshStandardMaterial color="#eab308" metalness={0.95} />
          </mesh>

          {/* Telemetry Beacon Light */}
          <pointLight color={palette.atmosphere} intensity={1.8} distance={1.2} />
        </group>

        {/* Orbit Ground Track Line */}
        <mesh rotation={[Math.PI / 2.3, 0, 0]}>
          <ringGeometry args={[3.585, 3.615, 64]} />
          <meshBasicMaterial color={palette.atmosphere} transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </>
  );
};
