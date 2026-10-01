import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Destination } from '../../types/mission';

interface LaunchSimulationSceneProps {
  progressPercent: number;
  countdownNumber: number | null;
  destination: Destination | null;
  cameraMode?: 'basic' | '3d';
  descentInitiated?: boolean;
}

export const LaunchSimulationScene: React.FC<LaunchSimulationSceneProps> = ({
  progressPercent,
  countdownNumber,
  destination,
  cameraMode = '3d',
  descentInitiated = false
}) => {
  const rocketRef = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.PointLight>(null);
  const exhaustRef = useRef<THREE.Group>(null);
  const fairingLeftRef = useRef<THREE.Group>(null);
  const fairingRightRef = useRef<THREE.Group>(null);
  const boosterLeftRef = useRef<THREE.Group>(null);
  const boosterRightRef = useRef<THREE.Group>(null);
  const solarLeftRef = useRef<THREE.Group>(null);
  const solarRightRef = useRef<THREE.Group>(null);

  // Arrival refs
  const planetRef = useRef<THREE.Group>(null);
  const satelliteRef = useRef<THREE.Group>(null);
  const capsuleRef = useRef<THREE.Group>(null);
  const landingLegsRef = useRef<THREE.Group>(null);
  const retroPlumeRef = useRef<THREE.Group>(null);
  const touchdownRingRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // In-flight motion and camera choreography
  useFrame((state, delta) => {
    // Thrust flame flicker
    if (flameRef.current) {
      flameRef.current.intensity = 4.0 + Math.sin(state.clock.elapsedTime * 35) * 2.0;
    }
    if (exhaustRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 28) * 0.12;
      exhaustRef.current.scale.set(s, 1 + Math.sin(state.clock.elapsedTime * 20) * 0.2, s);
    }

    // Rocket ascent position based on progress
    if (rocketRef.current) {
      if (progressPercent <= 18) {
        // Liftoff and vertical climb
        const launchY = (progressPercent / 18) * 7.5;
        rocketRef.current.position.y = -1.5 + launchY;
        rocketRef.current.position.x = 0;
        rocketRef.current.rotation.z = -(progressPercent / 18) * 0.18; // gradual pitch over
      } else if (progressPercent <= 38) {
        // Stage 2 gravity turn into parking orbit
        const stageProgress = (progressPercent - 18) / 20;
        rocketRef.current.position.y = 6.0 + stageProgress * 3.5;
        rocketRef.current.position.x = stageProgress * 3.5;
        rocketRef.current.rotation.z = -0.18 - stageProgress * 0.55; // horizontal orbital injection
      } else if (progressPercent < 75) {
        // Spacecraft cruising in deep space
        rocketRef.current.position.set(0, 0, 0);
        rocketRef.current.rotation.y += delta * 0.2;
        rocketRef.current.rotation.z = 0;
      }
    }

    // Side Booster separation at > 15%
    if (progressPercent > 15) {
      if (boosterLeftRef.current) {
        boosterLeftRef.current.position.x -= delta * 1.8;
        boosterLeftRef.current.position.y -= delta * 0.8;
        boosterLeftRef.current.rotation.z += delta * 0.9;
      }
      if (boosterRightRef.current) {
        boosterRightRef.current.position.x += delta * 1.8;
        boosterRightRef.current.position.y -= delta * 0.8;
        boosterRightRef.current.rotation.z += delta * 0.9;
      }
    }

    // Fairing jettison animation at > 20%
    if (progressPercent > 20) {
      if (fairingLeftRef.current) {
        fairingLeftRef.current.position.x -= delta * 1.6;
        fairingLeftRef.current.position.y += delta * 0.6;
        fairingLeftRef.current.rotation.z += delta * 1.4;
      }
      if (fairingRightRef.current) {
        fairingRightRef.current.position.x += delta * 1.6;
        fairingRightRef.current.position.y += delta * 0.6;
        fairingRightRef.current.rotation.z += delta * 1.4;
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

    // ─── STEP 1 & 2: DESTINATION PLANET, SATELLITE ROTATION & LANDER SEPARATION ───
    if (progressPercent >= 75) {
      // Planet slow axial rotation
      if (planetRef.current) {
        planetRef.current.rotation.y += delta * 0.05;
      }
      if (cloudsRef.current) {
        cloudsRef.current.rotation.y += delta * 0.08;
      }

      // Step 1: Satellite orbital position & continuous rotation
      const orbitSpeed = 0.35;
      const orbitAngle = (state.clock.elapsedTime * orbitSpeed) + ((progressPercent - 75) * 0.25);
      const orbitRadius = 5.2;

      const satX = Math.cos(orbitAngle) * orbitRadius;
      const satZ = Math.sin(orbitAngle) * orbitRadius * Math.cos(0.25);
      const satY = Math.sin(orbitAngle) * orbitRadius * Math.sin(0.25);

      if (satelliteRef.current) {
        satelliteRef.current.position.set(satX, satY, satZ);
        // Face tangent to orbit
        satelliteRef.current.rotation.y = -orbitAngle + Math.PI / 2;
        satelliteRef.current.rotation.z = Math.sin(orbitAngle) * 0.2;
      }

      // Step 2: Robotic Lander / Capsule separation & landing descent
      if (capsuleRef.current) {
        if (!descentInitiated) {
          // Docked to satellite
          capsuleRef.current.position.set(satX, satY - 0.7, satZ);
          capsuleRef.current.rotation.set(0, -orbitAngle, 0);
          capsuleRef.current.scale.set(1, 1, 1);
        } else {
          // Undocked! Descending toward planet surface
          // Landing progress 0 to 1 between 83% and 98%
          const landT = Math.min(1, Math.max(0, (progressPercent - 83) / 15));
          
          // Planet surface radius is 3.0. Capsule starts at 5.0 and lands at 3.05
          const currentRadius = 5.0 - landT * 1.95;
          const descentAngle = orbitAngle + landT * 1.4;

          const capX = Math.cos(descentAngle) * currentRadius;
          const capZ = Math.sin(descentAngle) * currentRadius * Math.cos(0.18);
          const capY = Math.sin(descentAngle) * currentRadius * Math.sin(0.18) + (1 - landT) * 0.5;

          capsuleRef.current.position.set(capX, capY, capZ);

          // Attitude changes through phases:
          // 83-89%: Retro-fire orientation (thrusters forward to brake)
          // 89-94%: Atmospheric entry (heat shield forward into stream)
          // 94-100%: Upright vertical orientation facing outwards from planet center
          const normal = new THREE.Vector3(capX, capY, capZ).normalize();
          
          if (landT < 0.4) {
            // Retro-burn attitude
            capsuleRef.current.rotation.y = -descentAngle + Math.PI;
            capsuleRef.current.rotation.x = Math.PI * 0.6;
          } else if (landT < 0.7) {
            // Reentry angle
            capsuleRef.current.rotation.y = -descentAngle + Math.PI * 0.8;
            capsuleRef.current.rotation.x = Math.PI * 0.4;
          } else {
            // Terminal upright touchdown attitude
            capsuleRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
          }

          // Deploy landing legs outward between landT 0.7 and 0.85
          if (landingLegsRef.current) {
            const legProgress = Math.min(1, Math.max(0, (landT - 0.65) / 0.2));
            landingLegsRef.current.scale.set(
              0.4 + legProgress * 0.6,
              0.4 + legProgress * 0.6,
              0.4 + legProgress * 0.6
            );
          }

          // Dynamic retro-thruster flame flicker during powered descent
          if (retroPlumeRef.current) {
            if (landT > 0.1 && landT < 0.95) {
              const flicker = 0.85 + Math.sin(state.clock.elapsedTime * 45) * 0.25;
              retroPlumeRef.current.scale.set(flicker, flicker * 1.2, flicker);
              retroPlumeRef.current.visible = true;
            } else {
              retroPlumeRef.current.visible = false;
            }
          }

          // Touchdown dust shockwave ring on surface
          if (touchdownRingRef.current) {
            if (landT >= 0.92) {
              const ringT = (landT - 0.92) / 0.08;
              touchdownRingRef.current.position.set(capX, capY, capZ);
              touchdownRingRef.current.scale.set(1 + ringT * 3.5, 1 + ringT * 3.5, 1 + ringT * 3.5);
              (touchdownRingRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.8 - ringT * 0.8);
              touchdownRingRef.current.visible = true;
            } else {
              touchdownRingRef.current.visible = false;
            }
          }
        }
      }
    }

    // ─── CAMERA CHOREOGRAPHY ──────────────────────────────────────────
    if (cameraMode === 'basic') {
      if (progressPercent <= 38) {
        // Atmospheric Launch & Ascent Phase:
        const climbRatio = Math.min(1, progressPercent / 35);
        const targetZ = 16.0 + climbRatio * 12.0;
        const targetY = 0.5 + climbRatio * 5.0;
        const lookAtY = Math.max(0, (progressPercent / 35) * 5.5);

        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 0, delta * 3.5);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, delta * 3.5);
        state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, delta * 3.5);
        state.camera.lookAt(0, lookAtY, 0);
      } else if (progressPercent < 75) {
        // Deep space cruise phase: centered on spacecraft
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 0, delta * 2.5);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0.2, delta * 2.5);
        state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 10.0, delta * 2.5);
        state.camera.lookAt(0, 0, 0);
      } else if (!descentInitiated) {
        // Orbital Satellite Tracking view
        if (satelliteRef.current) {
          const satPos = satelliteRef.current.position;
          state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, satPos.x + 2.5, delta * 2.5);
          state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, satPos.y + 1.5, delta * 2.5);
          state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, satPos.z + 4.5, delta * 2.5);
          state.camera.lookAt(satPos.x, satPos.y, satPos.z);
        }
      } else {
        // Capsule Landing Descent Tracking view
        if (capsuleRef.current) {
          const capPos = capsuleRef.current.position;
          const targetCamX = capPos.x + 1.8;
          const targetCamY = capPos.y + 1.5;
          const targetCamZ = capPos.z + 4.2;

          state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetCamX, delta * 2.5);
          state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetCamY, delta * 2.5);
          state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetCamZ, delta * 2.5);
          state.camera.lookAt(capPos.x, capPos.y, capPos.z);
        }
      }
    }
  });

  const isPreIgnition = countdownNumber !== null && countdownNumber > 0;
  const isAtmospheric = progressPercent < 30;
  const isArrival = progressPercent >= 75;

  // Planet color based on destination
  const planetColor = destination?.color || '#ef4444';
  const isMars = destination?.id === 'mars';
  const isNewEden = destination?.id === 'new-eden';
  const isMoon = destination?.id === 'moon';
  const isJupiter = destination?.id === 'jupiter';

  return (
    <>
      <OrbitControls
        enablePan={false}
        enableRotate={cameraMode === '3d'}
        minDistance={4}
        maxDistance={40}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 4}
      />

      {/* ─── 3D LAUNCH PAD ENVIRONMENT & COMPLEX ───────────────────── */}
      {isAtmospheric && (
        <group position={[0, 0, 0]}>
          {/* Pad Floodlights & Ambient Illumination */}
          <ambientLight intensity={0.7} />
          <directionalLight position={[6, 8, 7]} intensity={2.2} color="#ffffff" castShadow />
          <directionalLight position={[-6, 6, -5]} intensity={0.8} color="#93c5fd" />
          <pointLight position={[3.5, 3.0, 3.5]} intensity={3.5} color="#f8fafc" distance={16} />
          <pointLight position={[-3.5, 3.0, 3.5]} intensity={2.5} color="#bae6fd" distance={16} />
          <pointLight position={[2.2, 5.0, 1.0]} intensity={2.0} color="#fed7aa" distance={10} />

          {/* Launch Complex Concrete Ground Apron */}
          <mesh position={[0, -3.35, 0]}>
            <cylinderGeometry args={[26, 26, 0.4, 32]} />
            <meshStandardMaterial color="#1e293b" roughness={0.85} metalness={0.1} />
          </mesh>

          {/* Octagonal Heavy Launch Mount Table */}
          <group position={[0, -2.75, 0]}>
            <mesh position={[0, -0.3, 0]}>
              <cylinderGeometry args={[2.0, 2.3, 0.6, 8]} />
              <meshStandardMaterial color="#334155" roughness={0.7} metalness={0.3} />
            </mesh>
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[2.02, 2.02, 0.06, 8]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.9, 0.9, 0.65, 16, 1, true]} />
              <meshStandardMaterial color="#0f172a" roughness={0.9} side={THREE.BackSide} />
            </mesh>

            {/* 4 Hold-Down Release Clamps */}
            {[
              [0.55, 0],
              [-0.55, 0],
              [0, 0.55],
              [0, -0.55]
            ].map(([cx, cz], idx) => (
              <group key={idx} position={[cx, 0.1, cz]}>
                <mesh position={[0, 0.1, 0]}>
                  <boxGeometry args={[0.18, 0.25, 0.18]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.8} />
                </mesh>
                <mesh position={[0, 0.24, 0]}>
                  <boxGeometry args={[0.08, 0.08, 0.12]} />
                  <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
                </mesh>
              </group>
            ))}
          </group>

          {/* Red & Steel Launch Umbilical Tower */}
          <group position={[2.2, -2.75, 0]}>
            <mesh position={[0, 3.8, 0]}>
              <boxGeometry args={[0.7, 7.6, 0.7]} />
              <meshStandardMaterial color="#b91c1c" metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 3.8, 0]}>
              <boxGeometry args={[0.74, 7.64, 0.74]} />
              <meshStandardMaterial color="#f8fafc" wireframe transparent opacity={0.3} />
            </mesh>

            {[1.5, 3.0, 4.5, 6.0, 7.5].map((py, idx) => (
              <mesh key={idx} position={[0, py, 0]}>
                <boxGeometry args={[1.2, 0.08, 1.2]} />
                <meshStandardMaterial color="#475569" metalness={0.7} />
              </mesh>
            ))}

            <group position={[0, 3.2, 0]} rotation={[0, progressPercent > 0 ? 0.9 : 0, 0]}>
              <mesh position={[-0.75, 0, 0]}>
                <boxGeometry args={[1.5, 0.18, 0.22]} />
                <meshStandardMaterial color="#334155" metalness={0.8} />
              </mesh>
              <mesh position={[-1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.04, 0.04, 0.25, 8]} />
                <meshStandardMaterial color="#f8fafc" />
              </mesh>
            </group>

            <group position={[0, 5.2, 0]} rotation={[0, progressPercent > 0 ? 0.7 : 0, 0]}>
              <mesh position={[-0.75, 0, 0]}>
                <boxGeometry args={[1.5, 0.22, 0.35]} />
                <meshStandardMaterial color="#e2e8f0" metalness={0.4} roughness={0.3} />
              </mesh>
              <mesh position={[-1.5, 0, 0]}>
                <boxGeometry args={[0.4, 0.45, 0.4]} />
                <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.2} />
              </mesh>
            </group>

            <mesh position={[0, 8.2, 0]}>
              <cylinderGeometry args={[0.03, 0.05, 1.6, 8]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
            </mesh>
            <mesh position={[0, 9.05, 0]}>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>
          </group>

          {/* Launch Pad Cryogenic Propellant Tanks */}
          <group position={[-2.8, -2.75, -1.8]}>
            <mesh position={[0, 1.3, 0]}>
              <cylinderGeometry args={[0.6, 0.6, 2.6, 24]} />
              <meshStandardMaterial color="#f8fafc" metalness={0.3} roughness={0.4} />
            </mesh>
            <mesh position={[0, 2.6, 0]}>
              <sphereGeometry args={[0.6, 24, 16]} />
              <meshStandardMaterial color="#f8fafc" metalness={0.3} roughness={0.4} />
            </mesh>
          </group>
          <group position={[-2.8, -2.75, 0.2]}>
            <mesh position={[0, 1.1, 0]}>
              <cylinderGeometry args={[0.55, 0.55, 2.2, 24]} />
              <meshStandardMaterial color="#0284c7" metalness={0.4} roughness={0.3} />
            </mesh>
            <mesh position={[0, 2.2, 0]}>
              <sphereGeometry args={[0.55, 24, 16]} />
              <meshStandardMaterial color="#0284c7" metalness={0.4} roughness={0.3} />
            </mesh>
          </group>
        </group>
      )}

      {/* ─── STEP 1 & 2: DESTINATION PLANET & TWO-STEP ARRIVAL SYSTEM ─── */}
      {isArrival && (
        <group position={[0, 0, 0]}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 8, 10]} intensity={2.8} color="#ffffff" />
          <pointLight position={[-8, 4, -8]} intensity={0.6} color="#38bdf8" />

          {/* Destination Planet Sphere */}
          <group ref={planetRef} position={[0, 0, 0]}>
            {/* Main Planet Body */}
            <mesh>
              <sphereGeometry args={[3.0, 64, 64]} />
              <meshStandardMaterial
                color={planetColor}
                roughness={0.65}
                metalness={0.15}
              />
            </mesh>

            {/* Mars White Polar Ice Caps */}
            {isMars && (
              <>
                <mesh position={[0, 2.92, 0]}>
                  <sphereGeometry args={[0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.2]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.4} />
                </mesh>
                <mesh position={[0, -2.92, 0]} rotation={[Math.PI, 0, 0]}>
                  <sphereGeometry args={[0.6, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.2]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.4} />
                </mesh>
              </>
            )}

            {/* Earth / New Eden Atmosphere Cloud Layer */}
            {(isNewEden || destination?.id === 'earth-orbit') && (
              <mesh ref={cloudsRef}>
                <sphereGeometry args={[3.06, 48, 48]} />
                <meshStandardMaterial
                  color="#ffffff"
                  transparent
                  opacity={0.32}
                  roughness={0.8}
                />
              </mesh>
            )}

            {/* Jupiter Bands Overlay */}
            {isJupiter && (
              <mesh>
                <sphereGeometry args={[3.02, 48, 48]} />
                <meshStandardMaterial color="#d97706" wireframe transparent opacity={0.15} />
              </mesh>
            )}

            {/* Moon Crater Discs */}
            {isMoon && (
              <>
                {[
                  [1.2, 1.8, 1.9, 0.45],
                  [-1.6, 0.8, 2.3, 0.35],
                  [0.5, -2.0, 2.1, 0.5],
                  [2.1, -1.2, 1.5, 0.38]
                ].map(([cx, cy, cz, rad], i) => (
                  <mesh key={i} position={[cx, cy, cz]}>
                    <ringGeometry args={[rad * 0.6, rad, 20]} />
                    <meshBasicMaterial color="#475569" side={THREE.DoubleSide} />
                  </mesh>
                ))}
              </>
            )}

            {/* Atmospheric Glow Shell */}
            <mesh>
              <sphereGeometry args={[3.25, 48, 48]} />
              <meshBasicMaterial
                color={isMars ? '#f97316' : isNewEden ? '#10b981' : '#38bdf8'}
                transparent
                opacity={0.2}
                side={THREE.BackSide}
              />
            </mesh>
          </group>

          {/* Glowing Circular Orbital Trajectory Ring around Planet */}
          <mesh rotation={[Math.PI / 2 + 0.25, 0, 0]}>
            <ringGeometry args={[5.18, 5.24, 96]} />
            <meshBasicMaterial color="#00e5ff" transparent opacity={0.45} side={THREE.DoubleSide} />
          </mesh>

          {/* ═════════════════════════════════════════════════════════════
              STEP 1: ORBITING SATELLITE (Continues Rotating Around Planet)
             ═════════════════════════════════════════════════════════════ */}
          <group ref={satelliteRef}>
            {/* Hexagonal Gold Kapton Bus Body */}
            <mesh>
              <cylinderGeometry args={[0.5, 0.5, 1.0, 6]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.16} />
            </mesh>
            {/* Structural Avionics Decks */}
            <mesh position={[0, 0.52, 0]}>
              <cylinderGeometry args={[0.52, 0.52, 0.08, 6]} />
              <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
            </mesh>
            <mesh position={[0, -0.52, 0]}>
              <cylinderGeometry args={[0.52, 0.52, 0.08, 6]} />
              <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
            </mesh>

            {/* High-Gain Communications Dish */}
            <mesh position={[0, 0.72, 0]} rotation={[0.4, 0, 0]}>
              <cylinderGeometry args={[0.45, 0.06, 0.12, 24, 1, true]} />
              <meshStandardMaterial color="#f8fafc" side={THREE.DoubleSide} metalness={0.8} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0.8, 0.06]} rotation={[0.4, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.1} />
            </mesh>

            {/* Deployable Left Photovoltaic Solar Array */}
            <group position={[-0.55, 0, 0]}>
              <mesh position={[-0.8, 0, 0]}>
                <boxGeometry args={[1.5, 0.02, 0.6]} />
                <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.18} />
              </mesh>
              <mesh position={[-0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.025, 0.025, 0.25, 8]} />
                <meshStandardMaterial color="#475569" metalness={0.9} />
              </mesh>
            </group>

            {/* Deployable Right Photovoltaic Solar Array */}
            <group position={[0.55, 0, 0]}>
              <mesh position={[0.8, 0, 0]}>
                <boxGeometry args={[1.5, 0.02, 0.6]} />
                <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.18} />
              </mesh>
              <mesh position={[0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.025, 0.025, 0.25, 8]} />
                <meshStandardMaterial color="#475569" metalness={0.9} />
              </mesh>
            </group>

            {/* Deep Space Ion Plasma Thruster Plume */}
            <mesh position={[0, -0.65, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.12, 0.5, 16]} />
              <meshBasicMaterial color="#00e5ff" transparent opacity={0.85} />
            </mesh>
            <pointLight position={[0, -0.7, 0]} color="#00e5ff" intensity={2.0} distance={2.5} />

            {/* Green Tracking Beacon */}
            <mesh position={[0, 0.95, 0]}>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshBasicMaterial color="#10b981" />
            </mesh>
          </group>

          {/* ═════════════════════════════════════════════════════════════
              STEP 2: ROBOTIC LANDER CAPSULE (Undocks & Lands on Planet)
             ═════════════════════════════════════════════════════════════ */}
          <group ref={capsuleRef}>
            {/* Conical Aeroshell & Pressurized Robot Capsule Body */}
            <mesh position={[0, 0.15, 0]}>
              <coneGeometry args={[0.42, 0.55, 24]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.25} />
            </mesh>
            {/* Top Docking Ring / Parachute Cover */}
            <mesh position={[0, 0.45, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
              <meshStandardMaterial color="#0f172a" metalness={0.85} />
            </mesh>

            {/* Curved PICA-X Ablative Heat Shield Base */}
            <mesh position={[0, -0.14, 0]}>
              <cylinderGeometry args={[0.44, 0.38, 0.09, 24]} />
              <meshStandardMaterial color="#1e293b" roughness={0.8} metalness={0.2} />
            </mesh>

            {/* Gold Thermal Multilayer Insulation Band */}
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.36, 0.42, 0.18, 24]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.92} roughness={0.2} />
            </mesh>

            {/* Deployable Stereoscopic Robot Camera Mast & Science Antenna */}
            <group position={[0.12, 0.38, 0]}>
              <mesh>
                <cylinderGeometry args={[0.015, 0.015, 0.22, 8]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
              </mesh>
              {/* Stereo Eyes */}
              <mesh position={[0, 0.11, 0]}>
                <boxGeometry args={[0.06, 0.03, 0.03]} />
                <meshStandardMaterial color="#0284c7" />
              </mesh>
            </group>

            {/* 4 Articulated Shock-Absorbing Landing Gear Legs */}
            <group ref={landingLegsRef} position={[0, -0.15, 0]}>
              {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((ang, i) => (
                <group key={i} rotation={[0, ang, 0]}>
                  {/* Diagonal Leg Strut */}
                  <mesh position={[0.3, -0.15, 0]} rotation={[0, 0, -0.55]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.38, 8]} />
                    <meshStandardMaterial color="#64748b" metalness={0.85} />
                  </mesh>
                  {/* Disc Footpad */}
                  <mesh position={[0.42, -0.32, 0]}>
                    <cylinderGeometry args={[0.08, 0.08, 0.02, 12]} />
                    <meshStandardMaterial color="#94a3b8" metalness={0.7} />
                  </mesh>
                </group>
              ))}
            </group>

            {/* Retro-Descent Rocket Engine Exhaust Plume */}
            <group ref={retroPlumeRef} position={[0, -0.22, 0]} visible={false}>
              {/* Central Fire Plume */}
              <mesh position={[0, -0.35, 0]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.2, 0.75, 16]} />
                <meshBasicMaterial color="#f97316" transparent opacity={0.9} />
              </mesh>
              {/* White Hot Core */}
              <mesh position={[0, -0.18, 0]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.08, 0.4, 16]} />
                <meshBasicMaterial color="#fffbeb" />
              </mesh>
              <pointLight color="#ff7700" intensity={3.5} distance={4} />
            </group>

            {/* Touchdown Status Beacon (Blinking green upon landing) */}
            <mesh position={[0, 0.52, 0]}>
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshBasicMaterial color={progressPercent >= 98 ? '#10b981' : '#f59e0b'} />
            </mesh>
          </group>

          {/* Touchdown Dust Shockwave Ring on Surface */}
          <mesh
            ref={touchdownRingRef}
            rotation={[-Math.PI / 2, 0, 0]}
            visible={false}
          >
            <ringGeometry args={[0.2, 0.8, 32]} />
            <meshBasicMaterial color="#fed7aa" transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* ─────────────────────────────────────────────────────────────
          HIGH-FIDELITY MODERN MULTI-STAGE ROCKET (ASCENT & CRUISE)
         ───────────────────────────────────────────────────────────── */}
      {progressPercent < 75 && (
        <group ref={rocketRef} position={[0, -1.2, 0]}>
          {/* FULL ROCKET STACK (Ascent phase) */}
          {progressPercent < 25 && (
            <group>
              {/* ── 1. PAYLOAD FAIRING & NOSECONE ── */}
              <group position={[0, 3.1, 0]}>
                {/* Left Fairing Half */}
                <group ref={fairingLeftRef} position={[0, 0, 0]}>
                  <mesh position={[0, 0.6, 0]}>
                    <coneGeometry args={[0.48, 1.4, 32, 1, false, 0, Math.PI]} />
                    <meshStandardMaterial color="#f8fafc" metalness={0.25} roughness={0.3} />
                  </mesh>
                  <mesh position={[0, -0.2, 0]}>
                    <cylinderGeometry args={[0.48, 0.47, 0.4, 32, 1, false, 0, Math.PI]} />
                    <meshStandardMaterial color="#f8fafc" metalness={0.25} roughness={0.3} />
                  </mesh>
                  <mesh position={[0, 1.35, 0]}>
                    <coneGeometry args={[0.12, 0.25, 24, 1, false, 0, Math.PI]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
                  </mesh>
                </group>

                {/* Right Fairing Half */}
                <group ref={fairingRightRef} position={[0, 0, 0]}>
                  <mesh position={[0, 0.6, 0]}>
                    <coneGeometry args={[0.48, 1.4, 32, 1, false, Math.PI, Math.PI]} />
                    <meshStandardMaterial color="#f8fafc" metalness={0.25} roughness={0.3} />
                  </mesh>
                  <mesh position={[0, -0.2, 0]}>
                    <cylinderGeometry args={[0.48, 0.47, 0.4, 32, 1, false, Math.PI, Math.PI]} />
                    <meshStandardMaterial color="#f8fafc" metalness={0.25} roughness={0.3} />
                  </mesh>
                  <mesh position={[0, 1.35, 0]}>
                    <coneGeometry args={[0.12, 0.25, 24, 1, false, Math.PI, Math.PI]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
                  </mesh>
                </group>
              </group>

              {/* ── 2. STAGE 2 ── */}
              <group position={[0, 2.3, 0]}>
                <mesh>
                  <cylinderGeometry args={[0.46, 0.46, 0.9, 32]} />
                  <meshStandardMaterial color="#f1f5f9" metalness={0.3} roughness={0.3} />
                </mesh>
                <mesh position={[0, -0.55, 0]}>
                  <cylinderGeometry args={[0.45, 0.45, 0.25, 32]} />
                  <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.35} />
                </mesh>
              </group>

              {/* ── 3. STAGE 1 CORE BOOSTER ── */}
              <group position={[0, 0.3, 0]}>
                <mesh>
                  <cylinderGeometry args={[0.46, 0.46, 2.7, 32]} />
                  <meshStandardMaterial color="#f8fafc" metalness={0.2} roughness={0.35} />
                </mesh>

                <mesh position={[0, 1.0, 0]}>
                  <cylinderGeometry args={[0.465, 0.465, 0.16, 32]} />
                  <meshStandardMaterial color="#ff5c00" roughness={0.4} />
                </mesh>
                <mesh position={[0, -0.9, 0]}>
                  <cylinderGeometry args={[0.465, 0.465, 0.12, 32]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.8} />
                </mesh>

                <mesh position={[0.465, 0, 0]}>
                  <boxGeometry args={[0.04, 2.5, 0.06]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.7} />
                </mesh>
                <mesh position={[-0.465, 0, 0]}>
                  <boxGeometry args={[0.04, 2.5, 0.06]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.7} />
                </mesh>

                {/* 4 Titanium Grid Fins */}
                {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, idx) => (
                  <group key={idx} rotation={[0, angle, 0]} position={[0, 1.15, 0]}>
                    <mesh position={[0.54, 0, 0]} rotation={[0, 0, -0.1]}>
                      <boxGeometry args={[0.18, 0.22, 0.03]} />
                      <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} wireframe />
                    </mesh>
                  </group>
                ))}

                {/* 4 Aerodynamic Base Delta Fins */}
                {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, idx) => (
                  <group key={idx} rotation={[0, angle, 0]} position={[0, -1.1, 0]}>
                    <mesh position={[0.62, 0, 0]} rotation={[0, 0, -0.3]}>
                      <boxGeometry args={[0.38, 0.55, 0.04]} />
                      <meshStandardMaterial color="#f1f5f9" metalness={0.3} roughness={0.3} />
                    </mesh>
                    <mesh position={[0.74, 0.1, 0]} rotation={[0, 0, -0.3]}>
                      <boxGeometry args={[0.06, 0.52, 0.05]} />
                      <meshStandardMaterial color="#0f172a" metalness={0.8} />
                    </mesh>
                  </group>
                ))}
              </group>

              {/* ── 4. TWIN STRAP-ON SOLID ROCKET BOOSTERS (SRBs) ── */}
              <group ref={boosterLeftRef} position={[-0.72, 0.1, 0]}>
                <mesh>
                  <cylinderGeometry args={[0.22, 0.22, 2.9, 24]} />
                  <meshStandardMaterial color="#e2e8f0" metalness={0.25} roughness={0.35} />
                </mesh>
                <mesh position={[0, 1.75, 0]}>
                  <coneGeometry args={[0.22, 0.65, 24]} />
                  <meshStandardMaterial color="#ff5c00" roughness={0.3} />
                </mesh>
                <mesh position={[0, -1.6, 0]} rotation={[Math.PI, 0, 0]}>
                  <cylinderGeometry args={[0.12, 0.06, 0.3, 20, 1, true]} />
                  <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.2} side={THREE.DoubleSide} />
                </mesh>
                <mesh position={[0.14, 0.8, 0]}>
                  <boxGeometry args={[0.12, 0.08, 0.08]} />
                  <meshStandardMaterial color="#1e293b" />
                </mesh>
                <mesh position={[0.14, -0.8, 0]}>
                  <boxGeometry args={[0.12, 0.08, 0.08]} />
                  <meshStandardMaterial color="#1e293b" />
                </mesh>
              </group>

              <group ref={boosterRightRef} position={[0.72, 0.1, 0]}>
                <mesh>
                  <cylinderGeometry args={[0.22, 0.22, 2.9, 24]} />
                  <meshStandardMaterial color="#e2e8f0" metalness={0.25} roughness={0.35} />
                </mesh>
                <mesh position={[0, 1.75, 0]}>
                  <coneGeometry args={[0.22, 0.65, 24]} />
                  <meshStandardMaterial color="#ff5c00" roughness={0.3} />
                </mesh>
                <mesh position={[0, -1.6, 0]} rotation={[Math.PI, 0, 0]}>
                  <cylinderGeometry args={[0.12, 0.06, 0.3, 20, 1, true]} />
                  <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.2} side={THREE.DoubleSide} />
                </mesh>
                <mesh position={[-0.14, 0.8, 0]}>
                  <boxGeometry args={[0.12, 0.08, 0.08]} />
                  <meshStandardMaterial color="#1e293b" />
                </mesh>
                <mesh position={[-0.14, -0.8, 0]}>
                  <boxGeometry args={[0.12, 0.08, 0.08]} />
                  <meshStandardMaterial color="#1e293b" />
                </mesh>
              </group>

              {/* ── 5. ENGINE AFT SKIRT & 5-NOZZLE CLUSTER ── */}
              <group position={[0, -1.15, 0]}>
                <mesh position={[0, -0.15, 0]}>
                  <cylinderGeometry args={[0.46, 0.42, 0.25, 32]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
                </mesh>

                <mesh position={[0, -0.38, 0]} rotation={[Math.PI, 0, 0]}>
                  <cylinderGeometry args={[0.15, 0.07, 0.35, 24, 1, true]} />
                  <meshStandardMaterial color="#475569" metalness={0.95} roughness={0.15} side={THREE.DoubleSide} />
                </mesh>
                <mesh position={[0, -0.3, 0]}>
                  <sphereGeometry args={[0.07, 16, 16]} />
                  <meshBasicMaterial color="#fffbeb" />
                </mesh>

                {[
                  [-0.16, 0],
                  [0.16, 0],
                  [0, -0.16],
                  [0, 0.16],
                ].map(([ox, oz], idx) => (
                  <group key={idx} position={[ox, -0.36, oz]}>
                    <mesh rotation={[Math.PI, 0, 0]}>
                      <cylinderGeometry args={[0.1, 0.05, 0.3, 20, 1, true]} />
                      <meshStandardMaterial color="#475569" metalness={0.95} roughness={0.15} side={THREE.DoubleSide} />
                    </mesh>
                    <mesh position={[0, 0.06, 0]}>
                      <sphereGeometry args={[0.05, 12, 12]} />
                      <meshBasicMaterial color="#fed7aa" />
                    </mesh>
                  </group>
                ))}
              </group>

              {/* ── 6. REALISTIC MULTI-LAYER EXHAUST PLUME ── */}
              {!isPreIgnition && (
                <group ref={exhaustRef} position={[0, -1.6, 0]}>
                  <mesh position={[0, -0.35, 0]}>
                    <octahedronGeometry args={[0.09, 0]} />
                    <meshBasicMaterial color="#67e8f9" />
                  </mesh>
                  <mesh position={[0, -0.75, 0]}>
                    <octahedronGeometry args={[0.11, 0]} />
                    <meshBasicMaterial color="#67e8f9" />
                  </mesh>
                  <mesh position={[0, -1.2, 0]}>
                    <octahedronGeometry args={[0.13, 0]} />
                    <meshBasicMaterial color="#a5f3fc" />
                  </mesh>

                  <mesh position={[0, -0.85, 0]} rotation={[Math.PI, 0, 0]}>
                    <coneGeometry args={[0.22, 1.8, 20]} />
                    <meshBasicMaterial color="#fffbeb" transparent opacity={0.98} />
                  </mesh>

                  <mesh position={[0, -1.5, 0]} rotation={[Math.PI, 0, 0]}>
                    <coneGeometry args={[0.48, 3.2, 24]} />
                    <meshBasicMaterial color="#f97316" transparent opacity={0.88} />
                  </mesh>

                  {progressPercent <= 15 && (
                    <>
                      <mesh position={[-0.72, -0.5, 0]} rotation={[Math.PI, 0, 0]}>
                        <coneGeometry args={[0.22, 2.0, 16]} />
                        <meshBasicMaterial color="#f97316" transparent opacity={0.9} />
                      </mesh>
                      <mesh position={[0.72, -0.5, 0]} rotation={[Math.PI, 0, 0]}>
                        <coneGeometry args={[0.22, 2.0, 16]} />
                        <meshBasicMaterial color="#f97316" transparent opacity={0.9} />
                      </mesh>
                    </>
                  )}

                  <pointLight ref={flameRef} position={[0, -0.8, 0]} color="#ff7700" intensity={5} distance={12} />
                </group>
              )}
            </group>
          )}

          {/* ── 7. REVEALED SPACECRAFT IN CRUISE (25% to 75%) ── */}
          {progressPercent >= 25 && (
            <group position={[0, 0, 0]}>
              <mesh>
                <cylinderGeometry args={[0.65, 0.65, 1.3, 6]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.16} />
              </mesh>
              <mesh position={[0, 0.7, 0]}>
                <cylinderGeometry args={[0.68, 0.68, 0.08, 6]} />
                <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
              </mesh>
              <mesh position={[0, -0.7, 0]}>
                <cylinderGeometry args={[0.68, 0.68, 0.08, 6]} />
                <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
              </mesh>

              <mesh position={[0, 0.95, 0]} rotation={[0.4, 0, 0]}>
                <cylinderGeometry args={[0.55, 0.08, 0.14, 24, 1, true]} />
                <meshStandardMaterial color="#f8fafc" side={THREE.DoubleSide} metalness={0.8} roughness={0.25} />
              </mesh>
              <mesh position={[0, 1.05, 0.08]} rotation={[0.4, 0, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.25, 8]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.1} />
              </mesh>

              {/* Deployable Left Photovoltaic Solar Array */}
              <group ref={solarLeftRef} position={[-0.7, 0, 0]} scale={[progressPercent > 40 ? 1 : 0.05, 1, 1]}>
                <mesh position={[-1.0, 0, 0]}>
                  <boxGeometry args={[1.8, 0.03, 0.7]} />
                  <meshStandardMaterial color="#0284c7" metalness={0.88} roughness={0.18} />
                </mesh>
                <mesh position={[-0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
                  <meshStandardMaterial color="#475569" metalness={0.9} />
                </mesh>
              </group>

              {/* Deployable Right Photovoltaic Solar Array */}
              <group ref={solarRightRef} position={[0.7, 0, 0]} scale={[progressPercent > 40 ? 1 : 0.05, 1, 1]}>
                <mesh position={[1.0, 0, 0]}>
                  <boxGeometry args={[1.8, 0.03, 0.7]} />
                  <meshStandardMaterial color="#0284c7" metalness={0.88} roughness={0.18} />
                </mesh>
                <mesh position={[0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
                  <meshStandardMaterial color="#475569" metalness={0.9} />
                </mesh>
              </group>

              {/* Deep Space Ion Plasma Thruster Plume */}
              <mesh position={[0, -0.85, 0]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.16, 0.6, 16]} />
                <meshBasicMaterial color="#00e5ff" transparent opacity={0.85} />
              </mesh>
              <pointLight position={[0, -0.9, 0]} color="#00e5ff" intensity={2.0} distance={2.5} />
            </group>
          )}
        </group>
      )}
    </>
  );
};
