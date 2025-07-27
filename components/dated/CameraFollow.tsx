import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

interface CameraFollowProps {
  targetPosition: [number, number, number]
}

export default function CameraFollow({ targetPosition }: CameraFollowProps) {
  const { camera } = useThree()
  const vec = useRef(new THREE.Vector3())

  useFrame(() => {
    const [x, y, z] = targetPosition

    // Desired camera offset behind and above the avatar
    const offset = new THREE.Vector3(0, 10, 20)

    // Calculate target camera position
    const targetCamPos = vec.current.set(x, y, z).add(offset)

    // Smoothly interpolate camera position towards target
    camera.position.lerp(targetCamPos, 0.1)

    // Smoothly look at the avatar
    const lookAtPos = new THREE.Vector3(x, y, z)
    camera.lookAt(lookAtPos)
  })

  return null
}
