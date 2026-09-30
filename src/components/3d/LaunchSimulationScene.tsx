import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Destination } from '../../types/mission';

interface LaunchSimulationSceneProps {
  progressPercent: number;
  countdownNumber: number | null;
  destination: Destination | null;
}

export const LaunchSimulationScene: React.FC<LaunchSimulationSceneProps> = ({
  progressPercent,
  countdownNumber,
  destination,
}) => {
  const rocketRef = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.PointLight>(null);
  const exhaustRef = useRef<THREE.Mesh>(null);
  const fairingLeftRef = useRef<THREE.Mesh>(null);
  const fairingRightRef = useRef<THREE.Mesh>(null);
  const solarLeftRef = useRef<THREE.Group>(null);
  const solarRightRef = useRef<THREE.Group>(null);

  // In-flight motion and camera choreography
  useFrame((state, delta) => {
    // Thrust flame flicker
    if (flameRef.current) {
      flameRef.current.intensity = 3.0 + Math.sin(state.clock.elapsedTime * 30) * 1.5;
    }
    if (exhaustRef.current) {
      exhaustRef.current.scale.set(
        1 + Math.sin(state.clock.elapsedTime * 25) * 0.15,
        1 + Math.sin(state.clock.elapsedTime * 20) * 0.2,
        1
      );
    }

    // Rocket ascent position based on progress
    if (rocketRef.current) {
      if (progressPercent <= 15) {
        // Liftoff and vertical climb
        const launchY = (progressPercent / 15) * 6;
        rocketRef.current.position.y = -1.5 + launchY;
        rocketRef.current.rotation.z = -(progressPercent / 15) * 0.15; // pitch over
      } else if (progressPercent <= 35) {
        // Stage 2 gravity turn into parking orbit
        rocketRef.current.position.y = 4.5;
        rocketRef.current.position.x = ((progressPercent - 15) / 20) * 2;
        rocketRef.current.rotation.z = -0.7; // nearly horizontal burn
      } else {
        // Spacecraft cruising in deep space
        rocketRef.current.position.set(0, 0, 0);
        rocketRef.current.rotation.y += delta * 0.2;
        rocketRef.current.rotation.z = 0;
      }
    }

    // Fairing jettison animation at > 20%
    if (progressPercent > 20) {
      if (fairingLeftRef.current) {
        fairingLeftRef.current.position.x -= delta * 1.5;
        fairingLeftRef.current.position.y += delta * 0.5;
        fairingLeftRef.current.rotation.z += delta * 1.2;
      }
      if (fairingRightRef.current) {
        fairingRightRef.current.position.x += delta * 1.5;
        fairingRightRef.current.position.y += delta * 0.5;
        fairingRightRef.current.rotation.z -= delta * 1.2;
      }
    }

    // Solar array unfolding at > 40%
    if (progressPercent > 40) {
      if (solarLeftRef.current && solarLeftRef.current.scale.x < 1) {
        solarLeftRef.current.scale.x = Math.min(1, solarLeftRef.current.scale.x + delta * 0.8);
      }
      if (solarRightRef.current && solarRightRef.current.scale.x < 1) {
        solarRightRef.current.scale.x = Math.min(1, solarRightRef.current.scale.x + delta * 0.8);
      }
    }
  });

  const isPreIgnition = countdownNumber !== null && countdownNumber > 0;
  const isAtmospheric = progressPercent < 30;
  const isCruise = progressPercent >= 30 && progressPercent < 80;
  const isArrival = progressPercent >= 80;

  return (
    <>
      {/* Dynamic Background: Sky gradient / Orbit / Destination */}
      {isAtmospheric && (
        <group position={[0, -20, 0]}>
          {/* Earth Surface launch horizon */}
          <mesh>
            <sphereGeometry args={[22, 64, 64]} />
            <meshStandardMaterial color="#0f2942" roughness={0.8} />
          </mesh>
          {/* Launch Pad tower */}
          <group position={[0, 22, 0]}>
            <mesh position={[1.4, 1.5, 0]}>
              <boxGeometry args={[0.5, 3.5, 0.5]} />
              <meshStandardMaterial color="#475569" wireframe />
            </mesh>
            {/* Pad floodlights */}
            <pointLight position={[2, 2, 2]} intensity={2} color="#ffffff" />
          </group>
        </group>
      )}

      {isCruise && (
        // Deep Space view with distant Earth receding behind
        <group position={[-8, -4, -15]}>
          <mesh>
            <sphereGeometry args={[2.5, 32, 32]} />
            <meshStandardMaterial color="#1e40af" roughness={0.5} />
          </mesh>
          <mesh>
            <sphereGeometry args={[2.65, 20, 20]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.25} />
          </mesh>
        </group>
      )}

      {isArrival && (
        // Destination approaching!
        <group position={[6, 2, -6]}>
          <mesh>
            <sphereGeometry args={[3.5, 48, 48]} />
            <meshStandardMaterial color={destination?.color || '#ef4444'} roughness={0.6} />
          </mesh>
          {/* Destination atmosphere or glow */}
          <mesh>
            <sphereGeometry args={[3.7, 32, 32]} />
            <meshBasicMaterial color="#00e5ff" transparent opacity={0.15} />
          </mesh>
        </group>
      )}

      {/* THE LAUNCH VEHICLE / SPACECRAFT */}
      <group ref={rocketRef} position={[0, -1.5, 0]}>
        {/* If in early ascent: show full rocket stack */}
        {progressPercent < 25 && (
          <group>
            {/* Rocket Core */}
            <mesh position={[0, 1.2, 0]}>
              <cylinderGeometry args={[0.42, 0.42, 3.0, 32]} />
              <meshStandardMaterial color="#f8fafc" metalness={0.2} />
            </mesh>
            <mesh position={[0, 2.0, 0]}>
              <cylinderGeometry args={[0.425, 0.425, 0.2, 32]} />
              <meshStandardMaterial color="#ff5c00" />
            </mesh>

            {/* Fairings */}
            <mesh ref={fairingLeftRef} position={[-0.22, 3.2, 0]}>
              <coneGeometry args={[0.45, 1.2, 16, 1, false, 0, Math.PI]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
            <mesh ref={fairingRightRef} position={[0.22, 3.2, 0]}>
              <coneGeometry args={[0.45, 1.2, 16, 1, false, Math.PI, Math.PI]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>

            {/* Rocket Thrust Exhaust Flame & Smoke */}
            {!isPreIgnition && (
              <group position={[0, -0.4, 0]}>
                <mesh ref={exhaustRef} rotation={[Math.PI, 0, 0]}>
                  <coneGeometry args={[0.35, 1.8, 16]} />
                  <meshBasicMaterial color="#ff5722" transparent opacity={0.9} />
                </mesh>
                <mesh position={[0, -0.6, 0]} rotation={[Math.PI, 0, 0]}>
                  <coneGeometry args={[0.2, 1.2, 16]} />
                  <meshBasicMaterial color="#ffeb3b" />
                </mesh>
                <pointLight ref={flameRef} position={[0, -0.8, 0]} color="#ff7700" intensity={4} distance={8} />
              </group>
            )}
          </group>
        )}

        {/* Spacecraft Body (Revealed after fairing separation) */}
        {progressPercent >= 25 && (
          <group>
            {/* Spacecraft Chassis */}
            <mesh>
              <cylinderGeometry args={[0.65, 0.65, 1.2, 6]} />
              <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.15} />
            </mesh>
            <mesh position={[0, 0.65, 0]}>
              <cylinderGeometry args={[0.68, 0.68, 0.1, 6]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>

            {/* High Gain Dish */}
            <mesh position={[0, 0.85, 0]} rotation={[0.4, 0, 0]}>
              <cylinderGeometry args={[0.5, 0.08, 0.12, 24, 1, true]} />
              <meshStandardMaterial color="#f8fafc" side={THREE.DoubleSide} />
            </mesh>

            {/* Unfolded Left Solar Array */}
            <group ref={solarLeftRef} position={[-0.7, 0, 0]} scale={[progressPercent > 40 ? 1 : 0.05, 1, 1]}>
              <mesh position={[-0.9, 0, 0]}>
                <boxGeometry args={[1.5, 0.02, 0.6]} />
                <meshStandardMaterial color="#0284c7" metalness={0.85} roughness={0.2} />
              </mesh>
            </group>

            {/* Unfolded Right Solar Array */}
            <group ref={solarRightRef} position={[0.7, 0, 0]} scale={[progressPercent > 40 ? 1 : 0.05, 1, 1]}>
              <mesh position={[0.9, 0, 0]}>
                <boxGeometry args={[1.5, 0.02, 0.6]} />
                <meshStandardMaterial color="#0284c7" metalness={0.85} roughness={0.2} />
              </mesh>
            </group>

            {/* Deep Space Plasma or Thruster Puff */}
            <pointLight position={[0, -0.7, 0]} color="#00e5ff" intensity={1.5} distance={1.2} />
          </group>
        )}
      </group>
    </>
  );
};
