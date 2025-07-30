// ComplexBuildings.tsx
import { useMemo, useState } from 'react'
import * as THREE from 'three'
import RiftInstance from '../portals/RiftInstance'
import { Html } from '@react-three/drei';

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

interface ComplexBuildingProps {
  buildingData: ComplexBuilding[]
  onSelect: (building: ComplexBuilding) => void
}

type ComplexBuilding = {
  id: number
  coords: [number, number][]
  height: number
  name?: string
  type?: string
  amenity?: string
  address?: string
  wikidata?: string
  wikipedia?: string
  website?: string
  webspace?: string
}

const matColorGenerator = () => {

  let materialColor;

  let randomNumber = Math.floor(Math.random() * 10)

  if (randomNumber < 3) materialColor = 'lightBlue'
  else if (randomNumber < 6) materialColor = 'blue'
  else if (randomNumber < 8) materialColor = 'cyan'
  else if (randomNumber < 10) materialColor = 'indigo'

  return materialColor

}

export default function ComplexBuildings({
  buildingData,
  onSelect,
}: ComplexBuildingProps & { onSelect: (data: any) => void }) {
  const buildings = useMemo(() => {
    return buildingData.map(({ coords, height, id, name, type, amenity, address, wikidata, wikipedia, website, webspace }, i) => {
      const shape = new THREE.Shape()
      coords.forEach(([lon, lat], idx) => {
        const [x, y] = gpsToXY(lat, lon)
        if (idx === 0) shape.moveTo(x, y)
        else shape.lineTo(x, y)
      })


      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: height,
        bevelEnabled: false,
      })
      geometry.rotateX(-Math.PI / 2)

      const center = new THREE.Vector3()
      geometry.computeBoundingBox()
      geometry.boundingBox?.getCenter(center)



      return (
        <group key={i}>
          <mesh
            geometry={geometry}
            onContextMenu={(e) => {
              e.stopPropagation();
              onSelect({ coords, height, id, name, type, amenity, address, wikidata, wikipedia, website, webspace });
            }}
          >

            <meshStandardMaterial color={matColorGenerator()} />
          </mesh>

          {webspace && (
            <group>
              <RiftInstance
                center={center}
                height={height}
                offset={new THREE.Vector3(0, 20, 0)}
              />
              <Html position={center.clone().setY(height + 17)} center>
                <a href={webspace} rel="noopener noreferrer">
                  ⚫ Enter Webspace
                </a>
              </Html>
            </group>
          )}
        </group>
      )

    })
  }, [buildingData, onSelect])

  return <>{buildings}</>
}









/*
export default function ComplexBuildings({ buildingData }: ComplexBuildingProps) {
  // Create an array of meshes (one mesh per building) using extruded geometry from footprint + height

  const buildings = useMemo(() => {
    return buildingData.map(({ coords, height }, i) => {
      const shape = new THREE.Shape()
      coords.forEach(([lon, lat], idx) => {
        const [x, y] = gpsToXY(lat, lon)
        if (idx === 0) shape.moveTo(x, y)
        else shape.lineTo(x, y)
      })

      // ExtrudeGeometry options: depth = height, bevel disabled for clean edges
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: height,
        bevelEnabled: false,
      })

      geometry.rotateX(-Math.PI / 2) // rotate footprint from XY plane to XZ plane

      return (
        <mesh key={i} geometry={geometry}>
          <meshStandardMaterial color="lightblue" />
        </mesh>
      )
    })
  }, [buildingData])

  return <>{buildings}</>
}
*/