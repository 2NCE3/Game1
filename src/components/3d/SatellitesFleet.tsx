import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// ─── 1. ISS (International Space Station) ──────────────────────────────────
export const ISSModel: React.FC<{ orbitRadius?: number; speed?: number }> = ({ 
  orbitRadius = 0.95, 
  speed = 0.45 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime * speed;
      groupRef.current.position.x = Math.cos(t) * orbitRadius;
      groupRef.current.position.z = Math.sin(t) * orbitRadius;
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.18; // inclined orbit
      groupRef.current.rotation.y = -t;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Integrated Truss Beam */}
      <mesh>
        <boxGeometry args={[0.04, 0.04, 0.45]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
      </mesh>
      {/* Pressurized Modules Cluster (Destiny, Unity, Zvezda) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.16, 12]} />
        <meshStandardMaterial color="#f1f5f9" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* 4 Giant Dual Solar Array Wings (Blue Silicon Cells) */}
      {[-0.18, 0.18].map((z, i) => (
        <group key={i} position={[0, 0, z]}>
          {/* Left Wing */}
          <mesh position={[-0.14, 0, 0]}>
            <boxGeometry args={[0.22, 0.005, 0.07]} />
            <meshStandardMaterial color="#0284c7" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Right Wing */}
          <mesh position={[0.14, 0, 0]}>
            <boxGeometry args={[0.22, 0.005, 0.07]} />
            <meshStandardMaterial color="#0284c7" metalness={0.85} roughness={0.2} />
          </mesh>
        </group>
      ))}
      {/* Thermal Radiator Panels */}
      <mesh position={[0, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.08, 0.004, 0.12]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      {/* Orbit Trail */}
      <mesh rotation={[Math.PI / 2.2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.005, orbitRadius + 0.005, 48]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      <Html distanceFactor={8} position={[0, 0.16, 0]}>
        <div className="px-1 py-0.2 rounded text-[6.5px] font-mono whitespace-nowrap bg-black/75 border border-cyan-500/30 text-cyan-200 pointer-events-none scale-90">
          ISS
        </div>
      </Html>
    </group>
  );
};

// ─── 2. HUBBLE SPACE TELESCOPE ──────────────────────────────────────────────
export const HubbleModel: React.FC<{ orbitRadius?: number; speed?: number }> = ({ 
  orbitRadius = 1.3, 
  speed = 0.35 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime * speed + 1.8;
      groupRef.current.position.x = Math.cos(t) * orbitRadius;
      groupRef.current.position.z = Math.sin(t) * orbitRadius;
      groupRef.current.position.y = Math.cos(t * 1.2) * 0.12;
      groupRef.current.rotation.y = -t;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Primary Telescope Tube (High Specular Silver Mylar) */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.045, 0.22, 16]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.12} />
      </mesh>
      {/* Open Aperture Sunshade Door Flap */}
      <mesh position={[0.12, 0.03, 0]} rotation={[0, 0, -0.6]}>
        <circleGeometry args={[0.04, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* Twin Solar Wings */}
      {[-0.09, 0.09].map((z, idx) => (
        <mesh key={idx} position={[0, 0, z]}>
          <boxGeometry args={[0.08, 0.004, 0.12]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} />
        </mesh>
      ))}
      {/* High-Gain Antenna Dishes */}
      <mesh position={[-0.08, 0.05, 0]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial color="#eab308" metalness={0.9} />
      </mesh>
      <Html distanceFactor={8} position={[0, 0.14, 0]}>
        <div className="px-1 py-0.2 rounded text-[6.5px] font-mono whitespace-nowrap bg-black/75 border border-blue-500/30 text-blue-200 pointer-events-none scale-90">
          Hubble
        </div>
      </Html>
    </group>
  );
};

// ─── 3. JAMES WEBB SPACE TELESCOPE (JWST) AT L2 HALO ────────────────────────
export const JWSTModel: React.FC<{ position?: [number, number, number] }> = ({ 
  position = [1.8, 0.35, 0.5] 
}) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* 5-Layer Tennis-Court Sunshield (Silver & Purple Kapton Kite) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.18, 0.38, 4]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.88} roughness={0.2} />
      </mesh>
      {/* 18-Segment Gold Hexagonal Primary Mirror Array */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 3, 0, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.01, 6]} />
        <meshStandardMaterial color="#eab308" metalness={0.98} roughness={0.08} />
      </mesh>
      {/* Secondary Mirror Tripod Mast */}
      <mesh position={[0, 0.11, 0.06]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshBasicMaterial color="#eab308" />
      </mesh>
      <Html distanceFactor={8} position={[0, 0.22, 0]}>
        <div className="px-1 py-0.2 rounded text-[6.5px] font-mono whitespace-nowrap bg-black/75 border border-amber-500/30 text-amber-200 pointer-events-none scale-90">
          JWST (L2)
        </div>
      </Html>
    </group>
  );
};

