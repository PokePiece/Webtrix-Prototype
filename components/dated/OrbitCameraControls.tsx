import { OrbitControls } from '@react-three/drei'
import { useThree, useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function OrbitCameraControls({ avatarPos }: { avatarPos: [number, number, number] }) {
  const { camera, gl } = useThree()
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    // Set initial camera angle/orbit
    camera.position.set(avatarPos[0] + 100, avatarPos[1] + 150, avatarPos[2] + 100)
    controlsRef.current?.update()
  }, [])

  useFrame(() => {
    // Smoothly update OrbitControls target to follow avatar
    const target = new THREE.Vector3(...avatarPos)
    controlsRef.current.target.lerp(target, 0.1)
    controlsRef.current.update()
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.1}
      rotateSpeed={0.7}
      maxPolarAngle={Math.PI / 2.1}
      minDistance={50}
      maxDistance={500}
    />
  )
}
