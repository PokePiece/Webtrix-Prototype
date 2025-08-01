import { Text } from '@react-three/drei'
import React from 'react'
import * as THREE from 'three'

const VoidNode = ({ setShowVoid, setShowVoidInfo }: { setShowVoidInfo:React.Dispatch<React.SetStateAction<boolean>> , setShowVoid: React.Dispatch<React.SetStateAction<boolean>> }) => {

    const handleClick = () => {
        console.log('handling click')
        setShowVoid(prev => !prev) // ✅ correct toggle
    }

    return (
        <group position={[25, 0, -5]} 
        onClick={handleClick}
        onContextMenu={(e) => {
            e.stopPropagation();
            setShowVoidInfo(prev => !prev)
        }}
        >
            <Text position={[0, 5, 0]} rotation={[0, 4.85, 0]}>
                Void Node
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

export default VoidNode
