"use client"

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useState } from 'react'
import ThreeSceneWrapper from '@/components/ThreeJSSceneWrapper'
import '@theatre/core'    
import studio from '@theatre/studio'

if (typeof window !== 'undefined') {
  studio.initialize()
}


const mockGPS = { lat: 40.7128, lon: -74.006 }

function latLonToXYZ(lat: any, lon: any, origin: any) {
  const earthRadius = 6371000
  const dLat = (lat - origin.lat) * (Math.PI / 180)
  const dLon = (lon - origin.lon) * (Math.PI / 180)
  const x = dLon * earthRadius * Math.cos(origin.lat * Math.PI / 180)
  const z = dLat * earthRadius
  return [x, 0, -z]
}

function Building({ position, color = 'orange' }: { position: any, color: any }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[5, 10, 5]} />
      <meshStandardMaterial color={color} flatShading />
    </mesh>
  )
}

export default function Page() {
  const [origin] = useState(mockGPS)
  const [avatarPos, setAvatarPos] = useState<[number, number, number]>([0, 0, 0])

  const buildings = [
    { lat: origin.lat + 0.0002, lon: origin.lon + 0.0001, color: 'tomato' },
    { lat: origin.lat - 0.0003, lon: origin.lon + 0.0004, color: 'skyblue' },
    { lat: origin.lat + 0.0001, lon: origin.lon - 0.0003, color: 'limegreen' },
  ]

  return (
    <main className="flex flex-col items-center justify-center min-h-screen mt-0 bg-white text-black">
      <h1 className="text-3xl mb-0"></h1>
      {/*<SceneWrapper />*/}
      {/*<WebGLScene />*/}
      <ThreeSceneWrapper />
    </main>

  )
}
