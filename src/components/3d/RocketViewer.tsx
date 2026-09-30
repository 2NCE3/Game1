import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { LaunchVehicle } from '../../types/mission';

interface RocketViewerProps {
  vehicle: LaunchVehicle | null;
}

export const RocketViewer: React.FC<RocketViewerProps> = ({ vehicle }) => {
  const rocketGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (rocketGroupRef.current) {
      rocketGroupRef.current.rotation.y += delta * 0.15;
    }
  });

  const tier = vehicle?.tier || 'MEDIUM';

  return (
    <>
      <OrbitControls 
        enablePan={false} 
        minDistance={3} 
        maxDistance={12} 
        maxPolarAngle={Math.PI / 1.7} 
        minPolarAngle={Math.PI / 3} 
      />

      <group ref={rocketGroupRef} position={[0, -1.8, 0]}>
        {/* Core Stage 1 Body */}
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry 
            args={[
              tier === 'SUPER HEAVY' ? 0.65 : (tier === 'HEAVY' ? 0.48 : (tier === 'MEDIUM' ? 0.4 : 0.28)),
              tier === 'SUPER HEAVY' ? 0.65 : (tier === 'HEAVY' ? 0.48 : (tier === 'MEDIUM' ? 0.4 : 0.28)),
              2.6,
              32
            ]} 
          />
          <meshStandardMaterial color="#f8fafc" metalness={0.2} roughness={0.3} />
        </mesh>

        {/* NASA-inspired accent striping on core */}
        <mesh position={[0, 2.2, 0]}>
          <cylinderGeometry 
            args={[
              tier === 'SUPER HEAVY' ? 0.655 : (tier === 'HEAVY' ? 0.485 : (tier === 'MEDIUM' ? 0.405 : 0.285)),
              tier === 'SUPER HEAVY' ? 0.655 : (tier === 'HEAVY' ? 0.485 : (tier === 'MEDIUM' ? 0.405 : 0.285)),
              0.15,
              32
            ]} 
          />
          <meshStandardMaterial color="#ff5c00" />
        </mesh>

        {/* Interstage Ring */}
        <mesh position={[0, 2.75, 0]}>
          <cylinderGeometry 
            args={[
              tier === 'SUPER HEAVY' ? 0.64 : (tier === 'HEAVY' ? 0.47 : (tier === 'MEDIUM' ? 0.39 : 0.27)),
              tier === 'SUPER HEAVY' ? 0.64 : (tier === 'HEAVY' ? 0.47 : (tier === 'MEDIUM' ? 0.39 : 0.27)),
              0.25,
              32
            ]} 
          />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Stage 2 Upper Stage */}
        <mesh position={[0, 3.25, 0]}>
          <cylinderGeometry 
            args={[
              tier === 'SUPER HEAVY' ? 0.65 : (tier === 'HEAVY' ? 0.48 : (tier === 'MEDIUM' ? 0.4 : 0.28)),
              tier === 'SUPER HEAVY' ? 0.65 : (tier === 'HEAVY' ? 0.48 : (tier === 'MEDIUM' ? 0.4 : 0.28)),
              0.8,
              32
            ]} 
          />
          <meshStandardMaterial color="#e2e8f0" metalness={0.3} roughness={0.3} />
        </mesh>

        {/* Payload Fairing (Aerodynamic Nose Cone) */}
        <group position={[0, 4.1, 0]}>
          {/* Fairing Cylindrical Base */}
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry 
              args={[
                tier === 'SUPER HEAVY' ? 0.72 : (tier === 'HEAVY' ? 0.54 : (tier === 'MEDIUM' ? 0.46 : 0.32)),
                tier === 'SUPER HEAVY' ? 0.65 : (tier === 'HEAVY' ? 0.48 : (tier === 'MEDIUM' ? 0.4 : 0.28)),
                0.3,
                32
              ]} 
            />
            <meshStandardMaterial color="#f1f5f9" metalness={0.1} />
          </mesh>
          {/* Fairing Cone Tip */}
          <mesh position={[0, 0.45, 0]}>
            <coneGeometry 
              args={[
                tier === 'SUPER HEAVY' ? 0.72 : (tier === 'HEAVY' ? 0.54 : (tier === 'MEDIUM' ? 0.46 : 0.32)),
                1.0,
                32
              ]} 
            />
            <meshStandardMaterial color="#f8fafc" metalness={0.1} />
          </mesh>
        </group>

        {/* Side Boosters for Heavy / Super Heavy */}
        {(tier === 'HEAVY' || tier === 'SUPER HEAVY') && (
          <>
            {/* Left Booster */}
            <group position={[-0.85, 1.2, 0]}>
              <mesh>
                <cylinderGeometry args={[0.38, 0.38, 2.4, 24]} />
                <meshStandardMaterial color="#f1f5f9" metalness={0.2} />
              </mesh>
              {/* Booster Nose Cone */}
              <mesh position={[0, 1.45, 0]}>
                <coneGeometry args={[0.38, 0.5, 24]} />
                <meshStandardMaterial color="#f1f5f9" />
              </mesh>
              {/* Booster Engine Bell */}
              <mesh position={[0, -1.35, 0]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.22, 0.35, 16, 1, true]} />
                <meshStandardMaterial color="#334155" metalness={0.9} side={THREE.DoubleSide} />
              </mesh>
            </group>

            {/* Right Booster */}
            <group position={[0.85, 1.2, 0]}>
              <mesh>
                <cylinderGeometry args={[0.38, 0.38, 2.4, 24]} />
                <meshStandardMaterial color="#f1f5f9" metalness={0.2} />
              </mesh>
              <mesh position={[0, 1.45, 0]}>
                <coneGeometry args={[0.38, 0.5, 24]} />
                <meshStandardMaterial color="#f1f5f9" />
              </mesh>
              <mesh position={[0, -1.35, 0]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.22, 0.35, 16, 1, true]} />
                <meshStandardMaterial color="#334155" metalness={0.9} side={THREE.DoubleSide} />
              </mesh>
            </group>
          </>
        )}

        {/* Main Base Engines */}
        <group position={[0, 0, 0]}>
          <mesh position={[0, -0.05, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.26, 0.4, 20, 1, true]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} side={THREE.DoubleSide} />
          </mesh>
          {/* Small engine glow on stand */}
          <pointLight position={[0, -0.2, 0]} color="#f97316" intensity={0.6} distance={1.2} />
        </group>

        {/* Launch Pad Stand Support Ring */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[1.5, 1.8, 0.3, 32]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.4} />
        </mesh>
      </group>
    </>
  );
};
