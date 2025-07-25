"use client"

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useState } from 'react'
import Avatar from '@/components/Avatar'

const mockGPS = { lat: 40.7128, lon: -74.006 }

function latLonToXYZ(lat:any, lon:any, origin:any) {
  const earthRadius = 6371000
  const dLat = (lat - origin.lat) * (Math.PI / 180)
  const dLon = (lon - origin.lon) * (Math.PI / 180)
  const x = dLon * earthRadius * Math.cos(origin.lat * Math.PI / 180)
  const z = dLat * earthRadius
  return [x, 0, -z]
}

function Building({ position, color = 'orange' }:{position:any, color:any}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[5, 10, 5]} />
      <meshStandardMaterial color={color} flatShading />
    </mesh>
  )
}

export default function Page() {
  const [origin] = useState(mockGPS)

  const buildings = [
    { lat: origin.lat + 0.0002, lon: origin.lon + 0.0001, color: 'tomato' },
    { lat: origin.lat - 0.0003, lon: origin.lon + 0.0004, color: 'skyblue' },
    { lat: origin.lat + 0.0001, lon: origin.lon - 0.0003, color: 'limegreen' },
  ]

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
      <h1 className="text-3xl font-bold mb-6">Webtrix Stylized Map Demo</h1>
      <div className="w-full max-w-4xl h-[500px]">
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
          <Avatar />
          {buildings.map(({ lat, lon, color }, i) => {
            const pos = latLonToXYZ(lat, lon, origin)
            return <Building key={i} position={pos} color={color} />
          })}
          <OrbitControls />
        </Canvas>
      </div>
    </main>
  )
}
