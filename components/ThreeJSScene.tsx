"use client";

import { useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { fetchBuildingData } from "@/lib/fetchBuildings";
import { useRef } from "react";
import Avatar from "./3DAvatar";
import ComplexBuildings from "./ComplexBuildings";
import RiftInstance from "./RiftInstance";
import Link from "next/link";
import ThirdPersonCamera from "./ThirdPersonCamera";
import FreeCam from "./FreeCam";
import studio from '@theatre/studio'
import { getProject } from '@theatre/core'
import { editable } from '@theatre/r3f'
import { SheetProvider } from '@theatre/r3f'
import SurAvatar from "./SurAvatar";
import ChatOverlay from "./ChatOverlay";


// only run once
if (typeof window !== 'undefined') studio.initialize()

const sheet = getProject('My Project').sheet('Scene')



function gpsToXZ(lat: number, lon: number): [number, number] {
    const R = 6371000; // Earth radius meters
    const originLat = 40.765;
    const originLon = -111.89;
    const dLat = (lat - originLat) * (Math.PI / 180);
    const dLon = (lon - originLon) * (Math.PI / 180);
    const x = dLon * R * Math.cos(originLat * Math.PI / 180);
    const z = dLat * R;
    return [x, z];
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






export default function ThreeScene() {
    const [buildings, setBuildings] = useState<ComplexBuilding[]>([])
    const [selectedBuilding, setSelectedBuilding] = useState<ComplexBuilding | null>(null)
    const [avatarPos, setAvatarPos] = useState<any>([0, 0, 0]);
    const avatarRef = useRef<THREE.Group | null>(null)
    const [controlMode, setControlMode] = useState<'avatar' | 'freecam' | 'freehidden'>('avatar')
    const [isChatting, setIsChatting] = useState(false)
    const [chatActive, setChatActive] = useState(false)
    const [followingSur, setFollowingSur] = useState(false);
    const lastSurPos = useRef<[number, number, number]>([avatarPos[0] - 5, avatarPos[1], avatarPos[2] - 10])
    const [surPos, setSurPos] = useState<[number, number, number]>([0, 0, -10])


    if (followingSur) {
        lastSurPos.current = [avatarPos[0], avatarPos[1], avatarPos[2] - 5]
    }

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'x') {
                setControlMode('avatar')
            } else if (e.key === 'Escape') {
                setControlMode('freecam')
            } else if (e.key === 'Tab') {
                e.preventDefault()
                setControlMode('freehidden')
            } else if (e.key === 'c' && !isChatting) {
                setChatActive(prev => !prev)
            }
        }

        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [isChatting])





    useEffect(() => {
        const [x, z] = gpsToXZ(40.765, -111.89); // Replace with your mock GPS
        setAvatarPos([x, 0, z]); // y=0 on ground
    }, []);



    useEffect(() => {
        fetchBuildingData().then((res) => {
            setBuildings(res.buildings)
        })
    }, [])


    function SurFollower() {
        useFrame(() => {
            if (!followingSur) return;

            const target: [number, number, number] = [
                avatarPos[0] + 10,
                avatarPos[1],
                avatarPos[2] - 10,
            ];
            const speed = 0.05;

            setSurPos(([x, y, z]) => [
                x + (target[0] - x) * speed,
                y + (target[1] - y) * speed,
                z + (target[2] - z) * speed,
            ]);
        });

        return null;
    }


    return (



        <>

            <Canvas
                style={{ background: 'lightBlue' }}
                onCreated={({ scene }) => {
                    scene.background = new THREE.Color('#05021C'); // light sky blue

                }}
            >
                <SheetProvider sheet={sheet}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 10]} />


                    <ComplexBuildings buildingData={buildings} onSelect={setSelectedBuilding} />

                    {(controlMode === 'freecam' || controlMode === 'freehidden') && <FreeCam />}

                    {(controlMode === 'avatar' || controlMode === 'freecam') && (
                        <>
                            {controlMode === 'avatar' && <ThirdPersonCamera avatarRef={avatarRef} />}
                            <editable.group theatreKey="AvatarRoot1">
                                <Avatar
                                    ref={avatarRef}
                                    position={avatarPos}
                                    setAvatarPos={setAvatarPos}
                                    active={controlMode === 'avatar' && !isChatting}
                                />
                            </editable.group>
                        </>
                    )}
                    <SurAvatar
                        position={surPos}
                        active={followingSur}
                        onClick={() => setFollowingSur(!followingSur)}
                    />
                    <SurFollower />
                    {/* Ground plane */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                        <planeGeometry args={[1800, 1300]} />
                        <meshStandardMaterial color="darkgrey" />
                    </mesh>

                    <Html position={new THREE.Vector3(15, 20, 50).clone().setY(35)} center>
                        <Link href='/webmatrix'>
                            🔗 Open Webspace
                        </Link>
                    </Html>
                    <RiftInstance
                        center={new THREE.Vector3(15, 20, 50)}
                        height={20}
                        offset={new THREE.Vector3(0, 20, 0)}
                    />
                </SheetProvider>
            </Canvas>
            {chatActive && (
                <ChatOverlay isChatting={isChatting} setIsChatting={setIsChatting} />
            )}


            {selectedBuilding && (
                <div className="absolute top-4 left-4 bg-white text-black p-4 rounded shadow z-50">
                    <p><strong>Name:</strong> {selectedBuilding.name ?? "—"}</p>
                    <p><strong>Height:</strong> {selectedBuilding.height ?? "—"}m</p>
                    <p><strong>ID:</strong> {selectedBuilding.id ?? "—"}</p>
                    <p><strong>Type:</strong> {selectedBuilding.type ?? "—"}</p>
                    <p><strong>Amenity:</strong> {selectedBuilding.amenity ?? "—"}</p>
                    <p><strong>Address:</strong> {selectedBuilding.address ?? "—"}</p>
                    <p><strong>Wikipedia:</strong> {selectedBuilding.wikipedia ?? "—"}</p>
                    <p><strong>Wikidata:</strong> {selectedBuilding.wikidata ?? "—"}</p>
                    <p>
                        <strong>Webspace:</strong>{" "}
                        {selectedBuilding.webspace ? (
                            <a
                                href={selectedBuilding.webspace}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                {selectedBuilding.webspace}
                            </a>
                        ) : (
                            "—"
                        )}
                    </p>

                    <button
                        className="mt-2 bg-gray-200 px-2 py-1 rounded"
                        onClick={() => setSelectedBuilding(null)}
                    >
                        Close
                    </button>
                </div>
            )}




        </>
    );
}

