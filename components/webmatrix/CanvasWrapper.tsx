'use client';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import ClickableNode from './ClickableNode';
import RiftInstance from '../environment/portals/RiftInstance';
import * as THREE from "three";
import Link from 'next/link';
import { Sky } from '@react-three/drei';
import BasicMovement from '@/components/webmatrix/BasicMovement'
import Avatar from '@/components/webmatrix/Avatar'


export default function CanvasWrapper() {

    const [avatarPos, setAvatarPos] = useState<[number, number, number]>([0, 0, 0]);
    const [controlMode, setControlMode] = useState<'avatar' | 'free' | 'freehidden'>('avatar');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setControlMode('free');
            if (e.key.toLowerCase() === 'x') setControlMode('avatar');
            if (e.key === 'Tab') setControlMode('freehidden')
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);


    return (
        <Canvas
            //Default pos 5, 5, 5 fov 75
            camera={{ position: [0, 3, 10], fov: 75 }}
            style={{ width: '100%', height: '100%' }}
        >
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[500, 500]} />
                <meshStandardMaterial color="#aaa" />
            </mesh>

            {(controlMode === 'free' || controlMode === 'freehidden') && <BasicMovement />}
            {(controlMode === 'free' || controlMode === 'avatar') && (
                <Avatar
                    position={avatarPos}
                    setAvatarPos={setAvatarPos}
                    active={controlMode === 'avatar'}
                />
            )}

            <mesh position={[0, 2.5, -10]} castShadow>
                <boxGeometry args={[10, 5, 1]} />
                <meshStandardMaterial color="#999" />
            </mesh>

            <Sky
                distance={450000}
                sunPosition={[0, 1, 0]}
                inclination={0}       // Horizon-centered light
                azimuth={0.25}
                mieCoefficient={0.005}
                mieDirectionalG={0.8}
                rayleigh={0.5}
                turbidity={2}
            />

            <color attach="background" args={["#144d86"]} />
            <fog attach="fog" args={["#134d86", 10, 200]} />

            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 20, 5]} intensity={0.8} castShadow />



            <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 10, 7.5]} intensity={1} />



                <mesh position={new THREE.Vector3(0, 1, 0)}>
                    <boxGeometry />
                    <meshStandardMaterial color="#0077ff" />
                </mesh>



            </Suspense>
            <ClickableNode
                position={[3, 0.3, 0]}
                title="What is Webtrix?"
                onClick={() => console.log('Clicked Webtrix node')}
            />
            <RiftInstance
                center={new THREE.Vector3(0, 1, 0)}
                height={3}
                offset={new THREE.Vector3(-10, 1, 0)}
                rotation={[0, 1, 0]}
            />
            <Html position={new THREE.Vector3(-10, 0, 0).clone().setY(4)} center>
                <Link href='/'>
                    <span className='text-white'>🔗 Exit Webspace</span>
                </Link>
            </Html>
            <Html
                position={[0, 3.5, 0]}
                center
                transform
                occlude
                distanceFactor={5}
                zIndexRange={[10, 0]}
            >

                <div className="bg-black text-white border border-gray-300 p-6 rounded-xl shadow-lg text-center w-80">
                    <a href='http://localhost:3001'><h3 className="text-xl mb-3 hover:scale-95 active:scale-90 transition-transform duration-100">From Heaven Brought Down</h3></a>
                    <p>
                        The Webmatrix connects the world. Envision a future where you don't think; you go.
                    </p>
                </div>

            </Html>

        </Canvas>
    );
}
