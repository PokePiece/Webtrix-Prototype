type ChairProps = {
  position: [number, number, number]
  rotation?: [number, number, number]
}

export default function Chair({ position, rotation = [0, 0, 0] }: ChairProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Backrest */}
      <mesh position={[0, 1, -0.45]}>
        <boxGeometry args={[1, 1, 0.1]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.45, 0.25, -0.45]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[0.45, 0.25, -0.45]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[-0.45, 0.25, 0.45]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[0.45, 0.25, 0.45]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
    </group>
  )
}
