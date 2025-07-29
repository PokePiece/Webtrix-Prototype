import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function House() {
  const houseRef = useRef<THREE.Group>(null)

  /*
  useFrame(() => {
    if (houseRef.current) {
      houseRef.current.rotation.y += 0.001
    }
  })
*/

  return (
    <group ref={houseRef} position={[10, 0, 15]} rotation={[0,3,0]} scale={[1,1,1]}>
      {/* Base */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[4, 2, 4]} />
        <meshStandardMaterial color="tan" />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 3, 0]} rotation={[0, 0.8, 0]}>
        <coneGeometry args={[3.2, 2, 4]} />
        <meshStandardMaterial color="brown" />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.5, 2.01]}>
        <boxGeometry args={[1, 1.5, 0.1]} />
        <meshStandardMaterial color="saddlebrown" />
      </mesh>
    </group>
  )
}
