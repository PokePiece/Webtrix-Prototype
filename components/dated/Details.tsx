// Details.tsx
import { useEffect, useState, useMemo } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'

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

interface Detail {
    id: number
    coords: Coord[]
    tags: { [key: string]: string }
    type: 'node' | 'way'
}

interface DetailsProps {
    onSelect: (detail: Detail) => void
}

export default function Details({ onSelect }: DetailsProps) {
    const [details, setDetails] = useState<Detail[]>([])

    useEffect(() => {
  fetch("/api/details")
    .then((res) => res.json())
    .then((data) => {
      // Build node map
      const nodeMap = new Map<number, Coord>()
      for (const el of data.elements) {
        if (el.type === "node" && el.lat !== undefined && el.lon !== undefined) {
          nodeMap.set(el.id, [el.lon, el.lat])
        }
      }

      // Convert elements into Detail[], resolving coords for ways
      const details: Detail[] = data.elements.map((el: any) => {
        if (el.type === "node") {
          return {
            id: el.id,
            coords: el.lat && el.lon ? [[el.lon, el.lat]] : [],
            tags: el.tags || {},
            type: "node",
          }
        } else if (el.type === "way" && el.nodes) {
          const coords = el.nodes
            .map((nodeId: number) => nodeMap.get(nodeId))
            .filter((pt:any): pt is Coord => pt !== undefined)
          return {
            id: el.id,
            coords,
            tags: el.tags || {},
            type: "way",
          }
        } else {
          // fallback empty coords for unsupported types
          return {
            id: el.id,
            coords: [],
            tags: el.tags || {},
            type: el.type,
          }
        }
      })

      setDetails(details)
    })
    .catch(console.error)
}, [])

    // Procedural geometry generation logic based on tags and type
    const detailMeshes = useMemo(() => {
        return details.map(({ id, coords, tags, type }) => {
            // Convert GPS coords to local XY coords
            const points = coords.map(([lon, lat]) => {
                const [x, y] = gpsToXY(lat, lon)
                return new THREE.Vector2(x, y)
            })

            let geometry: THREE.BufferGeometry
            let color = new THREE.Color(0xaaaaaa)
            let height = 1

            // Simple procedural geometry rules based on type and tags
            if (type === "node") {
                // Nodes: represent as spheres (like trees, lamps, benches)
                geometry = new THREE.SphereGeometry(1, 8, 8)

                // Different colors for common node types
                if (tags.natural === "tree") color.set("green")
                else if (tags.highway === "street_lamp") color.set("yellow")
                else if (tags.amenity === "bench") color.set("brown")
                else if (tags.emergency === "fire_hydrant") color.set("red")
                else if (tags.highway === "bus_stop") color.set("blue")
                else color.set("gray")

            } else if (type === "way") {
                if (tags.natural === "water" || tags.waterway) {
                    // Water bodies as flat extruded shapes, blue color
                    const shape = new THREE.Shape(points)
                    height = 0.1
                    geometry = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false })
                    color.set("blue")
                } else if (tags.landuse && /grass|forest/.test(tags.landuse)) {
                    // Grass or forest areas as flat green shapes
                    const shape = new THREE.Shape(points)
                    height = 0.1
                    geometry = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false })
                    color.set("green")
                } else if (tags.highway && /footway|path|pedestrian/.test(tags.highway)) {
                    // Paths as thin extruded shapes, gray color
                    const shape = new THREE.Shape(points)
                    height = 0.05
                    geometry = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false })
                    color.set("gray")
                } else if (tags.barrier && /fence|hedge/.test(tags.barrier)) {
                    // Fences / hedges as thin walls, brown/green color
                    const shape = new THREE.Shape(points)
                    height = 2
                    geometry = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false })
                    color.set(tags.barrier === "fence" ? "brown" : "darkgreen")
                } else if (tags.leisure && /park|playground|pitch/.test(tags.leisure)) {
                    // Leisure areas as flat green shapes
                    const shape = new THREE.Shape(points)
                    height = 0.1
                    geometry = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false })
                    color.set("darkgreen")
                } else if (tags.shop) {
                    // Shops as extruded shapes with light color
                    const shape = new THREE.Shape(points)
                    height = 3
                    geometry = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false })
                    color.set("orange")
                } else {
                    // Default way representation as thin gray shape
                    if (points.length > 2) {
                        const shape = new THREE.Shape(points)
                        height = 0.2
                        geometry = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false })
                    } else {
                        geometry = new THREE.BufferGeometry()
                    }
                    color.set("gray")
                }
            } else {
                // Fallback geometry (empty)
                geometry = new THREE.BufferGeometry()
                color.set("gray")
            }

            geometry.rotateX(-Math.PI / 2)

            // Compute center for Html overlay or interaction
            const center = new THREE.Vector3()
            geometry.computeBoundingBox()
            geometry.boundingBox?.getCenter(center)

            return (
                <group key={id}>
                    <mesh
                        geometry={geometry}
                        onClick={e => {
                            e.stopPropagation()
                            onSelect({ id, coords, tags, type })
                        }}
                    >
                        <meshStandardMaterial color={color} />
                    </mesh>
{/*
                    {tags.name && (
                        <Html position={center.clone().setY(height + 0.5)} center>
                            <div style={{ background: "white", padding: "2px 5px", borderRadius: 3, fontSize: 10 }}>
                                {tags.name}
                            </div>
                        </Html>
                    )}*/}
                </group>
            )
        })
    }, [details, onSelect])

    return <>{detailMeshes}</>
}