// ─── 4. LUNAR RECONNAISSANCE ORBITER (LRO) ─────────────────────────────────
export const LROModel: React.FC<{ orbitRadius?: number; speed?: number }> = ({ 
  orbitRadius = 0.36, 
  speed = 0.6 
}) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed;
      ref.current.position.x = Math.cos(t) * orbitRadius;
      ref.current.position.z = Math.sin(t) * orbitRadius;
      ref.current.position.y = Math.sin(t * 2) * 0.08;
      ref.current.rotation.y = -t;
    }
  });

  return (
    <group ref={ref}>
      {/* Main Bus (Kapton Gold Foil Cube) */}
      <mesh>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshStandardMaterial color="#eab308" metalness={0.95} roughness={0.15} />
      </mesh>
      {/* Ka-Band Parabolic High-Gain Dish */}
      <mesh position={[0.04, 0.03, 0]} rotation={[0, 0, -Math.PI / 3]}>
        <cylinderGeometry args={[0.035, 0.005, 0.015, 12, 1, true]} />
        <meshStandardMaterial color="#f8fafc" side={THREE.DoubleSide} />
      </mesh>
      {/* Articulated Solar Panel */}
      <mesh position={[-0.06, 0, 0]}>
        <boxGeometry args={[0.08, 0.004, 0.04]} />
        <meshStandardMaterial color="#0284c7" metalness={0.8} />
      </mesh>
      <Html distanceFactor={7} position={[0, 0.1, 0]}>
        <div className="px-1 py-0.2 rounded text-[6.5px] font-mono whitespace-nowrap bg-black/75 border border-slate-500/30 text-slate-200 pointer-events-none scale-90">
          LRO
        </div>
      </Html>
    </group>
  );
};

// ─── 5. ARTEMIS ORION / APOLLO CSM ─────────────────────────────────────────
export const OrionCSMModel: React.FC<{ orbitRadius?: number; speed?: number }> = ({ 
  orbitRadius = 0.52, 
  speed = 0.42 
}) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed + 2.5;
      ref.current.position.x = Math.cos(t) * orbitRadius;
      ref.current.position.z = Math.sin(t) * orbitRadius;
      ref.current.position.y = Math.cos(t) * 0.06;
      ref.current.rotation.y = -t;
    }
  });

  return (
    <group ref={ref}>
      {/* European Service Module Cylinder */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.07, 16]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.8} />
      </mesh>
      {/* Conical Crew Module Capsule */}
      <mesh position={[0.05, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.038, 0.05, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.6} />
      </mesh>
      {/* 4 X-Wing Solar Panels (Artemis configuration) */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, i) => (
        <group key={i} rotation={[ang, 0, 0]}>
          <mesh position={[-0.02, 0.06, 0]}>
            <boxGeometry args={[0.03, 0.07, 0.004]} />
            <meshStandardMaterial color="#0284c7" metalness={0.8} />
          </mesh>
        </group>
      ))}
      <Html distanceFactor={7} position={[0, 0.12, 0]}>
        <div className="px-1 py-0.2 rounded text-[6.5px] font-mono whitespace-nowrap bg-black/75 border border-emerald-500/30 text-emerald-200 pointer-events-none scale-90">
          Orion
        </div>
      </Html>
    </group>
  );
};

// ─── 6. MARS RECONNAISSANCE ORBITER (MRO) ──────────────────────────────────
export const MROModel: React.FC<{ orbitRadius?: number; speed?: number }> = ({ 
  orbitRadius = 0.85, 
  speed = 0.5 
}) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed;
      ref.current.position.x = Math.cos(t) * orbitRadius;
      ref.current.position.z = Math.sin(t) * orbitRadius;
      ref.current.position.y = Math.sin(t * 1.8) * 0.15;
      ref.current.rotation.y = -t;
    }
  });

  return (
    <group ref={ref}>
      {/* Main Avionics Body (Gold Kapton) */}
      <mesh>
        <boxGeometry args={[0.06, 0.07, 0.06]} />
        <meshStandardMaterial color="#eab308" metalness={0.92} roughness={0.15} />
      </mesh>
      {/* 3-Meter High Gain Dish (White Carbon Composite) */}
      <mesh position={[0, 0.06, 0.04]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.01, 0.025, 16, 1, true]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.3} side={THREE.DoubleSide} />
      </mesh>
      {/* HiRISE Telescope Barrel */}
      <mesh position={[0, -0.05, 0.02]} rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.025, 0.07, 12]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
      {/* Huge Solar Wings (Twin 10m arrays) */}
      {[-0.14, 0.14].map((x, idx) => (
        <mesh key={idx} position={[x, 0, 0]}>
          <boxGeometry args={[0.18, 0.005, 0.07]} />
          <meshStandardMaterial color="#0284c7" metalness={0.85} roughness={0.2} />
        </mesh>
      ))}
      {/* Orbit Trace */}
      <mesh rotation={[Math.PI / 2.3, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.005, orbitRadius + 0.005, 48]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
      <Html distanceFactor={8} position={[0, 0.16, 0]}>
        <div className="px-1 py-0.2 rounded text-[6.5px] font-mono whitespace-nowrap bg-black/75 border border-red-500/30 text-red-200 pointer-events-none scale-90">
          MRO
        </div>
      </Html>
    </group>
  );
};

