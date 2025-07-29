import React from 'react'
import { Text } from '@react-three/drei'

const Renevade = () => {

    const fontSize = 5
    const maxWidth = 20

    return (
        <group position={[5, 2, 13]} rotation={[0, 3, 0]}>
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[5, 2, 5]} />

                <meshBasicMaterial color="black" opacity={0.6}  />
            </mesh>
            <Text
                position={[0, 0, 0.01]}
                fontSize={1}
                color="white"
                anchorX="center"
                anchorY="middle"
                maxWidth={maxWidth}
                outlineWidth={0.03}
                outlineColor="#333"
            >
                Renevade
            </Text>
        </group>
    )

}

export default Renevade

