import React, { forwardRef, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import FloatingText from '../environment/text/FloatingText'

const SurrealAvatar = forwardRef<THREE.Group, {
  position: [number, number, number]
  active: boolean
  onClick?: (e: React.MouseEvent) => void
  text: string | null
}>(({ position, active, onClick, text }, ref) => {
  const internalRef = useRef<THREE.Group>(null)
  const groupRef = (ref as React.RefObject<THREE.Group>) || internalRef

  // You can re-enable movement here later if `active === true`
  // and provide motion logic (based on AI or manual control).

  return (
    <group
      ref={groupRef}
      scale={[0.7, 0.77, 0.77]}
      position={position}
      rotation={[0,0,0]}
      onClick={onClick}
    >
      <mesh position={[0, 1, 0]}>
        <capsuleGeometry args={[0.5, 1.5, 4, 8]} />
        <meshStandardMaterial color="crimson" />
      </mesh>
      <mesh position={[0, 2.3, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="crimson" />
      </mesh>
      {text && <FloatingText text={text} offsetY={0} />}
    </group>
  )
})

export default SurrealAvatar
