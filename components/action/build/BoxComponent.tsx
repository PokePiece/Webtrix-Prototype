// components/BoxComponent.tsx
import React from 'react'

type BoxComponentProps = {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
  color?: string
}

const BoxComponent: React.FC<BoxComponentProps> = ({
  position = [0, 0.5, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  color = 'purple',
}) => {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export default BoxComponent
