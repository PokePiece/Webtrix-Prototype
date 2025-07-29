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

interface GrassForestProps {
  onSelect: (detail: Detail) => void
}

export default function GrassForest({ onSelect }: GrassForestProps) {
  const [areas, setAreas] = useState<Detail[]>([])

  useEffect(() => {
    fetch("/api/details")
      .then((res) => res.json())
      .then((data) => {
        const parsed: Detail[] = []
        for (const el of data.elements) {
          if (
            el.type === "way" &&
            el.tags?.landuse &&
            /grass|forest/.test(el.tags.landuse) &&
            el.geometry
          ) {
            const coords = el.geometry.map(
              (pt: { lon: number; lat: number }) => [pt.lon, pt.lat] as Coord
            )
            parsed.push({
              id: el.id,
              coords,
              tags: el.tags,
              type: "way",
            })
          }
        }
        setAreas(parsed)
      })
      .catch(console.error)
  }, [])

  const boxGeo = useMemo(() => new THREE.BoxGeometry(3, 0.2, 3), [])
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: 'green' }), [])
  const meshRef = useRef<THREE.InstancedMesh>(null)

  useEffect(() => {
    if (!meshRef.current) return
    const dummy = new THREE.Object3D()
    let index = 0
    for (const area of areas) {
      for (const [lon, lat] of area.coords) {
        const [x, y] = gpsToXY(lat, lon)
        dummy.position.set(x, 0, y)
        dummy.updateMatrix()
        if (index < meshRef.current.count) {
          meshRef.current.setMatrixAt(index, dummy.matrix)
          index++
        }
      }
    }
    meshRef.current.count = index
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [areas])

  return (
    <instancedMesh
      ref={meshRef}
      args={[boxGeo, mat, areas.reduce((sum, area) => sum + area.coords.length, 0)]}
      onClick={(e) => {
        const instanceIndex = e.instanceId
        if (instanceIndex != null) {
          let running = 0
          for (const area of areas) {
            const len = area.coords.length
            if (instanceIndex < running + len) {
              onSelect(area)
              break
            }
            running += len
          }
        }
        e.stopPropagation()
      }}
    />
  )
}
