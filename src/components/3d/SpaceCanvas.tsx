import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

interface SpaceCanvasProps {
  children: React.ReactNode;
  cameraPosition?: [number, number, number];
  fov?: number;
  showStars?: boolean;
  className?: string;
}

export const SpaceCanvas: React.FC<SpaceCanvasProps> = ({
  children,
  cameraPosition = [0, 0, 8],
  fov = 45,
  showStars = true,
  className = 'w-full h-full'
}) => {
  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={{ position: cameraPosition, fov }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-10, -5, -10]} intensity={0.2} color="#38bdf8" />
          <pointLight position={[0, 0, 0]} intensity={0.5} color="#00e5ff" />
          {showStars && (
            <Stars 
              radius={100} 
              depth={50} 
              count={2500} 
              factor={4} 
              saturation={0} 
              fade 
              speed={0.5} 
            />
          )}
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
};
