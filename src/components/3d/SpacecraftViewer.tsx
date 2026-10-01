import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
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
  isInLab?: boolean;
}

export const SpacecraftViewer: React.FC<SpacecraftViewerProps> = ({
  bus,
  power,
  comms,
  propulsion,
  payloads,
  interactive = true,
  isInLab = true
}) => {
  const craftRef = useRef<THREE.Group>(null);
  const ionGlowRef = useRef<THREE.PointLight>(null);
  const welderGlowRef = useRef<THREE.PointLight>(null);
  const roboticArm1Ref = useRef<THREE.Group>(null);
  const roboticArm2Ref = useRef<THREE.Group>(null);
  const scanRingRef = useRef<THREE.Group>(null);

  // Smooth rotation & robotic builder animations
  useFrame((state, delta) => {
    // Gentle craft rotation
    if (craftRef.current && interactive) {
      craftRef.current.rotation.y += delta * 0.08;
    }

    // Ion thruster plasma flicker
    if (ionGlowRef.current) {
      ionGlowRef.current.intensity = 1.2 + Math.sin(state.clock.elapsedTime * 8) * 0.3;
    }

    // Robotic Welder Arm subtle articulation
    if (roboticArm1Ref.current) {
      const t = state.clock.elapsedTime * 0.8;
      roboticArm1Ref.current.rotation.y = -0.4 + Math.sin(t) * 0.12;
      roboticArm1Ref.current.rotation.z = Math.cos(t * 0.7) * 0.05;
    }

    // Welder spark light pulsing
    if (welderGlowRef.current) {
      const flicker = Math.random() > 0.4 ? 1.5 + Math.random() * 2.0 : 0.4;
      welderGlowRef.current.intensity = flicker;
    }

    // Laser metrology inspection arm
    if (roboticArm2Ref.current) {
      const t = state.clock.elapsedTime * 0.6;
      roboticArm2Ref.current.rotation.y = 0.5 + Math.cos(t) * 0.15;
    }

    // Holographic calibration scanner ring moving vertically along chassis
    if (scanRingRef.current) {
      scanRingRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.75;
    }
  });

  const busType = bus?.id || null;
  const hasGPR = payloads.some(p => p.id === 'inst-gpr');
  const hasRadar = payloads.some(p => p.id === 'inst-radar');
  const hasCamera = payloads.some(p => p.id === 'inst-camera');
  const hasSpectrometer = payloads.some(p => p.id === 'inst-spectrometer');
  const hasMagnetometer = payloads.some(p => p.id === 'inst-magnetometer');

  return (
    <>
      {interactive && (
        <OrbitControls 
          enablePan={true} 
          minDistance={2.0} 
          maxDistance={12} 
          maxPolarAngle={Math.PI / 1.7} 
          minPolarAngle={Math.PI / 6} 
        />
      )}

      {/* =========================================================================
          NASA CLEANROOM HIGH-BAY LAB ENVIRONMENT & LIGHTING
          ========================================================================= */}
      {isInLab && (
        <>
          {/* Crisp Industrial Cleanroom Studio Lighting */}
          <ambientLight intensity={0.65} color="#f8fafc" />
          {/* High-Bay Overhead LED Floodlights */}
          <directionalLight position={[0, 8, 2]} intensity={2.2} color="#ffffff" castShadow />
          {/* Key Light (Lab Front Right) */}
          <directionalLight position={[6, 5, 5]} intensity={1.8} color="#f1f5f9" />
          {/* Fill Light (Lab Front Left) */}
          <directionalLight position={[-6, 4, 4]} intensity={1.2} color="#e2e8f0" />
          {/* Floor Bounce (clean epoxy reflection) */}
          <directionalLight position={[0, -5, 2]} intensity={0.5} color="#94a3b8" />
          {/* Laser Guide Red Accent Light */}
          <pointLight position={[-1.5, 0.2, 1.2]} intensity={1.2} distance={4} color="#ef4444" />

          {/* Cleanroom Floor (Polished Epoxy Grid with Safety Perimeter) */}
          <group position={[0, -1.45, 0]}>
            {/* Primary Cleanroom Epoxy Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[25, 25]} />
              <meshStandardMaterial 
                color="#0a0f1d" 
                roughness={0.25} 
                metalness={0.4} 
              />
            </mesh>

            {/* Metric Measurement Floor Grid */}
            <gridHelper args={[20, 20, '#ef4444', '#1e293b']} position={[0, 0.005, 0]} />

            {/* Circular Alignment Markings around Assembly Stand */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
              <ringGeometry args={[1.75, 1.8, 48]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} side={THREE.DoubleSide} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
              <ringGeometry args={[2.8, 2.85, 64]} />
              <meshBasicMaterial color="#ef4444" transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>

            {/* Yellow / Black Hazard Stripe Outer Perimeter Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
              <ringGeometry args={[2.85, 3.05, 64]} />
              <meshStandardMaterial color="#eab308" roughness={0.5} />
            </mesh>
          </group>

          {/* =========================================================================
              ROBOTIC ASSEMBLY TURNTABLE & JIG FIXTURES
              ========================================================================= */}
          <group position={[0, -1.35, 0]}>
            {/* Heavy Base Turntable Platform */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[1.3, 1.45, 0.2, 32]} />
              <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.25} />
            </mesh>

            {/* Rotating Chuck Ring */}
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[1.15, 1.15, 0.08, 32]} />
              <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* 4 Pneumatic Locking Clamps Securing Spacecraft Chassis */}
            {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
              <group key={idx} rotation={[0, angle, 0]} position={[0, 0.22, 0]}>
                {/* Clamp Upright Pylon */}
                <mesh position={[0.95, 0.12, 0]}>
                  <boxGeometry args={[0.14, 0.35, 0.12]} />
                  <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Chrome Hydraulic Piston Shaft */}
                <mesh position={[0.82, 0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.035, 0.035, 0.25]} />
                  <meshStandardMaterial color="#f8fafc" metalness={0.98} roughness={0.1} />
                </mesh>
                {/* Red Locking Jaw Grip on Spacecraft Base */}
                <mesh position={[0.72, 0.22, 0]}>
                  <boxGeometry args={[0.08, 0.14, 0.14]} />
                  <meshStandardMaterial color="#dc2626" metalness={0.7} roughness={0.3} />
                </mesh>
              </group>
            ))}

            {/* Grounding Telemetry Cable Umbilicals */}
            <mesh position={[0.5, 0.05, 1.2]} rotation={[0, 0.4, 0]}>
              <boxGeometry args={[0.15, 0.08, 1.8]} />
              <meshStandardMaterial color="#0f172a" roughness={0.9} />
            </mesh>
          </group>

          {/* =========================================================================
              ROBOTIC BUILDER ARM 1: PRECISION WELDER & RIVETER
              ========================================================================= */}
          <group ref={roboticArm1Ref} position={[-2.1, -1.4, 0.8]}>
            {/* Turret Swivel Base */}
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.3, 0.35, 0.3, 16]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
            {/* Safety Orange Pivot Collar */}
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.15, 16]} />
              <meshStandardMaterial color="#ea580c" metalness={0.5} roughness={0.4} />
            </mesh>
            {/* Lower Boom (Industrial White) */}
            <mesh position={[0.3, 0.9, 0]} rotation={[0, 0, -0.45]}>
              <boxGeometry args={[0.18, 1.2, 0.18]} />
              <meshStandardMaterial color="#f8fafc" metalness={0.3} roughness={0.3} />
            </mesh>
            {/* Elbow Joint */}
            <mesh position={[0.65, 1.45, 0]}>
              <sphereGeometry args={[0.16, 16, 16]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
            {/* Forearm extending toward Spacecraft */}
            <mesh position={[1.15, 1.35, 0]} rotation={[0, 0, 0.25]}>
              <boxGeometry args={[1.0, 0.14, 0.14]} />
              <meshStandardMaterial color="#ea580c" metalness={0.5} roughness={0.4} />
            </mesh>
            {/* Robotic End Effector / Welder Tool Tip */}
            <mesh position={[1.7, 1.22, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.06, 0.25, 12]} />
              <meshStandardMaterial color="#334155" metalness={0.9} />
            </mesh>
            {/* Active Welder Spark Light & Laser Guide */}
            <pointLight ref={welderGlowRef} position={[1.82, 1.22, 0]} color="#ef4444" intensity={2.0} distance={1.8} />
            {/* Thin Red Laser Beam aimed at Spacecraft Chassis */}
            <mesh position={[1.98, 1.22, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.005, 0.005, 0.3]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>
          </group>

          {/* =========================================================================
              ROBOTIC BUILDER ARM 2: LASER METROLOGY & INSPECTION SCANNER
              ========================================================================= */}
          <group ref={roboticArm2Ref} position={[2.0, -1.4, -0.7]}>
            {/* Scanner Turret Base */}
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.28, 0.32, 0.3, 16]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
            {/* Vertical Support Column */}
            <mesh position={[0, 0.8, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 1.1, 16]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Articulated Boom Arm */}
            <mesh position={[-0.45, 1.35, 0]} rotation={[0, 0, 0.3]}>
              <boxGeometry args={[0.9, 0.12, 0.12]} />
              <meshStandardMaterial color="#0284c7" metalness={0.6} />
            </mesh>
            {/* Optical Sensor Pod Head */}
            <mesh position={[-0.95, 1.5, 0]}>
              <boxGeometry args={[0.22, 0.18, 0.3]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} />
            </mesh>
            {/* Cyan Laser Emitter Lenses */}
            <mesh position={[-1.02, 1.5, 0]}>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshBasicMaterial color="#00e5ff" />
            </mesh>
            <pointLight position={[-1.1, 1.5, 0]} color="#00e5ff" intensity={1.5} distance={2.5} />
          </group>

          {/* =========================================================================
              CLEANROOM MOBILE TELEMETRY DIAGNOSTIC WORKSTATION
              ========================================================================= */}
          <group position={[1.8, -1.4, 1.4]} rotation={[0, -0.6, 0]}>
            {/* Cart Frame & Wheels */}
            <mesh position={[0, 0.45, 0]}>
              <boxGeometry args={[0.6, 0.8, 0.4]} />
              <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Dual Diagnostic Monitors (Hangar Builder Status) */}
            <mesh position={[0, 0.95, 0.05]} rotation={[-0.2, 0, 0]}>
              <boxGeometry args={[0.55, 0.35, 0.03]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
            {/* Glowing Screen Telemetry Interface */}
            <mesh position={[0, 0.95, 0.07]} rotation={[-0.2, 0, 0]}>
              <planeGeometry args={[0.5, 0.3]} />
              <meshBasicMaterial color="#0284c7" />
            </mesh>
            {/* Keyboard Shelf */}
            <mesh position={[0, 0.75, 0.2]}>
              <boxGeometry args={[0.5, 0.04, 0.22]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          </group>

          {/* =========================================================================
              OVERHEAD HIGH-BAY GANTRY & FLOODLIGHT SOFTBOXES
              ========================================================================= */}
          <group position={[0, 2.6, 0]}>
            {/* Yellow Steel Gantry Beam */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[8.0, 0.25, 0.35]} />
              <meshStandardMaterial color="#eab308" metalness={0.4} roughness={0.4} />
            </mesh>
            {/* Overhead LED Floodlight Bank 1 */}
            <mesh position={[-1.8, -0.15, 0]}>
              <boxGeometry args={[0.8, 0.1, 0.4]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
            {/* Overhead LED Floodlight Bank 2 */}
            <mesh position={[1.8, -0.15, 0]}>
              <boxGeometry args={[0.8, 0.1, 0.4]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
          </group>
        </>
      )}

      {/* =========================================================================
          SPACECRAFT CHASSIS BODY (HIGH DETAIL NASA AEROSPACE ENGINEERING)
          ========================================================================= */}
      <group ref={craftRef} position={[0, 0, 0]}>
        {/* Holographic Calibration / Laser Metrology Scanning Ring */}
        {isInLab && (
          <group ref={scanRingRef}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.15, 1.22, 48]} />
              <meshBasicMaterial color="#00e5ff" transparent opacity={0.45} side={THREE.DoubleSide} />
            </mesh>
            {/* Crosshair Laser Ticks */}
            {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, i) => (
              <mesh key={i} rotation={[0, ang, 0]} position={[1.18 * Math.cos(ang), 0, 1.18 * Math.sin(ang)]}>
                <boxGeometry args={[0.06, 0.02, 0.02]} />
                <meshBasicMaterial color="#ef4444" />
              </mesh>
            ))}
          </group>
        )}

        {/* ─── 0. CLEANROOM INTEGRATION JIG (Awaiting Chassis Selection) ─── */}
        {!bus && (
          <group position={[0, 0.4, 0]}>
            {/* Holographic Wireframe Chassis Skeleton */}
            <mesh>
              <cylinderGeometry args={[0.75, 0.75, 1.4, 6]} />
              <meshStandardMaterial 
                color="#00e5ff" 
                wireframe 
                transparent 
                opacity={0.35} 
              />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.9, 0.95, 32]} />
              <meshBasicMaterial color="#00e5ff" transparent opacity={0.6} side={THREE.DoubleSide} />
            </mesh>
            {/* Holographic Assembly Prompt Tag */}
            <Html distanceFactor={14} position={[0, 1.25, 0]}>
              <div className="px-3 py-1.5 rounded-full bg-black/85 border border-cyan-500/50 text-cyan-300 font-mono text-xs whitespace-nowrap shadow-xl flex items-center gap-2 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>INTEGRATION JIG READY · SELECT CHASSIS [01]</span>
              </div>
            </Html>
          </group>
        )}

        {/* ─── 1. STANDARD BUS (Titan-II): Hexagonal Gold Kapton Workhorse ─── */}
        {busType === 'bus-standard' && (
          <group>
            {/* Main Hexagonal Spacecraft Core with Rich Gold Kapton MLI */}
            <mesh>
              <cylinderGeometry args={[0.82, 0.82, 1.65, 6]} />
              <meshStandardMaterial 
                color="#f59e0b" 
                metalness={0.75} 
                roughness={0.32} 
              />
            </mesh>

            {/* Kapton Thermal Blanket Seams & Structural Ribs (Amber/Copper Trim) */}
            <mesh>
              <cylinderGeometry args={[0.825, 0.825, 1.66, 6]} />
              <meshStandardMaterial 
                color="#b45309" 
                metalness={0.85} 
                roughness={0.25} 
                wireframe 
              />
            </mesh>

            {/* Top Payload Mounting Deck - Milled Aerospace Aluminum */}
            <mesh position={[0, 0.85, 0]}>
              <cylinderGeometry args={[0.85, 0.85, 0.08, 6]} />
              <meshStandardMaterial color="#f1f5f9" metalness={0.92} roughness={0.18} />
            </mesh>
            {/* Top Deck Circular Payload Interface Bolt Ring */}
            <mesh position={[0, 0.895, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.45, 0.55, 24]} />
              <meshStandardMaterial color="#64748b" metalness={0.9} />
            </mesh>

            {/* Lower Propulsion Thrust Deck - Machined Titanium Silver */}
            <mesh position={[0, -0.85, 0]}>
              <cylinderGeometry args={[0.85, 0.85, 0.08, 6]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.2} />
            </mesh>
            {/* Launch Vehicle Adapter Ring Interface */}
            <mesh position={[0, -0.92, 0]}>
              <cylinderGeometry args={[0.72, 0.72, 0.06, 24]} />
              <meshStandardMaterial color="#475569" metalness={0.85} />
            </mesh>

            {/* Exposed Internal Avionics Bay with Circuit Racks & Heat Sinks */}
            <group position={[0.78, 0, 0]}>
              {/* Recessed Bay Box */}
              <mesh>
                <boxGeometry args={[0.1, 1.2, 0.7]} />
                <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
              </mesh>
              {/* Internal Modular PCB Avionics Units */}
              {[-0.35, 0, 0.35].map((y, idx) => (
                <mesh key={idx} position={[0.04, y, 0]}>
                  <boxGeometry args={[0.06, 0.22, 0.58]} />
                  <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.25} />
                </mesh>
              ))}
              {/* Dual Redundant Flight Computer Status Indicator LEDs */}
              <mesh position={[0.08, 0.42, 0.18]}>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshBasicMaterial color="#10b981" />
              </mesh>
              <mesh position={[0.08, 0.42, -0.18]}>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshBasicMaterial color="#ef4444" />
              </mesh>
            </group>

            {/* 4 Corner Attitude Control (RCS) Cold-Gas Thruster Pods */}
            {[Math.PI / 6, (5 * Math.PI) / 6, (7 * Math.PI) / 6, (11 * Math.PI) / 6].map((rot, i) => (
              <group key={i} rotation={[0, rot, 0]} position={[0, 0.7, 0]}>
                <mesh position={[0.82, 0, 0]}>
                  <boxGeometry args={[0.08, 0.12, 0.08]} />
                  <meshStandardMaterial color="#94a3b8" metalness={0.9} />
                </mesh>
                {/* Micro Nozzles */}
                <mesh position={[0.88, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <coneGeometry args={[0.025, 0.05, 8]} />
                  <meshStandardMaterial color="#f8fafc" metalness={0.9} />
                </mesh>
              </group>
            ))}

            {/* Vertical Wire Harness Conduits along chassis corners */}
            {Array.from({ length: 6 }).map((_, idx) => {
              const ang = (idx * Math.PI) / 3;
              return (
                <mesh key={idx} position={[0.81 * Math.cos(ang), 0, 0.81 * Math.sin(ang)]}>
                  <cylinderGeometry args={[0.015, 0.015, 1.6]} />
                  <meshStandardMaterial color="#334155" metalness={0.7} />
                </mesh>
              );
            })}
          </group>
        )}

        {/* ─── 2. LIGHT BUS (Mk-I Aero): Carbon-Fiber Honeycomb Core ─── */}
        {busType === 'bus-light' && (
          <group>
            {/* Carbon-Fiber Composite Main Chassis Prism */}
            <mesh>
              <boxGeometry args={[1.05, 1.25, 1.05]} />
              <meshStandardMaterial color="#1e293b" roughness={0.45} metalness={0.3} />
            </mesh>

            {/* Titanium Corner Post Structural Framework */}
            <mesh>
              <boxGeometry args={[1.08, 1.28, 1.08]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} wireframe />
            </mesh>

            {/* Gold Kapton Insulated Front Thermal Face */}
            <mesh position={[0, 0, 0.53]}>
              <planeGeometry args={[0.85, 1.05]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.25} />
            </mesh>
            {/* Gold Kapton Insulated Rear Thermal Face */}
            <mesh position={[0, 0, -0.53]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[0.85, 1.05]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.25} />
            </mesh>

            {/* Open Internal Bay (showing lightweight avionics tray & battery blocks) */}
            <group position={[0.54, 0, 0]}>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.04, 0.9, 0.7]} />
                <meshStandardMaterial color="#0f172a" metalness={0.8} />
              </mesh>
              {/* Battery Cells Block */}
              <mesh position={[-0.08, -0.2, 0]}>
                <boxGeometry args={[0.12, 0.35, 0.5]} />
                <meshStandardMaterial color="#0284c7" metalness={0.6} />
              </mesh>
            </group>

            {/* Upper & Lower Structural Interface Plates */}
            <mesh position={[0, 0.65, 0]}>
              <boxGeometry args={[1.1, 0.05, 1.1]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.92} />
            </mesh>
            <mesh position={[0, -0.65, 0]}>
              <boxGeometry args={[1.1, 0.05, 1.1]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.92} />
            </mesh>
          </group>
        )}

        {/* ─── 3. HEAVY BUS (DeepForge Pro): Octagonal Titanium Isogrid with Vault ─── */}
        {busType === 'bus-heavy' && (
          <group>
            {/* Heavy Reinforced Octagonal Titanium Chassis */}
            <mesh>
              <cylinderGeometry args={[1.05, 1.1, 1.95, 8]} />
              <meshStandardMaterial color="#475569" metalness={0.88} roughness={0.25} />
            </mesh>

            {/* Heavy Triangular Isogrid Structural Outer Shell */}
            <mesh>
              <cylinderGeometry args={[1.06, 1.11, 1.96, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.15} wireframe />
            </mesh>

            {/* Central Radiation Hardened Electronics Vault Citadel */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[1.12, 1.12, 0.65, 8]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.3} />
            </mesh>
            {/* Heavy Bolt Perimeter on Citadel */}
            <mesh position={[0, 0.33, 0]}>
              <cylinderGeometry args={[1.14, 1.14, 0.04, 16]} />
              <meshStandardMaterial color="#f8fafc" metalness={0.95} />
            </mesh>
            <mesh position={[0, -0.33, 0]}>
              <cylinderGeometry args={[1.14, 1.14, 0.04, 16]} />
              <meshStandardMaterial color="#f8fafc" metalness={0.95} />
            </mesh>

            {/* Internal Spherical Propellant Tank visible inside lower deck */}
            <mesh position={[0, -0.5, 0]}>
              <sphereGeometry args={[0.55, 24, 24]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.96} roughness={0.1} />
            </mesh>

            {/* Upper Heavy Instrument Mounting Deck */}
            <mesh position={[0, 1.0, 0]}>
              <cylinderGeometry args={[1.12, 1.12, 0.09, 8]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Heavy Lifting Crane Trunnion Pins */}
            {[-1.15, 1.15].map((x, i) => (
              <mesh key={i} position={[x, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.06, 0.06, 0.25]} />
                <meshStandardMaterial color="#eab308" metalness={0.9} />
              </mesh>
            ))}
          </group>
        )}

        {/* =========================================================================
            POWER SYSTEM (SOLAR ARRAYS OR ADVANCED STIRLING RTG)
            ========================================================================= */}
        {power && power.type === 'SOLAR' && (
          <group>
            {/* Left Solar Wing */}
            <group position={[-0.95, 0.1, 0]}>
              {/* Articulated Deployment Hinge & Boom */}
              <mesh position={[-0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.035, 0.035, 0.6]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.8} />
              </mesh>
              {/* Solar Panels (Blue crystalline cells with gold border) */}
              <mesh position={[-1.2 - (power.id === 'power-large' ? 0.4 : 0), 0, 0]}>
                <boxGeometry 
                  args={[
                    power.id === 'power-large' ? 2.3 : (power.id === 'power-medium' ? 1.7 : 1.1),
                    0.02, 
                    power.id === 'power-large' ? 0.85 : 0.65
                  ]} 
                />
                <meshStandardMaterial color="#0284c7" metalness={0.85} roughness={0.2} />
              </mesh>
            </group>

            {/* Right Solar Wing */}
            <group position={[0.95, 0.1, 0]}>
              <mesh position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.035, 0.035, 0.6]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.8} />
              </mesh>
              <mesh position={[1.2 + (power.id === 'power-large' ? 0.4 : 0), 0, 0]}>
                <boxGeometry 
                  args={[
                    power.id === 'power-large' ? 2.3 : (power.id === 'power-medium' ? 1.7 : 1.1),
                    0.02, 
                    power.id === 'power-large' ? 0.85 : 0.65
                  ]} 
                />
                <meshStandardMaterial color="#0284c7" metalness={0.85} roughness={0.2} />
              </mesh>
            </group>
          </group>
        )}

        {power && power.type === 'RTG' && (
          // Advanced RTG Stirling: Heat radiator fins and radioactive core glow
          <group position={[0, -0.1, 0.95]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.75, 16]} />
              <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
            </mesh>
            {/* Cooling fins */}
            {Array.from({ length: 6 }).map((_, i) => (
              <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]}>
                <boxGeometry args={[0.65, 0.02, 0.7]} />
                <meshStandardMaterial color="#1e293b" metalness={0.9} />
              </mesh>
            ))}
            {/* Stirling heat glow indicator */}
            <pointLight color="#ea580c" intensity={1.8} distance={1.4} />
          </group>
        )}

        {/* =========================================================================
            COMMUNICATION DISH / ANTENNA
            ========================================================================= */}
        {comms && comms.type === 'LOW_GAIN' && (
          // Low Gain: Dual omni antenna whips
          <group position={[0.45, 0.95, 0.3]}>
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
          <group position={[0, 1.1, 0]}>
            {/* Gimbal Pedestal */}
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.09, 0.13, 0.22, 16]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} />
            </mesh>
            {/* Dish Parabolic Bowl */}
            <mesh position={[0, 0.32, 0]} rotation={[0.4, 0, 0]}>
              <cylinderGeometry 
                args={[
                  comms.type === 'DEEP_SPACE' ? 0.75 : (comms.type === 'HIGH_GAIN' ? 0.62 : 0.42), 
                  0.1, 
                  0.16, 
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
            <mesh position={[0, 0.48, 0.1]}>
              <coneGeometry args={[0.065, 0.13, 12]} />
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

        {/* =========================================================================
            PROPULSION SYSTEM
            ========================================================================= */}
        {propulsion && (
          <group position={[0, -0.98, 0]}>
            {propulsion.type === 'CHEMICAL' && (
              // Rocket Bell Nozzle
              <mesh rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.4, 0.65, 24, 1, true]} />
                <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} side={THREE.DoubleSide} />
              </mesh>
            )}

            {propulsion.type === 'ELECTRIC' && (
              // Ion Thruster Grid with Cyan Plasma glow!
              <group>
                <mesh>
                  <cylinderGeometry args={[0.3, 0.3, 0.22, 24]} />
                  <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
                </mesh>
                <mesh position={[0, -0.16, 0]}>
                  <cylinderGeometry args={[0.24, 0.24, 0.05, 24]} />
                  <meshBasicMaterial color="#00e5ff" />
                </mesh>
                {/* Xenon Plasma plume */}
                <pointLight ref={ionGlowRef} position={[0, -0.38, 0]} color="#00e5ff" intensity={2.0} distance={1.8} />
              </group>
            )}

            {propulsion.type === 'HYBRID' && (
              // Hybrid: Main Center Bell + 4 RCS thruster clusters
              <group>
                <mesh rotation={[Math.PI, 0, 0]}>
                  <coneGeometry args={[0.34, 0.55, 24, 1, true]} />
                  <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.2} side={THREE.DoubleSide} />
                </mesh>
                {/* Cold gas RCS blocks */}
                {[-0.55, 0.55].map((x, idx) => (
                  <mesh key={idx} position={[x, 0.1, 0]}>
                    <boxGeometry args={[0.1, 0.1, 0.1]} />
                    <meshStandardMaterial color="#94a3b8" />
                  </mesh>
                ))}
              </group>
            )}
          </group>
        )}

        {/* =========================================================================
            SCIENTIFIC PAYLOAD INSTRUMENTS
            ========================================================================= */}
        {/* 1. High-Resolution Camera */}
        {hasCamera && (
          <group position={[0.48, 0.38, 0.55]}>
            <mesh rotation={[0.4, 0.3, 0]}>
              <cylinderGeometry args={[0.12, 0.15, 0.48, 20]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
            <mesh position={[0.07, 0.26, 0.12]}>
              <circleGeometry args={[0.12, 20]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.05} metalness={0.95} />
            </mesh>
          </group>
        )}

        {/* 2. Spectrometer Housing */}
        {hasSpectrometer && (
          <group position={[-0.48, 0.42, 0.5]}>
            <mesh>
              <boxGeometry args={[0.24, 0.3, 0.32]} />
              <meshStandardMaterial color="#1e293b" metalness={0.7} />
            </mesh>
            <mesh position={[0, 0, 0.17]}>
              <planeGeometry args={[0.16, 0.09]} />
              <meshBasicMaterial color="#a855f7" />
            </mesh>
          </group>
        )}

        {/* 3. Ground Penetrating Radar */}
        {hasGPR && (
          <group position={[0, -0.65, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.02, 3.4]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.9} />
            </mesh>
            <pointLight color="#f59e0b" intensity={0.8} distance={0.5} />
          </group>
        )}

        {/* 4. SAR Radar Antenna */}
        {hasRadar && !hasGPR && (
          <group position={[0, -0.3, 0.8]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <boxGeometry args={[1.5, 0.03, 0.45]} />
              <meshStandardMaterial color="#38bdf8" metalness={0.7} roughness={0.3} wireframe />
            </mesh>
          </group>
        )}

        {/* 5. Magnetometer */}
        {hasMagnetometer && (
          <group position={[-0.55, 0, -0.45]} rotation={[0.2, -0.4, 0]}>
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

export default SpacecraftViewer;
