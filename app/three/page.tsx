'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { ARWorld } from '@/ThreeJSGo/src/arthree.js';
import { ARMapzenGeography } from '../../ThreeJSGo/src/ARMapzenGeography.js';
import * as THREE from 'three';


function ARSceneContent() {
    const { camera, scene } = useThree();

    useEffect(() => {
        // clone camera to avoid modifying a frozen object
        const cameraClone = Object.assign(Object.create(Object.getPrototypeOf(camera)), camera);

        const world = new ARWorld({ camera: cameraClone });

        const geo = new ARMapzenGeography({
            lat: 40.7608,
            lng: -111.8910,
            layers: ['buildings', 'roads', 'water', 'landuse'],
            styles: {
                buildings: { color: '#aaa' },
                roads: { color: '#444' },
            },
        });

        world.add(geo);
        scene.add(world);

        return () => {
            scene.remove(world);
        };
    }, [camera, scene]);


    return null;
}




function Cube() {
  const { scene } = useThree();

  useEffect(() => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);

    return () => {
      scene.remove(cube);
      geometry.dispose();
      material.dispose();
    };
  }, [scene]);

  return null;
}

export default function ARScene() {
  return (
    <Canvas>
      <Cube />
    </Canvas>
  );
}