// ─── 7. MAVEN & MARS ODYSSEY ───────────────────────────────────────────────
export const MAVENModel: React.FC<{ orbitRadius?: number; speed?: number }> = ({ 
  orbitRadius = 1.15, 
  speed = 0.35 
}) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed + 3.14;
      ref.current.position.x = Math.cos(t) * orbitRadius;
      ref.current.position.z = Math.sin(t) * orbitRadius;
      ref.current.position.y = Math.cos(t * 1.5) * 0.18;
      ref.current.rotation.y = -t;
    }
  });

  return (
    <group ref={ref}>
      {/* Core Bus */}
      <mesh>
        <cylinderGeometry args={[0.035, 0.035, 0.05, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.85} />
      </mesh>
      {/* Gull-Wing Gullied Solar Panels */}
      {[-0.09, 0.09].map((x, i) => (
        <mesh key={i} position={[x, 0.02, 0]} rotation={[0, 0, i === 0 ? 0.3 : -0.3]}>
          <boxGeometry args={[0.1, 0.004, 0.05]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} />
        </mesh>
      ))}
      {/* Magnetometer Boom */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.003, 0.003, 0.08]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <Html distanceFactor={8} position={[0, 0.14, 0]}>
        <div className="px-1 py-0.2 rounded text-[6.5px] font-mono whitespace-nowrap bg-black/75 border border-rose-500/30 text-rose-200 pointer-events-none scale-90">
          MAVEN
        </div>
      </Html>
    </group>
  );
};

// ─── 8. OSIRIS-REx & PSYCHE (ASTEROID RECON PROBES) ─────────────────────────
export const AsteroidProbesModel: React.FC = () => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * 0.4;
      ref.current.position.x = Math.cos(t) * 0.65;
      ref.current.position.z = Math.sin(t) * 0.65;
      ref.current.position.y = Math.sin(t * 1.5) * 0.12;
      ref.current.rotation.y = -t;
    }
  });

  return (
    <group ref={ref}>
      {/* OSIRIS-REx Bus */}
      <mesh>
        <boxGeometry args={[0.055, 0.055, 0.055]} />
        <meshStandardMaterial color="#eab308" metalness={0.9} />
      </mesh>
      {/* TAGSAM Sampling Robotic Arm */}
      <mesh position={[0, -0.04, 0.02]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 0.06]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
      </mesh>
      {/* Sample Return Capsule (Heat Shield Dome) */}
      <mesh position={[0, 0.035, 0]}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      {/* Angled Solar Wings */}
      {[-0.08, 0.08].map((x, idx) => (
        <mesh key={idx} position={[x, 0.015, 0]} rotation={[0, 0, idx === 0 ? 0.25 : -0.25]}>
          <boxGeometry args={[0.09, 0.004, 0.05]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} />
        </mesh>
      ))}
      <Html distanceFactor={7} position={[0, 0.12, 0]}>
        <div className="px-1 py-0.2 rounded text-[6.5px] font-mono whitespace-nowrap bg-black/75 border border-amber-500/30 text-amber-200 pointer-events-none scale-90">
          OSIRIS-REx
        </div>
      </Html>
    </group>
  );
};

