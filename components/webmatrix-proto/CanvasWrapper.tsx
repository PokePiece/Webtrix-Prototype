'use client';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import ClickableNode from './ClickableNode';

export default function CanvasWrapper() {
    return (
        <Canvas
            camera={{ position: [5, 5, 5], fov: 75 }}
            style={{ width: '100%', height: '100%' }}
        >
            <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 10, 7.5]} intensity={1} />

                <fog attach="fog" args={['#111111', 10, 100]} />
                <color attach="background" args={['#111111']} />

                <mesh>
                    <boxGeometry />
                    <meshStandardMaterial color="#0077ff" />
                </mesh>

                <OrbitControls
                    enablePan={false}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2.1}
                />
            </Suspense>
            <ClickableNode
                position={[3, 0.3, 0]}
                title="What is Webtrix?"
                onClick={() => console.log('Clicked Webtrix node')}
            />
            <Html
                position={[0, 2.5, 0]}
                center
                transform
                occlude
                distanceFactor={5}
                zIndexRange={[10, 0]}
            >
                <div className="bg-black text-white border border-gray-300 p-6 rounded-xl shadow-lg text-center w-80">
                    <h3 className="text-xl mb-3">From Heaven Brought Down</h3>
                    <p>
                        The Webmatrix connects the world. Envision a future where you don't think; you go.
                    </p>
                </div>
            </Html>

        </Canvas>
    );
}
