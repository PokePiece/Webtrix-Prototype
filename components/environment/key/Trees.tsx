import { useEffect, useState, useRef, useMemo } from 'react'
import { Raycaster, Vector2, SphereGeometry, MeshStandardMaterial, InstancedMesh, Object3D } from 'three'
import { useFrame, useThree } from '@react-three/fiber'

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
interface TreesProps {
    onSelect: (detail: Detail) => void
    setShowTreeInfo: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Trees({ onSelect, setShowTreeInfo }: TreesProps) {
    const [trees, setTrees] = useState<Detail[]>([])

    const { camera } = useThree()
    const raycaster = useRef<Raycaster>(new Raycaster())

    const handlePointerDown = (event: React.PointerEvent) => {
        if (!treeMeshRef.current) return

        const x = (event.clientX / window.innerWidth) * 2 - 1
        const y = -(event.clientY / window.innerHeight) * 2 + 1

        raycaster.current.setFromCamera(new Vector2(x, y), camera)
        const intersects = raycaster.current.intersectObject(treeMeshRef.current)

        if (intersects.length > 0) {
            const instanceId = intersects[0].instanceId
            if (instanceId !== undefined && instanceId !== null) {
                onSelect(trees[instanceId])
            }
        }

        event.stopPropagation()
    }

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

    const sphereGeo = useMemo(() => new SphereGeometry(1, 8, 8), [])
    const greenMat = useMemo(() => new MeshStandardMaterial({ color: 'green' }), [])
    const treeMeshRef = useRef<InstancedMesh>(null)

    useEffect(() => {
        if (!treeMeshRef.current) return

        const dummy = new Object3D()

        trees.forEach((tree: Detail, i: number) => {
            const [lon, lat] = tree.coords[0]
            const [x, y] = gpsToXY(lat, lon)
            dummy.position.set(x, 0, y)
            dummy.updateMatrix()
            treeMeshRef.current!.setMatrixAt(i, dummy.matrix)
        })

        treeMeshRef.current.instanceMatrix.needsUpdate = true

        if (treeMeshRef.current && !treeMeshRef.current.raycast) {
            treeMeshRef.current.raycast = InstancedMesh.prototype.raycast
        }
    }, [trees])

    return (
        <>
            {trees.map((tree: Detail, i: number) => {
                const [lon, lat] = tree.coords[0]
                const [x, y] = gpsToXY(lat, lon)
                return (
                    <mesh
                        scale={[1, 5, 1]}
                        key={i}
                        position={[x, 0, y]}
                        geometry={sphereGeo}
                        material={greenMat}
                        onClick={() => onSelect(tree)}
                        onContextMenu={
                            (e) => {
                                e.stopPropagation();
                                setShowTreeInfo(prev => !prev)
                            }
                        }
                    />
                )
            })}
        </>
    )
}
