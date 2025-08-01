import { Text } from '@react-three/drei'
import React from 'react'
import * as THREE from 'three'

const GoogleNode = ({ setShowGoogle, setShowGoogleInfo, setIsChatting }: { setShowGoogleInfo:React.Dispatch<React.SetStateAction<boolean>> , setShowGoogle: React.Dispatch<React.SetStateAction<boolean>>, setIsChatting: React.Dispatch<React.SetStateAction<boolean>> }) => {

    const handleClick = () => {
        console.log('handling click')
        setShowGoogle(prev => !prev)
        setIsChatting(prev => !prev)
    }

    return (
        <group position={[3, 0, -5]} 
        onClick={handleClick}
        onContextMenu={(e) => {
            e.stopPropagation();
            setShowGoogleInfo(prev => !prev)
        }}
        >
            <Text position={[0, 5, 0]} rotation={[0, 1.3, 0]}>
                Google Node
            </Text>
            <mesh>
                <boxGeometry args={[5, 5, 5]} />
                <meshStandardMaterial color='purple' />
            </mesh>
            <mesh position={[0, 3, 0]}>
                <boxGeometry args={[3, 2, 3]} />
                <meshStandardMaterial color='purple' />
            </mesh>
        </group>
    )
}

export default GoogleNode
