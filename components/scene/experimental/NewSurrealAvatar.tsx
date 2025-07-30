/*
import React, { forwardRef, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import FloatingText from '../environment/text/FloatingText'
import { CapsuleCollider, RigidBody } from '@react-three/rapier'

const SurrealAvatar = forwardRef<THREE.Group, {
  position: [number, number, number]
  active: boolean
  onClick?: (e: React.MouseEvent) => void
  text: string | null
}>(({ position, active, onClick, text }, ref) => {
  const internalRef = useRef<THREE.Group>(null)
  const groupRef = (ref as React.RefObject<THREE.Group>) || internalRef

  const bodyRef = useRef<any>(null)

  useFrame(() => {
  if (!bodyRef.current) return
  const raw = bodyRef.current.raw?.()
  if (!raw) return

  // Current rotation quaternion
  const q = raw.rotation()
  const currentQuat = new THREE.Quaternion(q.x, q.y, q.z, q.w)

  // Calculate "up" vector from rotation
  const upVector = new THREE.Vector3(0, 1, 0).applyQuaternion(currentQuat)

  // Compute torque axis to correct tilt (cross between current up and world up)
  const torqueAxis = new THREE.Vector3().crossVectors(upVector, new THREE.Vector3(0, 1, 0))

  // Angle difference
  const angle = upVector.angleTo(new THREE.Vector3(0, 1, 0))

  // If tilt exceeds threshold, apply corrective torque
  if (angle > 0.01) {
    const correctionStrength = 10 // tweak this for stiffness
    raw.applyTorque({
      x: torqueAxis.x * angle * correctionStrength,
      y: 0,
      z: torqueAxis.z * angle * correctionStrength,
    }, true)
  }
})


  return (
    <RigidBody
      ref={bodyRef}
      position={position}
      gravityScale={100}
      friction={1}
      restitution={0}
      linearDamping={0.5}
      angularDamping={0.5}
      colliders={false}
      type="dynamic"
    >
      <CapsuleCollider args={[0.75, 0]} />
      <group ref={groupRef} scale={[0.822, 0.822, 0.822]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.6, 1, 0.4]} />
          <meshStandardMaterial color="crimson" />
        </mesh>

        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[0.5, 1, 0.3]} />
          <meshStandardMaterial color="crimson" />
        </mesh>

        <mesh position={[0, 2.25, 0]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="crimson" />
        </mesh>

        {text && <FloatingText text={text} offsetY={0} />}
      </group>
    </RigidBody>
  )
})

export default SurrealAvatar
*/