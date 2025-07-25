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

// Helper: Simple axis-aligned rectangular partition of polygon footprint
// For simplicity, this example splits footprint bounding box into N equal rectangles horizontally
function subdivideFootprint(coords: Coord[], subdivisions = 3) {
  if (coords.length === 0) return []

  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity
  coords.forEach(([lon, lat]) => {
    const [x, z] = gpsToXY(lat, lon)
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (z < minZ) minZ = z
    if (z > maxZ) maxZ = z
  })

  const width = maxX - minX
  const depth = maxZ - minZ
  const height = 30

  const rects = []
  const rectWidth = width / subdivisions

  for (let i = 0; i < subdivisions; i++) {
    rects.push({
      centerX: minX + rectWidth * (i + 0.5),
      centerZ: minZ + depth / 2,
      width: rectWidth,
      depth: depth,
      height,
    })
  }

  return rects
}

export default function NewestBuildings({ buildingData }: { buildingData: { coords: Coord[], height: number }[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!)

  const { geometry, material, count, transforms } = useMemo(() => {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
    const mat = new THREE.MeshStandardMaterial({ color: '#aaa' })

    // For each building, subdivide into multiple rectangles
    const allRects = buildingData.flatMap(({ coords, height }) =>
      subdivideFootprint(coords, 3).map(r => ({ ...r, height }))
    )

    return {
      geometry: boxGeometry,
      material: mat,
      count: allRects.length,
      transforms: allRects,
    }
  }, [buildingData])

  useEffect(() => {
    if (!meshRef.current || transforms.length !== count) return
    const dummy = new THREE.Object3D()
    for (let i = 0; i < count; i++) {
      const t = transforms[i]
      dummy.position.set(t.centerX, t.height / 2, t.centerZ)
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
      frustumCulled={true}
    />
  )
}
