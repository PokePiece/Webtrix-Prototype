"use client"

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useState } from 'react'
import Avatar from '@/components/Avatar'
import CameraFollow from '@/components/CameraFollow'
import CameraWithOrbit from '@/components/CameraWithOrbit'
import SceneWrapper from '@/components/CanvasWrapper'


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
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
      <h1 className="text-3xl font-bold mb-6">Webtrix Stylized Map Demo</h1>
      <SceneWrapper />
      
    </main>

  )
}
