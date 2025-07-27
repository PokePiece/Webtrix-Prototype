import { useThree } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'

export function useOccluders() {
  const { scene } = useThree()
  return useMemo(() => {
    const occluders: THREE.Object3D[] = []
    scene.traverse((obj) => {
      if (obj.type === 'Mesh') occluders.push(obj)
    })
    return occluders
  }, [scene])
}
