import { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'

type Coord = [number, number]

function gpsToXY(lat: number, lon: number): [number, number] {
  // Your existing conversion function here
  // If not available, replace with gpsToXZ or your projection
  // For example:
  const R = 6371000;
  const originLat = 40.765;
  const originLon = -111.89;
  const dLat = (lat - originLat) * (Math.PI / 180);
  const dLon = (lon - originLon) * (Math.PI / 180);
  const x = dLon * R * Math.cos(originLat * Math.PI / 180);
  const y = dLat * R;
  return [x, y];
}

export default function Buildings({ buildingData }: { buildingData: Coord[][] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!)

  const { geometry, material, count, positions } = useMemo(() => {
    const box = new THREE.BoxGeometry(5, 30, 5) // make cubes bigger and taller
    const mat = new THREE.MeshStandardMaterial({ color: '#aaa' })

    const count = buildingData.length
    const positions = buildingData.map((coords) => {
      const [lon, lat] = coords[0]  // note order: lon, lat from your original code
      const [x, z] = gpsToXY(lat, lon)  // convert lat/lon → local XY
      return new THREE.Vector3(x, 15, z) // y=15 to place cube base at y=0 with height=30
    })

    return { geometry: box, material: mat, count, positions }
  }, [buildingData])

  useEffect(() => {
    if (!meshRef.current || positions.length !== count) return
    const dummy = new THREE.Object3D()
    for (let i = 0; i < count; i++) {
      dummy.position.copy(positions[i])
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [positions, count])

  if (count === 0) return null

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      frustumCulled={false}
    />
  )
}
