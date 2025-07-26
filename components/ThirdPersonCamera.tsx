import { useThree, useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function ThirdPersonCamera({ avatarRef }: { avatarRef: React.RefObject<THREE.Object3D | null> }) {
  const { camera, gl } = useThree()
  const pointer = useRef({ x: 0, y: 0 })
  const theta = useRef(0)
  const phi = useRef(Math.PI / 6)

  const onMouseMove = (event: MouseEvent) => {
    if (event.buttons !== 1) return
    pointer.current.x -= event.movementX * 0.005
    pointer.current.y -= event.movementY * 0.005

    theta.current = pointer.current.x
    phi.current = THREE.MathUtils.clamp(pointer.current.y, 0.1, Math.PI / 2.2)
  }

  useEffect(() => {
    const domElement = gl.domElement
    domElement.addEventListener('mousemove', onMouseMove)
    return () => domElement.removeEventListener('mousemove', onMouseMove)
  }, [gl])

  useFrame(() => {
    if (!avatarRef.current) return

    const offset = new THREE.Vector3()
    const radius = 100

    offset.x = radius * Math.sin(phi.current) * Math.sin(theta.current)
    offset.y = radius * Math.cos(phi.current)
    offset.z = radius * Math.sin(phi.current) * Math.cos(theta.current)

    const target = avatarRef.current.position.clone()
    camera.position.copy(target.clone().add(offset))
    camera.lookAt(target)
  })

  return null
}
