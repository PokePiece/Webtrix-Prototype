import { useFrame } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

type AvatarProps = {
  position: [number, number, number]
  setPosition: React.Dispatch<React.SetStateAction<[number, number, number]>>
}

export default function Avatar({ position, setPosition }: AvatarProps) {
  const ref = useRef<THREE.Group>(null)
  const keys = useRef<{ [key: string]: boolean }>({})

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame((_, delta) => {
    let [x, y, z] = position
    const speed = 10

    if (keys.current['w'] || keys.current['arrowup']) z -= speed * delta
    if (keys.current['s'] || keys.current['arrowdown']) z += speed * delta
    if (keys.current['a'] || keys.current['arrowleft']) x -= speed * delta
    if (keys.current['d'] || keys.current['arrowright']) x += speed * delta

    // Clamp bounds if needed
    x = Math.min(100, Math.max(-100, x))
    z = Math.min(100, Math.max(-100, z))

    setPosition([x, y, z])

    if (ref.current) {
      ref.current.position.set(x, y, z)
    }
  })

  return (
    <group ref={ref} scale={[2, 2, 2]}>
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
}
