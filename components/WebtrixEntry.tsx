import React from 'react'
import { Text } from '@react-three/drei'

const WebtrixEntry = () => {

    const fontSize = 5
    const maxWidth = 20

    return (
        <group position={[-10, 25, 60]} rotation={[0, 2.5, 0]}>
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[maxWidth * 1.3, fontSize * 4.5]} />

                <meshBasicMaterial color="gray" opacity={0.6} transparent />
            </mesh>
            <Text
                position={[0, 0, 0.01]} // Slightly in front to avoid z-fighting
                fontSize={fontSize}
                color="white"
                anchorX="center"
                anchorY="middle"
                maxWidth={maxWidth}
                outlineWidth={0.03}
                outlineColor="#333"
            >
                Welcome to the Webtrix
            </Text>
        </group>
    )

}

export default WebtrixEntry


/*
import React from 'react'
import { Text } from '@react-three/drei'

const WebtrixEntry = () => {
  return (
    <Text
      position={[0, 3, 0]}
      fontSize={1.5}
      color="white"
      anchorX="center"
      anchorY="middle"
      maxWidth={10}
      // Optional: add a slight background plane behind text for readability
      // Or create a mesh plane manually
      outlineWidth={0.03}
      outlineColor="#333"
    >
      Welcome to the Webtrix
    </Text>
  )
}

export default WebtrixEntry

*/