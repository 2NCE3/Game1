import React, { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Stars, Line, Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';
import { Destination } from '../../types/mission';
import { cameraDirector, CameraMode } from '../../camera/CameraDirector';
import { createAtmosphereMaterial } from './AtmosphereFresnelShader';
import { gameState, FlightSimRefData, MissionPhase } from '../../core/GameState';
import { eventBus } from '../../core/EventBus';

export type FlightPhase = MissionPhase;

interface LowPolyPlanetSceneProps {
  flightDataRef?: React.MutableRefObject<FlightSimRefData>;
  destination: Destination;
  cameraMode: CameraMode;
  lowQuality?: boolean;
  onScienceCollect?: (points: number) => void;
  onAsteroidHit?: () => void;
}

// ─── MODULE-LEVEL PRE-ALLOCATED SCRATCH VARIABLES (ZERO GC) ─────────
const _tempV1 = new THREE.Vector3();
const _tempV2 = new THREE.Vector3();
const _tempV3 = new THREE.Vector3();
const _tempDir = new THREE.Vector3();
const _dummy = new THREE.Object3D();
const _dummyMatrix = new THREE.Matrix4();
const _upVector = new THREE.Vector3(0, 1, 0);
const _warpAberration = new THREE.Vector2(0.005, 0.005);
const _normalAberration = new THREE.Vector2(0.0006, 0.0006);

export const LowPolyPlanetScene: React.FC<LowPolyPlanetSceneProps> = ({
  flightDataRef,
  destination,
  cameraMode,
  lowQuality = false,
  onScienceCollect,
  onAsteroidHit,
}) => {
  const { camera } = useThree();

  // Scene Element References
  const rocketGroupRef = useRef<THREE.Group>(null);
  const flameMeshRef = useRef<THREE.Mesh>(null);
  const flameLightRef = useRef<THREE.PointLight>(null);
  const originPlanetRef = useRef<THREE.Group>(null);
  const destPlanetRef = useRef<THREE.Group>(null);
  const gantryArmRef = useRef<THREE.Group>(null);
  const boosterLeftRef = useRef<THREE.Group>(null);
  const boosterRightRef = useRef<THREE.Group>(null);
  const fairingLeftRef = useRef<THREE.Mesh>(null);
  const fairingRightRef = useRef<THREE.Mesh>(null);
  const dishRef = useRef<THREE.Group>(null);
  const roverRef = useRef<THREE.Group>(null);
  const instancedAsteroidsRef = useRef<THREE.InstancedMesh>(null);

  // Planet dimensions
  const ORIGIN_RADIUS = 16;
  const DEST_RADIUS = 18;
  const DEST_POSITION = useMemo(() => new THREE.Vector3(220, 60, -240), []);

  // 60 Procedural Asteroid Data with tumbling speeds
  const asteroidData = useMemo(() => {
    const list = [];
    const count = 60;
    for (let i = 0; i < count; i++) {
      const t = 0.18 + (i / count) * 0.65;
      const cx = t * DEST_POSITION.x + (Math.sin(i * 3.7) * 45 - 20);
      const cy = t * DEST_POSITION.y + (Math.cos(i * 2.3) * 35 - 10);
      const cz = t * DEST_POSITION.z + (Math.sin(i * 4.9) * 40 - 20);
      const scale = 0.75 + (i % 5) * 0.45;
      const rotSpeed = [
        (i % 3 - 1) * 0.6 + 0.2,
        (i % 4 - 1.5) * 0.5 + 0.1,
        (i % 2 - 0.5) * 0.7,
      ] as [number, number, number];
      list.push({
        pos: new THREE.Vector3(cx, cy, cz),
        scale,
        rotSpeed,
        rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
        id: i,
        radius: scale * 1.3,
      });
    }
    return list;
  }, [DEST_POSITION]);

  // Setup initial InstancedMesh matrices for Asteroids
  useLayoutEffect(() => {
    if (!instancedAsteroidsRef.current) return;
    const mesh = instancedAsteroidsRef.current;
    for (let i = 0; i < asteroidData.length; i++) {
      const ast = asteroidData[i];
      _dummy.position.copy(ast.pos);
      _dummy.scale.set(ast.scale, ast.scale, ast.scale);
      _dummy.rotation.copy(ast.rotation);
      _dummy.updateMatrix();
      mesh.setMatrixAt(i, _dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [asteroidData]);

  // Atmosphere Glow Shaders (ACESFilmic-compatible Fresnel)
  const originAtmosphereMat = useMemo(
    () => createAtmosphereMaterial('#f97316', 0.62, 3.2),
    []
  );
  const destAtmosphereMat = useMemo(
    () => createAtmosphereMaterial(destination.id === 'new-eden' ? '#38bdf8' : '#ef4444', 0.65, 3.0),
    [destination]
  );

  // Solar Panel Arrays (Instanced)
  const solarPanels = useMemo(() => {
    const list = [];
    for (let i = -1; i <= 1; i++) {
      list.push({
        pos: [i * 1.8, 1.2, 0] as [number, number, number],
        rot: [0.4, 0.3, 0] as [number, number, number],
      });
    }
    return list;
  }, []);

  // Low-poly orbiting cloud puffs (Instanced)
  const cloudPuffs = useMemo(() => {
    const list = [];
    const angles = [0, 1.2, 2.5, 3.8, 5.0];
    for (let i = 0; i < angles.length; i++) {
      const angle = angles[i];
      const r = ORIGIN_RADIUS + 2.2;
      const y = (i % 3 - 1) * 3;
      list.push({
        pos: [Math.cos(angle) * r, y, Math.sin(angle) * r] as [number, number, number],
        scale: 1 + (i % 3) * 0.2,
      });
    }
    return list;
  }, [ORIGIN_RADIUS]);

  // Science Anomaly Orbs in Deep Space
  const scienceOrbs = useMemo(() => {
    const list = [];
    for (let i = 0; i < 10; i++) {
      const t = 0.25 + (i / 10) * 0.55;
      const ox = t * DEST_POSITION.x + Math.sin(i * 2.1) * 15;
      const oy = t * DEST_POSITION.y + Math.cos(i * 1.7) * 12;
      const oz = t * DEST_POSITION.z + Math.sin(i * 3.4) * 15;
      list.push({ pos: new THREE.Vector3(ox, oy, oz), collected: false, id: i });
    }
    return list;
  }, [DEST_POSITION]);

  // Curved trajectory spline points
  const trajectoryPoints = useMemo(() => {
    const p0 = new THREE.Vector3(0, ORIGIN_RADIUS + 2, 0);
    const p1 = new THREE.Vector3(30, ORIGIN_RADIUS + 40, -30);
    const p2 = new THREE.Vector3(100, 70, -110);
    const p3 = new THREE.Vector3(170, 75, -190);
    const p4 = DEST_POSITION.clone().add(new THREE.Vector3(-15, 10, 15));
    const curve = new THREE.CatmullRomCurve3([p0, p1, p2, p3, p4]);
    return curve.getPoints(lowQuality ? 40 : 80).map(p => [p.x, p.y, p.z] as [number, number, number]);
  }, [ORIGIN_RADIUS, DEST_POSITION, lowQuality]);

  // ─── HIGH-PERFORMANCE RENDER LOOP (100% ZERO ALLOCATIONS) ─────────
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    const sim = flightDataRef ? flightDataRef.current : {
      phase: 'BASE_VIEW' as FlightPhase,
      flightProgress: 0,
      flightSpeed: 0,
      altitude: 0,
      steeringAngle: 0,
      isWarping: false,
    };

    // 1. Origin Planet & Destination Planet gentle rotations
    if (originPlanetRef.current) originPlanetRef.current.rotation.y += delta * 0.04;
    if (destPlanetRef.current) destPlanetRef.current.rotation.y += delta * 0.06;

    // 2. Base Antenna & Rover
    if (dishRef.current) {
      dishRef.current.rotation.y = Math.sin(time * 0.5) * 0.8;
      dishRef.current.rotation.x = -0.3 + Math.cos(time * 0.3) * 0.2;
    }
    if (roverRef.current) {
      const roverAngle = time * 0.4;
      const r = 4.2;
      roverRef.current.position.set(Math.cos(roverAngle) * r, ORIGIN_RADIUS + 0.15, Math.sin(roverAngle) * r);
      roverRef.current.rotation.y = -roverAngle + Math.PI / 2;
    }

    // 3. Gantry arm
    if (gantryArmRef.current) {
      if (sim.phase !== 'BASE_VIEW' && sim.phase !== 'COUNTDOWN') {
        gantryArmRef.current.rotation.y = THREE.MathUtils.lerp(gantryArmRef.current.rotation.y, 1.4, delta * 3);
      } else {
        gantryArmRef.current.rotation.y = THREE.MathUtils.lerp(gantryArmRef.current.rotation.y, 0, delta * 2);
      }
    }

    // 4. Animate 60 Asteroids in InstancedMesh (Tumbling without allocations)
    if (instancedAsteroidsRef.current) {
      const mesh = instancedAsteroidsRef.current;
      for (let i = 0; i < asteroidData.length; i++) {
        const ast = asteroidData[i];
        ast.rotation.x += ast.rotSpeed[0] * delta;
        ast.rotation.y += ast.rotSpeed[1] * delta;
        ast.rotation.z += ast.rotSpeed[2] * delta;

        _dummy.position.copy(ast.pos);
        _dummy.scale.set(ast.scale, ast.scale, ast.scale);
        _dummy.rotation.copy(ast.rotation);
        _dummy.updateMatrix();
        mesh.setMatrixAt(i, _dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }

    // 5. Flame & Lighting
    const isEngineFiring = sim.phase !== 'BASE_VIEW' && sim.phase !== 'COUNTDOWN';
    if (flameMeshRef.current) {
      if (isEngineFiring) {
        const pulse = 1 + Math.sin(time * 35) * 0.25;
        flameMeshRef.current.scale.set(pulse, (sim.isWarping ? 1.8 : 1.2) + Math.sin(time * 28) * 0.4, pulse);
        flameMeshRef.current.visible = true;
      } else {
        flameMeshRef.current.visible = false;
      }
    }
    if (flameLightRef.current) {
      flameLightRef.current.intensity = isEngineFiring ? (sim.isWarping ? 7 : 4) + Math.sin(time * 30) * 2 : 0;
    }

    // 6. Rocket Dynamics & Flight Path
    if (rocketGroupRef.current) {
      const r = rocketGroupRef.current;

      if (sim.phase === 'BASE_VIEW' || sim.phase === 'COUNTDOWN') {
        r.position.set(0, ORIGIN_RADIUS + 2.4, 0);
        r.rotation.set(0, 0, 0);
      } else if (sim.phase === 'LIFTOFF') {
        const climbDist = (sim.flightProgress / 20) * 18;
        const shake = (Math.random() - 0.5) * 0.05;
        r.position.set(shake, ORIGIN_RADIUS + 2.4 + climbDist, shake);
        r.rotation.set(0, 0, (sim.flightProgress / 20) * -0.15);
      } else if (sim.phase === 'BREAKOUT') {
        const prog = Math.min(1, (sim.flightProgress - 20) / 25);
        const alt = ORIGIN_RADIUS + 20.4 + prog * 45;
        const curveX = prog * 28 + sim.steeringAngle * 4;
        const curveZ = -prog * 25;
        r.position.set(curveX, alt, curveZ);
        r.rotation.set(-0.4 * prog, 0.3 * prog, -0.65 * prog);

        // Booster and fairing staging
        if (boosterLeftRef.current) {
          boosterLeftRef.current.position.x -= delta * 3.5;
          boosterLeftRef.current.position.y -= delta * 2;
          boosterLeftRef.current.rotation.z += delta * 1.5;
        }
        if (boosterRightRef.current) {
          boosterRightRef.current.position.x += delta * 3.5;
          boosterRightRef.current.position.y -= delta * 2;
          boosterRightRef.current.rotation.z += delta * 1.5;
        }
        if (fairingLeftRef.current) {
          fairingLeftRef.current.position.x -= delta * 4;
          fairingLeftRef.current.rotation.y += delta * 2;
        }
        if (fairingRightRef.current) {
          fairingRightRef.current.position.x += delta * 4;
          fairingRightRef.current.rotation.y += delta * 2;
        }
      } else if (sim.phase === 'SPACE_TRANSIT' || sim.phase === 'RETROGRADE_BURN') {
        const prog = Math.min(1, Math.max(0, (sim.flightProgress - 45) / 40));
        const curX = 28 + prog * (DEST_POSITION.x - 45) + sim.steeringAngle * 10;
        const curY = 65 + prog * (DEST_POSITION.y - 65) + Math.sin(prog * Math.PI) * 15;
        const curZ = -25 + prog * (DEST_POSITION.z + 45);
        r.position.set(curX, curY, curZ);

        // Orientation
        _tempDir.subVectors(DEST_POSITION, r.position).normalize();
        if (sim.phase === 'RETROGRADE_BURN') {
          // Point engines backward for retrograde capture burn
          _tempDir.negate();
        }
        r.quaternion.setFromUnitVectors(_upVector, _tempDir);
        r.rotateZ(sim.steeringAngle * 0.35); // Bank with steering!

        // Asteroid Collision Checking (Lightweight bounding spheres)
        for (let i = 0; i < asteroidData.length; i++) {
          const ast = asteroidData[i];
          const dist = r.position.distanceTo(ast.pos);
          if (dist < ast.radius + 1.2) {
            // Collision event!
            gameState.applyDamage(18);
            cameraDirector.addShake(0.8);
            eventBus.emit('ASTEROID_COLLISION');
            if (onAsteroidHit) onAsteroidHit();
          }
        }

        // Science Orbs Collection
        if (onScienceCollect) {
          for (let i = 0; i < scienceOrbs.length; i++) {
            const orb = scienceOrbs[i];
            if (!orb.collected && r.position.distanceTo(orb.pos) < 14) {
              orb.collected = true;
              onScienceCollect(100);
            }
          }
        }
      } else {
        // Destination Approach / Arrival
        const prog = Math.min(1, Math.max(0, (sim.flightProgress - 85) / 15));
        const orbitRadius = DEST_RADIUS + 5 - prog * 2.5;
        const orbitAngle = time * 0.8;
        r.position.set(
          DEST_POSITION.x + Math.cos(orbitAngle) * orbitRadius,
          DEST_POSITION.y + Math.sin(orbitAngle * 0.5) * 3,
          DEST_POSITION.z + Math.sin(orbitAngle) * orbitRadius
        );
        r.rotation.set(0, -orbitAngle + Math.PI / 2, -0.4);
      }
    }

    // 7. Dynamic Camera Director Update
    const rPos = rocketGroupRef.current ? rocketGroupRef.current.position : _tempV1.set(0, 18, 0);
    cameraDirector.mode = cameraMode;
    cameraDirector.update(
      camera as THREE.PerspectiveCamera,
      rPos,
      sim.steeringAngle,
      sim.isWarping,
      sim.phase,
      sim.flightProgress,
      ORIGIN_RADIUS,
      DEST_POSITION,
      delta
    );
  });

  const isWarping = !!flightDataRef?.current?.isWarping;

  return (
    <>

      {/* ─── LIGHTING & COSMIC ENVIRONMENT ─────────────────────────── */}
      <ambientLight intensity={0.45} />
      <directionalLight position={[70, 90, 60]} intensity={1.8} color="#fff8e7" castShadow={!lowQuality} />
      <directionalLight position={[-80, -30, -70]} intensity={0.4} color="#00e5ff" />
      <pointLight position={[0, ORIGIN_RADIUS + 4, 0]} intensity={1.2} color="#ff9800" distance={25} />

      {/* Deep Space Starfield */}
      <Stars radius={180} depth={80} count={lowQuality ? 1200 : 3500} factor={4} saturation={0} fade speed={0.3} />

      {/* Trajectory Guide Spline Line */}
      <Line
        points={trajectoryPoints}
        color="#00e5ff"
        lineWidth={2}
        dashed
        dashScale={50}
        dashSize={3}
        gapSize={2}
      />

      {/* ─── 1. ORIGIN PLANET (MARS COLONY / EARTH BASE) ─────────────── */}
      <group ref={originPlanetRef} position={[0, 0, 0]}>
        <mesh receiveShadow={!lowQuality} castShadow={!lowQuality}>
          <icosahedronGeometry args={[ORIGIN_RADIUS, 2]} />
          <meshStandardMaterial
            color="#b45309"
            roughness={0.85}
            flatShading
          />
        </mesh>

        {/* Polar Ice Cap */}
        <mesh position={[0, -ORIGIN_RADIUS * 0.95, 0]}>
          <coneGeometry args={[ORIGIN_RADIUS * 0.45, 2, 8]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.5} flatShading />
        </mesh>

        {/* ACESFilmic Fresnel Atmosphere Glow Shader */}
        <mesh material={originAtmosphereMat}>
          <icosahedronGeometry args={[ORIGIN_RADIUS + 1.8, 2]} />
        </mesh>

        {/* Floating Low-Poly Clouds (Instanced) */}
        <group rotation={[0.3, 0, 0.2]}>
          <Instances limit={20} range={cloudPuffs.length}>
            <dodecahedronGeometry args={[1.6, 0]} />
            <meshStandardMaterial color="#fed7aa" transparent opacity={0.65} flatShading />
            {cloudPuffs.map((c, idx) => (
              <Instance key={idx} position={c.pos} scale={c.scale} />
            ))}
          </Instances>
        </group>

        {/* ─── CLASH-OF-CLANS STYLE SURFACE BASE ──────────────────────── */}
        <group position={[0, ORIGIN_RADIUS - 0.2, 0]}>
          {/* Hexagonal Launch Foundation Pad */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[4.2, 4.6, 0.4, 6]} />
            <meshStandardMaterial color="#334155" roughness={0.7} flatShading />
          </mesh>
          <mesh position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.8, 3.4, 6]} />
            <meshStandardMaterial color="#eab308" roughness={0.5} />
          </mesh>

          {/* Launch Gantry Scaffolding Tower */}
          <group position={[3.2, 2.6, 0]}>
            <mesh>
              <boxGeometry args={[0.9, 7.5, 0.9]} />
              <meshStandardMaterial color="#dc2626" roughness={0.6} flatShading />
            </mesh>
            <pointLight position={[-0.8, 3.2, 0]} color="#ffffff" intensity={2} distance={8} />

            {/* Swing Arm */}
            <group ref={gantryArmRef} position={[-0.45, 2.5, 0]}>
              <mesh position={[-1.2, 0, 0]}>
                <boxGeometry args={[2.2, 0.25, 0.3]} />
                <meshStandardMaterial color="#94a3b8" flatShading />
              </mesh>
            </group>
          </group>

          {/* Command Biodome HQ */}
          <group position={[-5.5, 0.4, 2.2]}>
            <mesh position={[0, 1.2, 0]}>
              <icosahedronGeometry args={[2.2, 1]} />
              <meshStandardMaterial
                color="#06b6d4"
                transparent
                opacity={0.65}
                roughness={0.2}
                flatShading
              />
            </mesh>
            <pointLight position={[0, 1.2, 0]} color="#38bdf8" intensity={2.5} distance={7} />
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[2.4, 2.6, 0.3, 6]} />
              <meshStandardMaterial color="#475569" flatShading />
            </mesh>
          </group>

          {/* Deep Space Communications Dish Array */}
          <group position={[-4.5, 0.4, -4.5]}>
            <mesh position={[0, 1.4, 0]}>
              <cylinderGeometry args={[0.2, 0.35, 2.8, 4]} />
              <meshStandardMaterial color="#64748b" flatShading />
            </mesh>
            <group ref={dishRef} position={[0, 2.8, 0]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[1.5, 0.2, 0.35, 8, 1, true]} />
                <meshStandardMaterial color="#f8fafc" side={THREE.DoubleSide} flatShading />
              </mesh>
              <mesh position={[0, 0, 0.6]}>
                <coneGeometry args={[0.15, 0.5, 4]} />
                <meshStandardMaterial color="#ef4444" flatShading />
              </mesh>
            </group>
          </group>

          {/* Solar Panel Farm (Instanced) */}
          <group position={[5.2, 0.3, -4.2]}>
            <Instances limit={10} range={solarPanels.length}>
              <boxGeometry args={[1.4, 0.05, 0.9]} />
              <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.2} flatShading />
              {solarPanels.map((sp, idx) => (
                <Instance key={idx} position={sp.pos} rotation={sp.rot} />
              ))}
            </Instances>
          </group>

          {/* Cryogenic Propellant Fuel Spheres */}
          <group position={[4.8, 0.3, 4.2]}>
            <mesh position={[0, 1.1, 0]}>
              <dodecahedronGeometry args={[1.2, 0]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.5} roughness={0.4} flatShading />
            </mesh>
            <mesh position={[1.8, 0.9, -0.4]}>
              <dodecahedronGeometry args={[0.9, 0]} />
              <meshStandardMaterial color="#f97316" metalness={0.4} roughness={0.5} flatShading />
            </mesh>
          </group>

          {/* Animated 6-Wheeled Rover */}
          <group ref={roverRef}>
            <mesh position={[0, 0.25, 0]}>
              <boxGeometry args={[0.8, 0.35, 0.5]} />
              <meshStandardMaterial color="#f8fafc" flatShading />
            </mesh>
            <mesh position={[0.25, 0.55, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.3, 4]} />
              <meshStandardMaterial color="#334155" flatShading />
            </mesh>
            <pointLight position={[0.4, 0.3, 0]} color="#fef08a" intensity={1.5} distance={3} />
          </group>
        </group>
      </group>

      {/* ─── 2. THE PLAYER'S ROCKET & FLIGHT STAGES ─────────────────── */}
      <group ref={rocketGroupRef} position={[0, ORIGIN_RADIUS + 2.4, 0]}>
        {/* Core Stage 1 Rocket Body */}
        <mesh position={[0, 1.6, 0]} castShadow={!lowQuality}>
          <cylinderGeometry args={[0.52, 0.55, 3.8, 16]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.25} roughness={0.35} flatShading />
        </mesh>

        {/* Technical Livery Stripes */}
        <mesh position={[0, 2.6, 0]}>
          <cylinderGeometry args={[0.525, 0.525, 0.25, 16]} />
          <meshStandardMaterial color="#ff5c00" flatShading />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.555, 0.555, 0.15, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} flatShading />
        </mesh>

        {/* Vertical Avionics Raceway Conduit */}
        <mesh position={[0.53, 1.6, 0]}>
          <boxGeometry args={[0.04, 3.6, 0.06]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} flatShading />
        </mesh>

        {/* 4 Aerodynamic Base Delta Fins */}
        {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, idx) => (
          <group key={`fin-${idx}`} rotation={[0, angle, 0]} position={[0, 0.1, 0]}>
            <mesh position={[0.68, 0, 0]} rotation={[0, 0, -0.3]}>
              <boxGeometry args={[0.4, 0.65, 0.04]} />
              <meshStandardMaterial color="#f1f5f9" metalness={0.3} roughness={0.3} flatShading />
            </mesh>
          </group>
        ))}

        {/* 4 Titanium Grid Fins at Upper Stage */}
        {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, idx) => (
          <group key={`grid-${idx}`} rotation={[0, angle, 0]} position={[0, 2.8, 0]}>
            <mesh position={[0.58, 0, 0]} rotation={[0, 0, -0.1]}>
              <boxGeometry args={[0.16, 0.2, 0.03]} />
              <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} wireframe />
            </mesh>
          </group>
        ))}

        {/* Engine Bell Nozzle Cluster */}
        <group position={[0, -0.4, 0]}>
          <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.08, 0.4, 16, 1, true]} />
            <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.2} side={THREE.DoubleSide} flatShading />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshBasicMaterial color="#ffedd5" />
          </mesh>
        </group>

        {/* Boosters */}
        <group ref={boosterLeftRef} position={[-0.8, 1.2, 0]}>
          <mesh>
            <cylinderGeometry args={[0.25, 0.28, 3.0, 12]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.25} roughness={0.35} flatShading />
          </mesh>
          <mesh position={[0, 1.75, 0]}>
            <coneGeometry args={[0.26, 0.6, 12]} />
            <meshStandardMaterial color="#ff5c00" flatShading />
          </mesh>
          <mesh position={[0, -1.6, 0]} rotation={[Math.PI, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.06, 0.3, 12, 1, true]} />
            <meshStandardMaterial color="#334155" metalness={0.9} side={THREE.DoubleSide} />
          </mesh>
        </group>
        <group ref={boosterRightRef} position={[0.8, 1.2, 0]}>
          <mesh>
            <cylinderGeometry args={[0.25, 0.28, 3.0, 12]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.25} roughness={0.35} flatShading />
          </mesh>
          <mesh position={[0, 1.75, 0]}>
            <coneGeometry args={[0.26, 0.6, 12]} />
            <meshStandardMaterial color="#ff5c00" flatShading />
          </mesh>
          <mesh position={[0, -1.6, 0]} rotation={[Math.PI, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.06, 0.3, 12, 1, true]} />
            <meshStandardMaterial color="#334155" metalness={0.9} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* Fairing Halves (Closed Seamless Nosecone) */}
        <group position={[0, 4.2, 0]}>
          <mesh ref={fairingLeftRef} position={[0, 0, 0]}>
            <coneGeometry args={[0.55, 1.6, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.25} roughness={0.3} flatShading />
          </mesh>
          <mesh ref={fairingRightRef} position={[0, 0, 0]}>
            <coneGeometry args={[0.55, 1.6, 16, 1, false, Math.PI, Math.PI]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.25} roughness={0.3} flatShading />
          </mesh>
          {/* Nosecone tip cap */}
          <mesh position={[0, 0.7, 0]}>
            <coneGeometry args={[0.14, 0.3, 16]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
        </group>

        {/* Revealed Spacecraft Chassis & Solar Wings (Authentic Kapton Gold & Aerospace Silver) */}
        <group position={[0, 3.8, 0]}>
          {/* Main Bus Chassis - Kapton Gold Foil */}
          <mesh>
            <boxGeometry args={[0.85, 0.9, 0.85]} />
            <meshStandardMaterial color="#eab308" metalness={0.92} roughness={0.18} flatShading />
          </mesh>
          {/* Top/Bottom Structural Deck Plates - Aerospace Silver */}
          <mesh position={[0, 0.46, 0]}>
            <boxGeometry args={[0.9, 0.05, 0.9]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} flatShading />
          </mesh>
          <mesh position={[0, -0.46, 0]}>
            <boxGeometry args={[0.9, 0.05, 0.9]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} flatShading />
          </mesh>
          {/* Solar Array Wings */}
          <mesh position={[-1.4, 0, 0]}>
            <boxGeometry args={[1.8, 0.04, 0.65]} />
            <meshStandardMaterial color="#0369a1" metalness={0.85} roughness={0.2} flatShading />
          </mesh>
          <mesh position={[1.4, 0, 0]}>
            <boxGeometry args={[1.8, 0.04, 0.65]} />
            <meshStandardMaterial color="#0369a1" metalness={0.85} roughness={0.2} flatShading />
          </mesh>
          {/* High-Gain Antenna Dish - Aerospace Silver with Gold Feed */}
          <mesh position={[0, 0.7, 0]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.55, 0.1, 0.15, 8, 1, true]} />
            <meshStandardMaterial color="#cbd5e1" side={THREE.DoubleSide} metalness={0.88} roughness={0.22} flatShading />
          </mesh>
          <mesh position={[0, 0.78, 0.08]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.22, 6]} />
            <meshStandardMaterial color="#eab308" metalness={0.95} roughness={0.15} />
          </mesh>
        </group>

        {/* Engine Thrust Flame */}
        <group position={[0, -0.6, 0]}>
          <mesh ref={flameMeshRef} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.45, 2.5, 8]} />
            <meshBasicMaterial color={isWarping ? '#00e5ff' : '#ff5722'} />
          </mesh>
          <pointLight
            ref={flameLightRef}
            position={[0, -1.2, 0]}
            color={isWarping ? '#00e5ff' : '#ff7700'}
            distance={15}
          />
        </group>
      </group>

      {/* ─── 3. 60 ASTEROIDS (SINGLE INSTANCEDMESH: 1 DRAW CALL) ─────── */}
      <instancedMesh
        ref={instancedAsteroidsRef}
        args={[undefined, undefined, 60]}
      >
        <dodecahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial color="#64748b" roughness={0.88} flatShading />
      </instancedMesh>

      {/* Science Anomaly Orbs */}
      <group>
        {scienceOrbs.map(orb => (
          <group key={orb.id} position={[orb.pos.x, orb.pos.y, orb.pos.z]}>
            <mesh>
              <octahedronGeometry args={[1.1, 0]} />
              <meshStandardMaterial
                color={orb.collected ? '#10b981' : '#f59e0b'}
                emissive={orb.collected ? '#059669' : '#d97706'}
                emissiveIntensity={0.8}
                flatShading
              />
            </mesh>
            <pointLight
              color={orb.collected ? '#34d399' : '#fbbf24'}
              intensity={orb.collected ? 0.5 : 2}
              distance={8}
            />
          </group>
        ))}
      </group>

      {/* ─── 4. DESTINATION PLANET (NEW EDEN) ────────────────────────── */}
      <group ref={destPlanetRef} position={[DEST_POSITION.x, DEST_POSITION.y, DEST_POSITION.z]}>
        <mesh receiveShadow={!lowQuality} castShadow={!lowQuality}>
          <icosahedronGeometry args={[DEST_RADIUS, 2]} />
          <meshStandardMaterial
            color={
              destination.id === 'new-eden'
                ? '#0284c7'
                : destination.color || '#ef4444'
            }
            roughness={0.65}
            flatShading
          />
        </mesh>

        {destination.id === 'new-eden' && (
          <>
            <group rotation={[0.4, 0.8, 0]}>
              <mesh position={[0, 0, DEST_RADIUS * 0.95]}>
                <dodecahedronGeometry args={[DEST_RADIUS * 0.45, 0]} />
                <meshStandardMaterial color="#15803d" roughness={0.8} flatShading />
              </mesh>
              <mesh position={[DEST_RADIUS * 0.75, DEST_RADIUS * 0.4, 0]}>
                <dodecahedronGeometry args={[DEST_RADIUS * 0.35, 0]} />
                <meshStandardMaterial color="#16a34a" roughness={0.8} flatShading />
              </mesh>
            </group>

            {/* Cloud Ring */}
            <mesh rotation={[0.2, 0, 0]}>
              <torusGeometry args={[DEST_RADIUS + 3.2, 0.9, 6, 12]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.65} flatShading />
            </mesh>
          </>
        )}

        {/* ACESFilmic Fresnel Atmosphere Glow Shader for Destination */}
        <mesh material={destAtmosphereMat}>
          <icosahedronGeometry args={[DEST_RADIUS + 2.2, 2]} />
        </mesh>
      </group>
    </>
  );
};
