'use client';

import { useEffect, useRef, useState } from 'react'
import Avatar from './Avatar'
import CameraWithOrbit from './dated/CameraWithOrbit'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
// import other scene elements as needed



const mockGPS = { lat: 40.7128, lon: -74.006 }

function latLonToXYZ(lat: any, lon: any, origin: any) {
  const earthRadius = 6371000
  const dLat = (lat - origin.lat) * (Math.PI / 180)
  const dLon = (lon - origin.lon) * (Math.PI / 180)
  const x = dLon * earthRadius * Math.cos(origin.lat * Math.PI / 180)
  const z = dLat * earthRadius
  return [x, 0, -z]
}

type BuildingProps = {
  position: any
  color: string
  onClick: () => void
}


function Building({ position, color, onClick }: BuildingProps) {
  return (
    <mesh position={position} castShadow receiveShadow onClick={onClick} >
      <boxGeometry args={[5, 10, 5]} />
      <meshStandardMaterial color={color} flatShading />
    </mesh>
  )
}













































export default function SceneWrapper() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const preventScroll = (e: WheelEvent) => {
      e.preventDefault()
    }

    el.addEventListener('wheel', preventScroll, { passive: false })

    return () => {
      el.removeEventListener('wheel', preventScroll)
    }
  }, [])

  const [avatarPos, setAvatarPos] = useState<[number, number, number]>([0, 0, 0])
  const [origin] = useState(mockGPS)

  const [selectedBuilding, setSelectedBuilding] = useState<null | { lat: number; lon: number; color: string }>(null)

  const buildings = [
    { lat: origin.lat + 0.0002, lon: origin.lon + 0.0001, color: 'tomato', name: "Home"},
    { lat: origin.lat - 0.0003, lon: origin.lon + 0.0004, color: 'skyblue', name: "Windmatrix" },
    { lat: origin.lat + 0.0001, lon: origin.lon - 0.0003, color: 'limegreen', name: "Music" },
  ]


  return (
    <div ref={containerRef} style={{ width: '100vw', height: '100vh', touchAction: 'none' }}>
      <Canvas shadows camera={{ position: [0, 20, 30], fov: 50 }} className="rounded-lg shadow-lg">
        <ambientLight intensity={0.5} />
        <directionalLight
          castShadow
          position={[10, 20, 10]}
          intensity={1.5}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <Avatar position={avatarPos} setPosition={setAvatarPos} />
        {/*<CameraFollow targetPosition={avatarPos} />*/}
        <CameraWithOrbit targetPosition={avatarPos} />
        {buildings.map((b, i) => {
          const pos = latLonToXYZ(b.lat, b.lon, origin)
          return (
            <Building
              key={i}
              position={pos}
              color={b.color}
              onClick={() => setSelectedBuilding(b)}
            />
          )
        })}

        <OrbitControls />
      </Canvas>
      {selectedBuilding && (
        <div className="fixed bottom-4 left-4 bg-white bg-opacity-90 p-4 rounded shadow-lg max-w-xs">
          <h2 className="font-bold mb-2">Site Info</h2>
          <p>Latitude: {selectedBuilding.lat.toFixed(6)}</p>
          <p>Longitude: {selectedBuilding.lon.toFixed(6)}</p>
          <p>Color: {selectedBuilding.color}</p>
          <button
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
            onClick={() => setSelectedBuilding(null)}
          >
            Close
          </button>
        </div>
      )}

    </div>
  )
}
