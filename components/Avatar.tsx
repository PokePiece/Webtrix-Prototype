import { useFrame } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

export default function Avatar() {
  const ref = useRef<THREE.Group>(null)
  // Position as tuple [x, y, z]
  const [pos, setPos] = useState<[number, number, number]>([0, 0, 0])

  // Track which keys are pressed
  const keys = useRef<{[key: string]: boolean}>({})

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
    let [x, y, z] = pos
    const speed = 10 // units per second

    if (keys.current['w'] || keys.current['arrowup']) {
      z -= speed * delta
    }
    if (keys.current['s'] || keys.current['arrowdown']) {
      z += speed * delta
    }
    if (keys.current['a'] || keys.current['arrowleft']) {
      x -= speed * delta
    }
    if (keys.current['d'] || keys.current['arrowright']) {
      x += speed * delta
    }

    // Optional: clamp position within map bounds (e.g., -100 to 100)
    x = Math.min(100, Math.max(-100, x))
    z = Math.min(100, Math.max(-100, z))

    setPos([x, y, z])

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
