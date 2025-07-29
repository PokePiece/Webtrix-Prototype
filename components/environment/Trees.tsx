

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

export default function Trees({ onSelect }: DetailsProps) {

    const [trees, setTrees] = useState<Detail[]>([])

    useEffect(() => {

        fetch("/api/details")

            .then((res) => res.json())

            .then((data) => {

                const parsed: Detail[] = []

                for (const el of data.elements) {

                    if (el.type === "node" && el.tags?.natural === "tree" && el.lat && el.lon) {

                        parsed.push({

                            id: el.id,

                            coords: [[el.lon, el.lat]],

                            tags: el.tags,

                            type: "node",

                        })

                    }

                }

                setTrees(parsed)

            })

            .catch(console.error)

    }, [])

    const sphereGeo = useMemo(() => new THREE.SphereGeometry(1, 8, 8), [])

    const greenMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 'green' }), [])

    const treeMeshRef = useRef<THREE.InstancedMesh>(null)

    useEffect(() => {

        if (!treeMeshRef.current) return

        const dummy = new THREE.Object3D()

        trees.forEach((tree, i) => {

            const [lon, lat] = tree.coords[0]

            const [x, y] = gpsToXY(lat, lon)

            dummy.position.set(x, 0, y)

            dummy.updateMatrix()

            treeMeshRef.current!.setMatrixAt(i, dummy.matrix)

        })

        treeMeshRef.current.instanceMatrix.needsUpdate = true

    }, [trees])

    return (

        <instancedMesh
            ref={treeMeshRef}
            scale={[1, 5, 1]}
            args={[sphereGeo, greenMat, trees.length]}
            onClick={(e) => {

                const index = e.instanceId
                if (index != null) onSelect(trees[index])
                e.stopPropagation()
            }}
        />
    )
}