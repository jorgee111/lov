import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Text } from '@react-three/drei';
import * as THREE from 'three';

// Props to receive the state of different bus parts
interface Bus3DModelProps {
  tireWearFL: number; // 0-100%
  tireWearFR: number;
  tireWearRL: number;
  tireWearRR: number;
  glassCondition: string; // "ok", "warning", "critical"
  engineStatus: string;   // "ok", "warning", "critical"
  onPartClick: (partName: string) => void;
}

export const Bus3DModel: React.FC<Bus3DModelProps> = ({
  tireWearFL,
  tireWearFR,
  tireWearRL,
  tireWearRR,
  glassCondition,
  engineStatus,
  onPartClick,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  // Simple ambient animation (slight floating)
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05 + 0.5;
    }
  });

  // Helper to color wheels based on wear (lower is worse = red)
  const getTireColor = (wear: number) => {
    if (wear < 30) return "#ef4444"; // Red (critical)
    if (wear < 60) return "#f59e0b"; // Yellow (warning)
    return "#10b981";                // Green (ok)
  };

  // Helper for generic status colors
  const getStatusColor = (status: string, defaultColor: string) => {
    if (status === "critical") return "#ef4444";
    if (status === "warning") return "#f59e0b";
    return defaultColor;
  };

  const handlePointerOver = (e: any, part: string) => {
    e.stopPropagation();
    setHoveredPart(part);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHoveredPart(null);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: any, part: string) => {
    e.stopPropagation();
    onPartClick(part);
  };

  return (
    <group ref={groupRef}>
      {/* --- Main Body (Chassis) --- */}
      <Box 
        args={[2, 1.2, 5]} 
        position={[0, 0.6, 0]} 
        castShadow
        onPointerOver={(e) => handlePointerOver(e, 'chassis')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'chasis general')}
      >
        <meshStandardMaterial 
          color={hoveredPart === 'chassis' ? '#e2e8f0' : '#ffffff'} 
          roughness={0.2} 
          metalness={0.8} 
        />
      </Box>

      {/* --- Glass / Windows --- */}
      <Box 
        args={[2.02, 0.5, 4.8]} 
        position={[0, 0.8, 0]}
        onPointerOver={(e) => handlePointerOver(e, 'glass')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'cristales')}
      >
        <meshStandardMaterial 
          color={getStatusColor(glassCondition, "#60a5fa")}
          transparent 
          opacity={0.6} 
          roughness={0.1}
          metalness={0.9}
        />
      </Box>

      {/* --- Engine Area (Back) --- */}
      <Box 
        args={[1.8, 1, 0.5]} 
        position={[0, 0.5, -2.4]}
        onPointerOver={(e) => handlePointerOver(e, 'engine')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'motor')}
      >
        <meshStandardMaterial 
          color={getStatusColor(engineStatus, "#334155")}
          roughness={0.7}
        />
      </Box>

      {/* --- Wheels --- */}
      {/* Front Left */}
      <Cylinder 
        args={[0.4, 0.4, 0.3, 32]} 
        position={[1.1, 0, 1.5]} 
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        onPointerOver={(e) => handlePointerOver(e, 'tire_fl')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'rueda delantera izquierda')}
      >
        <meshStandardMaterial color={getTireColor(tireWearFL)} roughness={0.8} />
      </Cylinder>

      {/* Front Right */}
      <Cylinder 
        args={[0.4, 0.4, 0.3, 32]} 
        position={[-1.1, 0, 1.5]} 
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        onPointerOver={(e) => handlePointerOver(e, 'tire_fr')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'rueda delantera derecha')}
      >
        <meshStandardMaterial color={getTireColor(tireWearFR)} roughness={0.8} />
      </Cylinder>

      {/* Rear Left */}
      <Cylinder 
        args={[0.4, 0.4, 0.3, 32]} 
        position={[1.1, 0, -1.5]} 
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        onPointerOver={(e) => handlePointerOver(e, 'tire_rl')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'rueda trasera izquierda')}
      >
        <meshStandardMaterial color={getTireColor(tireWearRL)} roughness={0.8} />
      </Cylinder>

      {/* Rear Right */}
      <Cylinder 
        args={[0.4, 0.4, 0.3, 32]} 
        position={[-1.1, 0, -1.5]} 
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        onPointerOver={(e) => handlePointerOver(e, 'tire_rr')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'rueda trasera derecha')}
      >
        <meshStandardMaterial color={getTireColor(tireWearRR)} roughness={0.8} />
      </Cylinder>

      {/* Simple shadow plane underneath */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]} receiveShadow>
        <planeGeometry args={[10, 15]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};
