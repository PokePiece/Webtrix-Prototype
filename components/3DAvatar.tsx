import React, { forwardRef, useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const Avatar = forwardRef<THREE.Group, {
  position: [number, number, number]
  setAvatarPos: (pos: [number, number, number]) => void
}>(({ position, setAvatarPos }, ref) => {
  const keys = useRef({ w: false, a: false, s: false, d: false })
  const internalRef = useRef<THREE.Group>(null)
  const groupRef = (ref as React.RefObject<THREE.Group>) || internalRef
  const { camera } = useThree()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (key in keys.current) keys.current[key as keyof typeof keys.current] = true
    }
    const up = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (key in keys.current) keys.current[key as keyof typeof keys.current] = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    const speed = 100
    const move = new THREE.Vector3()

    // Get camera forward and right vectors projected onto XZ plane
    const camDir = new THREE.Vector3()
    camera.getWorldDirection(camDir)
    camDir.y = 0
    camDir.normalize()

    const right = new THREE.Vector3()
    right.crossVectors(camDir, new THREE.Vector3(0, 1, 0)).normalize()

    // Movement in camera-relative space
    if (keys.current.w) move.add(camDir)
    if (keys.current.s) move.sub(camDir)
    if (keys.current.d) move.add(right)
    if (keys.current.a) move.sub(right)

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(speed * delta)
      groupRef.current.position.add(move)
      setAvatarPos(groupRef.current.position.toArray() as [number, number, number])
    }
  })

  return (
    <group ref={groupRef} scale={[10, 10, 10]} position={position}>
      <mesh position={[0, 1, 0]}>
        <capsuleGeometry args={[0.5, 1.5, 4, 8]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <mesh position={[0, 2.3, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </group>
  )
})

export default Avatar
