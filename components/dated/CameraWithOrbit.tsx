import { OrbitControls } from '@react-three/drei'
import { useThree, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

export default function CameraWithOrbit({ targetPosition }: { targetPosition: [number, number, number] }) {
  const { camera, gl } = useThree()
  const controls = useRef<any>(null)

  useFrame(() => {
    const [x, y, z] = targetPosition
    const targetVec = new THREE.Vector3(x, y, z)

    // Update orbit controls target
    if (controls.current) {
      controls.current.target.lerp(targetVec, 0.1)
      controls.current.update()
    }

    // Maintain camera distance relative to target
    // Optionally clamp zoom here
  })

  return <OrbitControls
    ref={controls}
    camera={camera}
    domElement={gl.domElement}
    enablePan={false}
    enableZoom={true}
    zoomSpeed={1.0}
    minDistance={5}
    maxDistance={100}
  />


}
