

export default function Chair() {
  return (
    <group position={[10, 0, 11]} rotation={[0,3.15,0]}>
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
