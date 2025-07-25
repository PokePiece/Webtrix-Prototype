"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
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




export default function WebGLScene() {
    const [buildings, setBuildings] = useState<[number, number][][]>([]);
    const [avatarPos, setAvatarPos] = useState<any>([0, 0, 0]);


  

  
    useEffect(() => {
        const [x, z] = gpsToXZ(40.765, -111.89); // Replace with your mock GPS
        setAvatarPos([x, 0, z]); // y=0 on ground
    }, []);


    useEffect(() => {
        fetchBuildingData().then((data) => {
            setBuildings(data.buildings.map(b => b.coords));
        });
    }, []);

    return (
        <Canvas>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} />
            <ObliqueCamera />

            <Buildings buildingData={buildings} />

            <Avatar position={avatarPos} setAvatarPos={setAvatarPos} />
        </Canvas>
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