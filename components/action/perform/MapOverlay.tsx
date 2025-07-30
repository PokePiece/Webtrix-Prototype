import React, { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const INITIAL_POSITION: [number, number] = [40.7660, -111.8460]
const INITIAL_ZOOM = 14.5

function SetViewOnLoad({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap()
    useEffect(() => {
        map.setView(center, zoom)
    }, [map, center, zoom])
    return null
}

export default function MapOverlay() {
    return (
        <div
            className="
        fixed top-1/2 left-1/2 
        w-[85vh] h-[85vh] 
        -translate-x-1/2 -translate-y-1/2 
        rounded-lg shadow-lg overflow-hidden z-50
      "
        >
            <MapContainer style={{ height: '100%', width: '100%' }}>
                <SetViewOnLoad center={INITIAL_POSITION} zoom={INITIAL_ZOOM} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </MapContainer>
        </div>
    )
}

