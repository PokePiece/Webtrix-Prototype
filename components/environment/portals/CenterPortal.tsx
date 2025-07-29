import React, { useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'

export default function CenterPortal({onTeleport}:{onTeleport: () => void}) {
    // Large rectangular prism geometry (e.g., building size)
    // Example size: width 20, height 10, depth 40 units
    const geometry = useMemo(() => new THREE.SphereGeometry(3, 3, 3), [])
    const material = useMemo(() => new THREE.MeshStandardMaterial({ color: 'steelblue' }), [])

    function handleClick() {
        onTeleport()
    }

    return (
        <>
            <mesh
                onClick={handleClick}
            position={[-1, 3, 1]} geometry={geometry} material={material} castShadow receiveShadow />
            <Text
                position={[-1.3,7,0]}
                rotation={[0,0.1,0]}
                anchorX='center'
                anchorY='middle'
                fontSize={1}
            >
                WebPortal to Blackrock Neurotech
            </Text>
        </>
    )
}
