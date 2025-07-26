"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { fetchBuildingData } from "@/lib/fetchBuildings";
import { useThree } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { PerspectiveCamera } from "three";
import { gpsToXY } from "@/lib/geo";
import { Vector3 } from "three";
import Avatar from "./3DAvatar";
import Buildings from "./Buildings";
import NewBuildings from "./NewBuildings";
import NewestBuildings from "./NewestBuildings";
import OrbitCameraControls from "./OrbitCameraControls";
import ComplexBuildings from "./ComplexBuildings";
import RiftInstance from "./RiftInstance";
import TheRiftInstance from "./RiftInstance";


function TopDownCamera() {
    const { camera } = useThree();
    const target = new Vector3(0, 0, 0); // center of your map

    useFrame(() => {
        // Position the camera high above the center, looking downward
        camera.position.set(0, 1000, 0); // Y is height (meters)
        camera.lookAt(target);
        camera.up.set(0, 0, -1); // Set 'up' vector to the negative Z axis for proper orientation
        camera.updateProjectionMatrix();
    });

    return null;
}

function ObliqueCamera() {
    const { camera } = useThree();
    const target = new Vector3(0, 0, 0);

    useFrame(() => {
        // Position camera somewhat above and behind the avatar/map center, angled down
        camera.position.set(200, 200, 200); // Adjust these values for desired angle/distance
        camera.lookAt(target);
        camera.up.set(0, 1, 0); // Standard Y-up
        camera.updateProjectionMatrix();
    });

    return null;
}



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





    useEffect(() => {
        const [x, z] = gpsToXZ(40.765, -111.89); // Replace with your mock GPS
        setAvatarPos([x, 0, z]); // y=0 on ground
    }, []);



    useEffect(() => {
        fetchBuildingData().then((res) => {
            setBuildings(res.buildings)
        })
    }, [])



    /*
        useEffect(() => {
            fetchBuildingData().then((data) => {
                setBuildings(
                    data.buildings.map(b => ({
                        coords: b.coords,
                        height: b.height ?? 10 // or random / derived later
                    }))
                );
            });
        }, []);
    */


    return (
        <>
            <Canvas
                style={{ background: 'lightBlue' }}
                onCreated={({ scene }) => {
                    scene.background = new THREE.Color('#05021C'); // light sky blue

                }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 10]} />
                <OrbitCameraControls />
                <ComplexBuildings buildingData={buildings} onSelect={setSelectedBuilding} />


                <Avatar position={avatarPos} setAvatarPos={setAvatarPos} />

                {/* Ground plane */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                    <planeGeometry args={[1800, 1300]} />
                    <meshStandardMaterial color="darkgrey" />
                </mesh>
                <Html position={new THREE.Vector3(0, 20, 0).clone().setY(35)} center>
                                <a href='https://dilloncarey.com' target="_blank" rel="noopener noreferrer">
                                  🔗 Open Webspace
                                </a>
                              </Html>
                <RiftInstance
                    center={new THREE.Vector3(0, 20, 0)}
                    height={20}
                    offset={new THREE.Vector3(0, 20, 0)}
                />

            </Canvas>
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


//Replace buildings with this for full geometry
/*
  {buildings.map((footprint, i) => {
                const shape = new THREE.Shape();
                footprint.forEach(([lon, lat], idx) => {
                    const [x, y] = gpsToXY(lat, lon);
                    if (idx === 0) shape.moveTo(x, y);
                    else shape.lineTo(x, y);
                });

                const geometry = new THREE.ExtrudeGeometry(shape, { depth: 30, bevelEnabled: false });

                return (
                    <mesh
                        key={i}
                        geometry={geometry}
                        rotation-x={-Math.PI / 2} // rotate -90° around X axis
                    >
                        <meshStandardMaterial color="gray" />
                    </mesh>
                );
            })}



*/

//Or this for simplified
//<Buildings buildingData={buildings} />