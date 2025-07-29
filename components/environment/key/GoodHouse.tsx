import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function GoodHouse( {position, rotation, scale, baseColor, roofColor, doorColor}:
{
  position:[number, number, number], 
  rotation:[number, number, number], 
  scale:[number,  number, number], 
  baseColor:string, 
  roofColor:string, 
  doorColor:string }) {

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Base */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[4, 2, 4]} />
        <meshStandardMaterial color={baseColor} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 3, 0]} rotation={[0, 0.8, 0]}>
        <coneGeometry args={[3.2, 2, 4]} />
        <meshStandardMaterial color={roofColor} />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.5, 2.01]}>
        <boxGeometry args={[1, 1.5, 0.1]} />
        <meshStandardMaterial color={doorColor} />
      </mesh>
    </group>
  )
}
