import { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'

type Coord = [number, number]

function gpsToXY(lat: number, lon: number): [number, number] {
  const R = 6371000
  const originLat = 40.765
  const originLon = -111.89
  const dLat = (lat - originLat) * (Math.PI / 180)
  const dLon = (lon - originLon) * (Math.PI / 180)
  const x = dLon * R * Math.cos(originLat * Math.PI / 180)
  const y = dLat * R
  return [x, y]
}

export default function Buildings({ buildingData }: { buildingData: Coord[][] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!)

  // Compute simplified boxes for each footprint
  const { geometry, material, count, transforms } = useMemo(() => {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1) // unit cube; scale per building
    const mat = new THREE.MeshStandardMaterial({ color: '#aaa' })
    const count = buildingData.length

    // For each building footprint, compute bounding box in XY
    const transforms = buildingData.map((coords) => {
      let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity

      coords.forEach(([lon, lat]) => {
        const [x, z] = gpsToXY(lat, lon)
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (z < minZ) minZ = z
        if (z > maxZ) maxZ = z
      })

      const width = maxX - minX || 5 // fallback to 5m if degenerate
      const depth = maxZ - minZ || 5
      const height = 30 // fixed building height; adjust or infer if you want

      // Center position
      const centerX = minX + width / 2
      const centerZ = minZ + depth / 2

      return { centerX, centerZ, width, depth, height }
    })

    return { geometry: boxGeometry, material: mat, count, transforms }
  }, [buildingData])

  useEffect(() => {
    if (!meshRef.current || transforms.length !== count) return
    const dummy = new THREE.Object3D()
    for (let i = 0; i < count; i++) {
      const t = transforms[i]
      dummy.position.set(t.centerX, t.height / 2, t.centerZ) // y = half height so base is at y=0
      dummy.scale.set(t.width, t.height, t.depth)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [transforms, count])

  if (count === 0) return null

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      frustumCulled={true} // enable culling for perf
    />
  )
}