// ─── 9. JUNO (JUPITER POLAR ORBITER) ────────────────────────────────────────
export const JunoModel: React.FC<{ orbitRadius?: number; speed?: number }> = ({ 
  orbitRadius = 1.6, 
  speed = 0.35 
}) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed;
      // High inclination polar elliptical orbit
      ref.current.position.x = Math.cos(t) * orbitRadius;
      ref.current.position.y = Math.sin(t) * (orbitRadius * 1.3);
      ref.current.position.z = Math.sin(t * 0.5) * 0.4;
      ref.current.rotation.z += 0.03; // spin-stabilized
    }
  });

  return (
    <group ref={ref}>
      {/* Titanium Radiation Vault Hub */}
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, 0.04, 6]} />
        <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Iconic 3 Giant Solar Wings at 120 Degrees (20m total wingspan) */}
      {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((ang, i) => (
        <group key={i} rotation={[0, 0, ang]}>
          <mesh position={[0, 0.16, 0]}>
            <boxGeometry args={[0.05, 0.24, 0.005]} />
            <meshStandardMaterial color="#0284c7" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Magnetometer Boom on wingtip 1 */}
          {i === 0 && (
            <mesh position={[0, 0.31, 0]}>
              <cylinderGeometry args={[0.003, 0.003, 0.06]} />
              <meshStandardMaterial color="#e2e8f0" />
            </mesh>
          )}
        </group>
      ))}
      <Html distanceFactor={8} position={[0, 0.25, 0]}>
        <div className="px-1 py-0.2 rounded text-[6.5px] font-mono whitespace-nowrap bg-black/75 border border-orange-500/30 text-orange-200 pointer-events-none scale-90">
          Juno
        </div>
      </Html>
    </group>
  );
};

// ─── 10. EUROPA CLIPPER (NASA 2024 FLAGSHIP) ────────────────────────────────
export const EuropaClipperModel: React.FC<{ orbitRadius?: number; speed?: number }> = ({ 
  orbitRadius = 2.1, 
  speed = 0.28 
}) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed + 1.2;
      ref.current.position.x = Math.cos(t) * orbitRadius;
      ref.current.position.z = Math.sin(t) * orbitRadius;
      ref.current.position.y = Math.sin(t * 0.2) * 0.2;
      ref.current.rotation.y = -t;
    }
  });

  return (
    <group ref={ref}>
      {/* Spacecraft Avionics Bus */}
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, 0.08, 8]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.85} />
      </mesh>
      {/* 3-Meter High Gain Dish */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.065, 0.01, 0.02, 16, 1, true]} />
        <meshStandardMaterial color="#f8fafc" side={THREE.DoubleSide} />
      </mesh>
      {/* Massive Dual 5-Panel Solar Wings (30m deployed wingspan) */}
      {[-0.24, 0.24].map((x, idx) => (
        <mesh key={idx} position={[x, 0, 0]}>
          <boxGeometry args={[0.34, 0.005, 0.07]} />
          <meshStandardMaterial color="#0284c7" metalness={0.85} roughness={0.15} />
        </mesh>
      ))}
      {/* Ice Penetrating Radar (REASON) Deployable Booms */}
      <mesh position={[0, -0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.004, 0.004, 0.45]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} />
      </mesh>
      <Html distanceFactor={9} position={[0, 0.2, 0]}>
        <div className="px-1 py-0.2 rounded text-[6.5px] font-mono whitespace-nowrap bg-black/75 border border-blue-500/30 text-blue-200 pointer-events-none scale-90">
          Europa Clipper
        </div>
      </Html>
    </group>
  );
};

// ─── 11. VOYAGER 1 & 2 (INTERSTELLAR ESCAPE TRAJECTORY) ─────────────────────
export const VoyagerModel: React.FC<{ position?: [number, number, number] }> = ({ 
  position = [14, 4.5, -8] 
}) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Iconic 3.7-Meter High Gain Reflector (White Parabolic Dish) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.03, 0.06, 24, 1, true]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} side={THREE.DoubleSide} />
      </mesh>
      {/* Sub-reflector Tripod Feed */}
      <mesh position={[0, 0, 0.09]}>
        <coneGeometry args={[0.025, 0.04, 12]} />
        <meshStandardMaterial color="#eab308" metalness={0.9} />
      </mesh>
      {/* Bus Hexagonal Core */}
      <mesh position={[0, 0, -0.04]}>
        <cylinderGeometry args={[0.07, 0.07, 0.04, 10]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
      </mesh>
      {/* 3 Radioisotope Thermoelectric Generators (RTG Boom) */}
      <mesh position={[0.18, 0, -0.05]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.16, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.85} />
      </mesh>
      {/* 13m Magnetometer Boom with Golden Record */}
      <mesh position={[-0.24, 0, -0.06]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.005, 0.005, 0.32]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      {/* The Famous Golden Record Plaque */}
      <mesh position={[-0.08, -0.05, -0.04]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.035, 24]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.98} roughness={0.1} side={THREE.DoubleSide} />
      </mesh>
      <Html distanceFactor={10} position={[0, 0.3, 0]}>
        <div className="px-1.5 py-0.2 rounded text-[7px] font-mono whitespace-nowrap bg-black/80 border border-yellow-500/40 text-yellow-200 pointer-events-none scale-90">
          Voyager 1
        </div>
      </Html>
    </group>
  );
};
