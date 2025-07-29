import { useEffect, useState, useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

type Coord = [number, number]

function gpsToXY(lat: number, lon: number): [number, number] {
  const R = 6371000
  const originLat = 40.7660
  const originLon = -111.8460
  const dLat = (lat - originLat) * (Math.PI / 180)
  const dLon = (lon - originLon) * (Math.PI / 180)
  const x = dLon * R * Math.cos(originLat * Math.PI / 180)
  const y = dLat * R
  return [x, y]
}

interface Detail {
  id: number
  coords: Coord[]
  tags: { [key: string]: string }
  type: 'node' | 'way'
}

interface DetailsProps {
  onSelect: (detail: Detail) => void
}

export default function Footways({ onSelect }: DetailsProps) {
  const [footways, setFootways] = useState<Detail[]>([])

  useEffect(() => {
    fetch("/api/details")
      .then((res) => res.json())
      .then((data) => {
        const parsed: Detail[] = []
        for (const el of data.elements) {
          if (el.type === "way" && el.tags?.highway === "footway" && el.geometry) {
            const coords: Coord[] = el.geometry.map((pt: any) => [pt.lon, pt.lat])
            parsed.push({
              id: el.id,
              coords,
              tags: el.tags,
              type: "way",
            })
          }
        }
        setFootways(parsed)
      })
      .catch(console.error)
  }, [])

  const boxGeo = useMemo(() => new THREE.BoxGeometry(1, 0.2, 1), [])
  const orangeMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 'orange' }), [])
  const meshRef = useRef<THREE.InstancedMesh>(null)

  useEffect(() => {
    if (!meshRef.current) return
    const dummy = new THREE.Object3D()
    let index = 0
    for (const way of footways) {
      for (const [lon, lat] of way.coords) {
        const [x, y] = gpsToXY(lat, lon)
        dummy.position.set(x, 0, y)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(index++, dummy.matrix)
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [footways])

  const totalInstances = useMemo(
    () => footways.reduce((sum, way) => sum + way.coords.length, 0),
    [footways]
  )

  return (
    <instancedMesh
      ref={meshRef}
      args={[boxGeo, orangeMat, totalInstances]}
      onClick={(e) => {
        const instanceId = e.instanceId
        if (instanceId != null) {
          // Approximate reverse lookup
          let acc = 0
          for (const way of footways) {
            if (instanceId < acc + way.coords.length) {
              onSelect(way)
              break
            }
            acc += way.coords.length
          }
        }
        e.stopPropagation()
      }}
    />
  )
}
