'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function BasicMovement() {
  const { camera, gl } = useThree()

  const keys = useRef<Record<string, boolean>>({})
  const velocity = useRef(new THREE.Vector3())
  const direction = useRef(new THREE.Vector3())

  const yaw = useRef(0)
  const pitch = useRef(0)
  const isDragging = useRef(false)
  const prev = useRef<[number, number] | null>(null)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => (keys.current[e.code] = true)
    const onKeyUp = (e: KeyboardEvent) => (keys.current[e.code] = false)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  useEffect(() => {
    const canvas = gl.domElement

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true
      prev.current = [e.clientX, e.clientY]
    }

    const onMouseUp = () => {
      isDragging.current = false
      prev.current = null
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !prev.current) return
      const [px, py] = prev.current
      const dx = e.clientX - px
      const dy = e.clientY - py
      prev.current = [e.clientX, e.clientY]

      yaw.current -= dx * 0.002
      pitch.current -= dy * 0.002
      pitch.current = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, pitch.current))
    }

    canvas.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [gl])

  useFrame((_state, delta) => {
    const speed = 5
    direction.current.set(0, 0, 0)
    if (keys.current['KeyS']) direction.current.z -= 1
    if (keys.current['KeyW']) direction.current.z += 1
    if (keys.current['KeyA']) direction.current.x -= 1
    if (keys.current['KeyD']) direction.current.x += 1
    direction.current.normalize()

    const rotation = new THREE.Euler(pitch.current, yaw.current, 0, 'YXZ')
    camera.quaternion.setFromEuler(rotation)

    const forward = new THREE.Vector3(0, 0, -1).applyEuler(rotation)
    const right = new THREE.Vector3(1, 0, 0).applyEuler(rotation)

    velocity.current.copy(forward).multiplyScalar(direction.current.z)
    velocity.current.add(right.multiplyScalar(direction.current.x))
    velocity.current.multiplyScalar(speed * delta)

    camera.position.add(velocity.current)
  })

  return null
}
