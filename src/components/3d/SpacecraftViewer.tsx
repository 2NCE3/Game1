import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { 
  SpacecraftBus, 
  PowerSystem, 
  CommsSystem, 
  PropulsionSystem, 
  PayloadInstrument 
} from '../../types/mission';

interface SpacecraftViewerProps {
  bus: SpacecraftBus | null;
  power: PowerSystem | null;
  comms: CommsSystem | null;
  propulsion: PropulsionSystem | null;
  payloads: PayloadInstrument[];
  interactive?: boolean;
}

export const SpacecraftViewer: React.FC<SpacecraftViewerProps> = ({
  bus,
  power,
  comms,
  propulsion,
  payloads,
  interactive = true,
}) => {
  const craftRef = useRef<THREE.Group>(null);
  const ionGlowRef = useRef<THREE.PointLight>(null);

  // Smooth rotation
  useFrame((state, delta) => {
    if (craftRef.current && interactive) {
      craftRef.current.rotation.y += delta * 0.12;
    }
    if (ionGlowRef.current) {
      // Subtle plasma flicker
      ionGlowRef.current.intensity = 1.2 + Math.sin(state.clock.elapsedTime * 8) * 0.3;
    }
  });

  const busType = bus?.id || 'bus-standard';
  const hasGPR = payloads.some(p => p.id === 'inst-gpr');
  const hasRadar = payloads.some(p => p.id === 'inst-radar');
  const hasCamera = payloads.some(p => p.id === 'inst-camera');
  const hasSpectrometer = payloads.some(p => p.id === 'inst-spectrometer');
  const hasMagnetometer = payloads.some(p => p.id === 'inst-magnetometer');

  return (
    <>
      {interactive && (
        <OrbitControls 
          enablePan={false} 
          minDistance={2.5} 
          maxDistance={10} 
          maxPolarAngle={Math.PI / 1.5} 
          minPolarAngle={Math.PI / 4} 
        />
      )}

      <group ref={craftRef} position={[0, 0, 0]}>
        {/* ================= BUS CHASSIS ================= */}
        {busType === 'bus-light' && (
          // Light Bus: Compact aerospace silver aluminum prism with Kapton gold foil
          <group>
            <mesh>
              <boxGeometry args={[1.0, 1.2, 1.0]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.2} />
            </mesh>
            {/* Gold MLI foil panel insert */}
            <mesh position={[0, 0, 0.51]}>
              <planeGeometry args={[0.8, 1.0]} />
              <meshStandardMaterial color="#eab308" metalness={0.96} roughness={0.12} />
            </mesh>
            {/* Structural corner titanium truss */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.04, 1.24, 1.04]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.85} wireframe />
            </mesh>
          </group>
        )}

        {busType === 'bus-standard' && (
          // Standard Bus: Hexagonal Kapton gold foil spacecraft body with silver decks
          <group>
            <mesh>
              <cylinderGeometry args={[0.75, 0.75, 1.6, 6]} />
              <meshStandardMaterial color="#eab308" metalness={0.95} roughness={0.14} />
            </mesh>
            {/* Top equipment deck - milled aerospace aluminum */}
            <mesh position={[0, 0.82, 0]}>
              <cylinderGeometry args={[0.78, 0.78, 0.08, 6]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.25} />
            </mesh>
            {/* Lower propulsion deck - titanium silver */}
            <mesh position={[0, -0.82, 0]}>
              <cylinderGeometry args={[0.78, 0.78, 0.08, 6]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.2} />
            </mesh>
            {/* Avionics access panels - brushed silver alloy */}
            <mesh position={[0.76, 0, 0]}>
              <boxGeometry args={[0.02, 1.1, 0.6]} />
              <meshStandardMaterial color="#f1f5f9" metalness={0.88} roughness={0.25} />
            </mesh>
          </group>
        )}

        {busType === 'bus-heavy' && (
          // Heavy Bus: Reinforced titanium isogrid silver chassis with gold thermal blankets
          <group>
            <mesh>
              <cylinderGeometry args={[1.0, 1.05, 1.9, 8]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.2} />
            </mesh>
            {/* Center radiation vault ring */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[1.08, 1.08, 0.6, 8]} />
              <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.3} />
            </mesh>
            {/* Gold foil protective blankets */}
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[1.02, 1.02, 0.5, 8]} />
              <meshStandardMaterial color="#eab308" metalness={0.96} roughness={0.12} />
            </mesh>
            {/* Top heavy instrument plate - silver titanium */}
            <mesh position={[0, 1.0, 0]}>
              <cylinderGeometry args={[1.05, 1.05, 0.1, 8]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        )}

        {/* ================= POWER SYSTEM (SOLAR ARRAYS OR RTG) ================= */}
        {power && power.type === 'SOLAR' && (
          <group>
            {/* Left Solar Wing */}
            <group position={[-0.85, 0.1, 0]}>
              {/* Articulated Boom */}
              <mesh position={[-0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.03, 0.03, 0.6]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.8} />
              </mesh>
              {/* Solar Panels (Blue crystalline cells) */}
              <mesh position={[-1.2 - (power.id === 'power-large' ? 0.4 : 0), 0, 0]}>
                <boxGeometry 
                  args={[
                    power.id === 'power-large' ? 2.2 : (power.id === 'power-medium' ? 1.6 : 1.0),
                    0.02, 
                    power.id === 'power-large' ? 0.8 : 0.6
                  ]} 
                />
                <meshStandardMaterial color="#0369a1" metalness={0.85} roughness={0.2} />
              </mesh>
            </group>

            {/* Right Solar Wing */}
            <group position={[0.85, 0.1, 0]}>
              <mesh position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.03, 0.03, 0.6]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.8} />
              </mesh>
              <mesh position={[1.2 + (power.id === 'power-large' ? 0.4 : 0), 0, 0]}>
                <boxGeometry 
                  args={[
                    power.id === 'power-large' ? 2.2 : (power.id === 'power-medium' ? 1.6 : 1.0),
                    0.02, 
                    power.id === 'power-large' ? 0.8 : 0.6
                  ]} 
                />
                <meshStandardMaterial color="#0369a1" metalness={0.85} roughness={0.2} />
              </mesh>
            </group>
          </group>
        )}

        {power && power.type === 'RTG' && (
          // Advanced RTG Stirling: Heat radiator fins and radioactive core glow
          <group position={[0, -0.2, 0.9]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.7, 16]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Cooling fins */}
            {Array.from({ length: 6 }).map((_, i) => (
              <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]}>
                <boxGeometry args={[0.6, 0.02, 0.65]} />
                <meshStandardMaterial color="#1e293b" metalness={0.9} />
              </mesh>
            ))}
            {/* Stirling heat glow indicator */}
            <pointLight color="#ff5722" intensity={1.5} distance={1.2} />
          </group>
        )}

        {/* ================= COMMUNICATION DISH / ANTENNA ================= */}
        {comms && comms.type === 'LOW_GAIN' && (
          // Low Gain: Dual omni antenna whips
          <group position={[0.4, 0.9, 0.3]}>
            <mesh>
              <cylinderGeometry args={[0.015, 0.015, 0.7]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.35, 0]}>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshStandardMaterial color="#f59e0b" />
            </mesh>
          </group>
        )}

        {comms && (comms.type === 'MEDIUM_GAIN' || comms.type === 'HIGH_GAIN' || comms.type === 'DEEP_SPACE') && (
          // High Gain Cassegrain Dish on gimbal mount
          <group position={[0, 1.05, 0]}>
            {/* Gimbal Pedestal */}
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.08, 0.12, 0.2, 16]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} />
            </mesh>
            {/* Dish Parabolic Bowl */}
            <mesh position={[0, 0.3, 0]} rotation={[0.4, 0, 0]}>
              <cylinderGeometry 
                args={[
                  comms.type === 'DEEP_SPACE' ? 0.75 : (comms.type === 'HIGH_GAIN' ? 0.6 : 0.4), 
                  0.1, 
                  0.15, 
                  24, 
                  1, 
                  true
                ]} 
              />
              <meshStandardMaterial 
                color="#f8fafc" 
                metalness={0.3} 
                roughness={0.2} 
                side={THREE.DoubleSide} 
              />
            </mesh>
            {/* Feed horn sub-reflector */}
            <mesh position={[0, 0.45, 0.1]}>
              <coneGeometry args={[0.06, 0.12, 12]} />
              <meshStandardMaterial color="#eab308" metalness={0.9} />
            </mesh>
            {/* Optical Laser Turret for Deep Space Array */}
            {comms.type === 'DEEP_SPACE' && (
              <mesh position={[0.3, 0.2, 0.2]}>
                <boxGeometry args={[0.15, 0.2, 0.15]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.2} />
                <pointLight color="#00e5ff" intensity={1.8} distance={0.8} />
              </mesh>
            )}
          </group>
        )}

        {/* ================= PROPULSION SYSTEM ================= */}
        {propulsion && (
          <group position={[0, -0.95, 0]}>
            {propulsion.type === 'CHEMICAL' && (
              // Rocket Bell Nozzle
              <mesh rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.38, 0.6, 24, 1, true]} />
                <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} side={THREE.DoubleSide} />
              </mesh>
            )}

            {propulsion.type === 'ELECTRIC' && (
              // Ion Thruster Grid with Cyan Plasma glow!
              <group>
                <mesh>
                  <cylinderGeometry args={[0.28, 0.28, 0.2, 24]} />
                  <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
                </mesh>
                <mesh position={[0, -0.15, 0]}>
                  <cylinderGeometry args={[0.22, 0.22, 0.05, 24]} />
                  <meshBasicMaterial color="#00e5ff" />
                </mesh>
                {/* Xenon Plasma plume */}
                <pointLight ref={ionGlowRef} position={[0, -0.35, 0]} color="#00e5ff" intensity={2.0} distance={1.8} />
              </group>
            )}

            {propulsion.type === 'HYBRID' && (
              // Hybrid: Main Center Bell + 4 RCS thruster clusters
              <group>
                <mesh rotation={[Math.PI, 0, 0]}>
                  <coneGeometry args={[0.32, 0.5, 24, 1, true]} />
                  <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.2} side={THREE.DoubleSide} />
                </mesh>
                {/* Cold gas RCS blocks */}
                {[-0.5, 0.5].map((x, idx) => (
                  <mesh key={idx} position={[x, 0.1, 0]}>
                    <boxGeometry args={[0.1, 0.1, 0.1]} />
                    <meshStandardMaterial color="#94a3b8" />
                  </mesh>
                ))}
              </group>
            )}
          </group>
        )}

        {/* ================= SCIENTIFIC PAYLOAD INSTRUMENTS ================= */}
        {/* 1. High-Resolution Camera (Optical telescope tube) */}
        {hasCamera && (
          <group position={[0.45, 0.35, 0.5]}>
            <mesh rotation={[0.4, 0.3, 0]}>
              <cylinderGeometry args={[0.12, 0.14, 0.45, 20]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
            {/* Front optical lens glass */}
            <mesh position={[0.07, 0.25, 0.12]}>
              <circleGeometry args={[0.11, 20]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.05} metalness={0.95} />
            </mesh>
          </group>
        )}

        {/* 2. Spectrometer Housing */}
        {hasSpectrometer && (
          <group position={[-0.45, 0.4, 0.45]}>
            <mesh>
              <boxGeometry args={[0.22, 0.28, 0.3]} />
              <meshStandardMaterial color="#1e293b" metalness={0.7} />
            </mesh>
            <mesh position={[0, 0, 0.16]}>
              <planeGeometry args={[0.15, 0.08]} />
              <meshBasicMaterial color="#a855f7" />
            </mesh>
          </group>
        )}

        {/* 3. Ground Penetrating Radar (Deployable dipole antenna) */}
        {hasGPR && (
          <group position={[0, -0.6, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.02, 3.2]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.9} />
            </mesh>
            <pointLight color="#f59e0b" intensity={0.8} distance={0.5} />
          </group>
        )}

        {/* 4. SAR Radar Antenna (Curved mesh antenna reflector) */}
        {hasRadar && !hasGPR && (
          <group position={[0, -0.3, 0.75]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <boxGeometry args={[1.4, 0.03, 0.4]} />
              <meshStandardMaterial color="#38bdf8" metalness={0.7} roughness={0.3} wireframe />
            </mesh>
          </group>
        )}

        {/* 5. Magnetometer (Long 4m boom extending sideways) */}
        {hasMagnetometer && (
          <group position={[-0.5, 0, -0.4]} rotation={[0.2, -0.4, 0]}>
            <mesh position={[-1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.015, 0.015, 2.4]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
            </mesh>
            <mesh position={[-2.4, 0, 0]}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial color="#ef4444" metalness={0.7} />
            </mesh>
          </group>
        )}
      </group>
    </>
  );
};
