import React, { useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'

export default function BlackrockPortal({ onTeleport }: { onTeleport: () => void }) {
  // Large rectangular prism geometry (e.g., building size)
  // Example size: width 20, height 10, depth 40 units
  const geometry = useMemo(() => new THREE.SphereGeometry(3, 3, 3), [])
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: 'steelblue' }), [])

  function handleClick() {
    onTeleport()
  }

  return (
    <group position={[1185, 3, 1330]}>
      <mesh onClick={handleClick}  geometry={geometry} material={material} castShadow receiveShadow />
      <Text
        position={[0, 4, 0]}
        rotation={[0,4, 0]}
        anchorX='center'
        anchorY='middle'
        fontSize={1}
      >
        WebPortal to Renevade
      </Text>
    </group>
  )
}