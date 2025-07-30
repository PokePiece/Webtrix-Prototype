
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import FloatingText from '@/components/environment/text/FloatingText'
import { RigidBody, RapierRigidBody, CapsuleCollider } from '@react-three/rapier'
import { useThree } from '@react-three/fiber'




const NewAvatar = forwardRef<THREE.Group, {
  position: [number, number, number]
  setAvatarPos: (pos: [number, number, number]) => void
  active: boolean
  text: string | null
  capsuleRef: React.RefObject<THREE.Mesh | null>
}>(({ position, setAvatarPos, active, text, capsuleRef }, ref) => {
  const keys = useRef({ w: false, a: false, s: false, d: false })
  const groupRef = useRef<THREE.Group>(null)
  const bodyRef = useRef<RapierRigidBody>(null)
  const { camera } = useThree()

  // Expose the groupRef as the forwarded ref for camera tracking
  useImperativeHandle(ref, () => groupRef.current!)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (!active) return
      const key = e.key.toLowerCase()
      if (key in keys.current) keys.current[key as keyof typeof keys.current] = true
    }
    const up = (e: KeyboardEvent) => {
      if (!active) return
      const key = e.key.toLowerCase()
      if (key in keys.current) keys.current[key as keyof typeof keys.current] = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [active])

  useFrame((state, delta) => {
  if (!bodyRef.current) return

  const currentVel = bodyRef.current.linvel()
  const speed = 5

  // Get camera forward and right vectors projected onto XZ plane
  const camDir = new THREE.Vector3()
  camera.getWorldDirection(camDir)
  camDir.y = 0
  camDir.normalize()

  const right = new THREE.Vector3()
  right.crossVectors(camDir, new THREE.Vector3(0, 1, 0)).normalize()

  // Build input vector in camera-relative space
  const input = new THREE.Vector3()
  if (keys.current.w) input.add(camDir)
  if (keys.current.s) input.sub(camDir)
  if (keys.current.d) input.add(right)
  if (keys.current.a) input.sub(right)

  if (input.lengthSq() > 0) {
    input.normalize().multiplyScalar(speed)
  }

  bodyRef.current.setLinvel(
    { x: input.x, y: currentVel.y, z: input.z },
    true
  )
})


  return (
    <RigidBody
      ref={bodyRef}
      position={position}
      gravityScale={1}
      friction={1}
      restitution={0}
      linearDamping={0.9}
      angularDamping={1}
      colliders={false}
      type="dynamic"
      enabledRotations={[false, true, false]} // 🚨 Key line: lock X and Z rotation
    >

      <CapsuleCollider args={[0.75, 0]} />

      <group ref={groupRef} scale={[.822, .822, .822]}>

        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.6, 1, 0.4]} />
          <meshStandardMaterial color="orange" />
        </mesh>

  
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[0.5, 1, 0.3]} />
          <meshStandardMaterial color="orange" />
        </mesh>


        <mesh position={[0, 2.25, 0]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="orange" />
        </mesh>

        {text && <FloatingText text={text} offsetY={0} />}
      </group>
    </RigidBody>

  )
})

export default NewAvatar
