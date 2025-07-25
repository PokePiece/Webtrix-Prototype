import { OrbitControls } from '@react-three/drei'
import { useThree, useFrame } from '@react-three/fiber'
import { useRef } from 'react'

export default function OrbitCameraControls() {
  const { camera } = useThree()
  const initialized = useRef(false)

  useFrame(() => {
    if (!initialized.current) {
      camera.position.set(200, 200, 200)
      camera.lookAt(0, 0, 0)
      initialized.current = true
    }
  })

  return (
    <OrbitControls
      enableDamping
      dampingFactor={0.05}
      minDistance={50}
      maxDistance={500}
      maxPolarAngle={Math.PI / 2.1}
    />
  )
}
