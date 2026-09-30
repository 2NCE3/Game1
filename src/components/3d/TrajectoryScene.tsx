import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Destination, TrajectoryOption } from '../../types/mission';

interface TrajectorySceneProps {
  destination: Destination | null;
  selectedTrajectory: TrajectoryOption | null;
  onSelectTrajectory: (id: string) => void;
}

export const TrajectoryScene: React.FC<TrajectorySceneProps> = ({
  destination,
  selectedTrajectory,
  onSelectTrajectory,
}) => {
  const probeRef = useRef<THREE.Group>(null);
  const destPos = useMemo<[number, number, number]>(() => {
    if (destination?.id === 'moon') return [6, 1, 2];
    if (destination?.id === 'mars') return [9, 2, -3];
    if (destination?.id === 'asteroid') return [11, -1, 4];
    if (destination?.id === 'jupiter') return [14, 3, -2];
    return [4, 0, 0]; // Earth orbit
  }, [destination]);

  // Compute curved 3D Bezier trajectories
  const curves = useMemo(() => {
    // 1. Fast Transfer: Direct, shallow arc
    const fastCtrl = new THREE.Vector3(destPos[0] * 0.4, destPos[1] + 1.2, destPos[2] * 0.4);
    const fastCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0, 0),
      fastCtrl,
      new THREE.Vector3(...destPos)
    );

    // 2. Balanced Transfer: Wide Hohmann elliptical arc
    const balancedCtrl1 = new THREE.Vector3(destPos[0] * 0.3, destPos[1] + 3.5, destPos[2] * 0.1 - 2.5);
    const balancedCtrl2 = new THREE.Vector3(destPos[0] * 0.7, destPos[1] + 3.2, destPos[2] * 0.9 + 2.0);
    const balancedCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, 0, 0),
      balancedCtrl1,
      balancedCtrl2,
      new THREE.Vector3(...destPos)
    );

    // 3. Efficient Transfer: Weak stability boundary sweeping wide arc
    const effCtrl1 = new THREE.Vector3(destPos[0] * 0.2, destPos[1] - 3.0, destPos[2] - 4.5);
    const effCtrl2 = new THREE.Vector3(destPos[0] * 0.8, destPos[1] + 4.5, destPos[2] + 4.0);
    const effCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, 0, 0),
      effCtrl1,
      effCtrl2,
      new THREE.Vector3(...destPos)
    );

    return {
      'traj-fast': fastCurve,
      'traj-balanced': balancedCurve,
      'traj-efficient': effCurve,
    };
  }, [destPos]);

  // Animated probe traveling along the active trajectory
  useFrame(({ clock }) => {
    if (probeRef.current && selectedTrajectory) {
      const activeCurve = curves[selectedTrajectory.id as keyof typeof curves] || curves['traj-balanced'];
      const t = (clock.elapsedTime * 0.2) % 1;
      const point = activeCurve.getPoint(t);
      probeRef.current.position.copy(point);

      // Orient probe toward next point
      const nextPoint = activeCurve.getPoint(Math.min(0.999, t + 0.02));
      probeRef.current.lookAt(nextPoint);
    }
  });

  return (
    <>
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        minDistance={4}
        maxDistance={30}
        maxPolarAngle={Math.PI / 1.8}
      />

      {/* Earth (Launch Origin) */}
      <group position={[0, 0, 0]}>
        <mesh>
          <sphereGeometry args={[1.0, 32, 32]} />
          <meshStandardMaterial color="#1e40af" roughness={0.4} />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.08, 16, 16]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.2} />
        </mesh>
        <Html position={[0, 1.4, 0]} center>
          <div className="bg-space-900/90 border border-slate-700 px-2 py-0.5 rounded text-[11px] font-mono text-slate-300 whitespace-nowrap">
            EARTH (Launch Point)
          </div>
        </Html>
      </group>

      {/* Destination Planet / Moon / Asteroid */}
      <group position={destPos}>
        <mesh>
          <sphereGeometry args={[destination?.type === 'MOON' ? 0.45 : (destination?.type === 'ASTEROID' ? 0.35 : 0.75), 32, 32]} />
          <meshStandardMaterial color={destination?.color || '#ef4444'} roughness={0.6} />
        </mesh>
        {/* Orbital target ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.1, 1.18, 32]} />
          <meshBasicMaterial color="#00e5ff" side={THREE.DoubleSide} />
        </mesh>
        <Html position={[0, 1.3, 0]} center>
          <div className="bg-space-900/90 border border-nasa-cyan/60 px-2 py-0.5 rounded text-[11px] font-mono text-nasa-cyan font-bold whitespace-nowrap shadow-lg shadow-nasa-cyan/20">
            {destination?.name?.toUpperCase() || 'DESTINATION'}
          </div>
        </Html>
      </group>

      {/* Trajectory 1: Fast Transfer */}
      <TrajectoryLine
        curve={curves['traj-fast']}
        isSelected={selectedTrajectory?.id === 'traj-fast'}
        color={selectedTrajectory?.id === 'traj-fast' ? '#ff5c00' : '#64748b'}
        opacity={selectedTrajectory?.id === 'traj-fast' ? 1.0 : 0.35}
        onClick={() => onSelectTrajectory('traj-fast')}
      />

      {/* Trajectory 2: Balanced Transfer */}
      <TrajectoryLine
        curve={curves['traj-balanced']}
        isSelected={selectedTrajectory?.id === 'traj-balanced'}
        color={selectedTrajectory?.id === 'traj-balanced' ? '#00e5ff' : '#64748b'}
        opacity={selectedTrajectory?.id === 'traj-balanced' ? 1.0 : 0.35}
        onClick={() => onSelectTrajectory('traj-balanced')}
      />

      {/* Trajectory 3: Efficient Transfer */}
      <TrajectoryLine
        curve={curves['traj-efficient']}
        isSelected={selectedTrajectory?.id === 'traj-efficient'}
        color={selectedTrajectory?.id === 'traj-efficient' ? '#10b981' : '#64748b'}
        opacity={selectedTrajectory?.id === 'traj-efficient' ? 1.0 : 0.35}
        onClick={() => onSelectTrajectory('traj-efficient')}
      />

      {/* Animated Spacecraft Probe along active path */}
      <group ref={probeRef}>
        <mesh>
          <boxGeometry args={[0.2, 0.2, 0.3]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} />
        </mesh>
        {/* Probe solar arrays */}
        <mesh position={[0.25, 0, 0]}>
          <boxGeometry args={[0.3, 0.02, 0.15]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        <mesh position={[-0.25, 0, 0]}>
          <boxGeometry args={[0.3, 0.02, 0.15]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        {/* Engine burn flare */}
        <pointLight color="#00e5ff" intensity={2.5} distance={1.0} />
      </group>
    </>
  );
};

// Sub-component for rendering curved tubes
const TrajectoryLine: React.FC<{
  curve: THREE.Curve<THREE.Vector3>;
  isSelected: boolean;
  color: string;
  opacity: number;
  onClick: () => void;
}> = ({ curve, isSelected, color, opacity, onClick }) => {
  const geom = useMemo(() => new THREE.TubeGeometry(curve, 64, isSelected ? 0.05 : 0.025, 8, false), [curve, isSelected]);

  return (
    <mesh geometry={geom} onClick={onClick}>
      <meshBasicMaterial 
        color={color} 
        transparent 
        opacity={opacity} 
      />
    </mesh>
  );
};
