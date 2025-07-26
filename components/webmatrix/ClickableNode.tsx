'use client';
import { useRef, useState } from 'react';
import { Mesh } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';

type Props = {
    position: [number, number, number];
    title?: string;
    onClick?: () => void;
};

export default function ClickableNode({ position, title, onClick }: Props) {
    const meshRef = useRef<Mesh>(null);
    const { camera } = useThree();
    const [hovered, setHovered] = useState(false);
    useCursor(hovered);

    useFrame(() => {
        // optional: face the camera, glow, animate, etc.
    });

    return (
        <mesh
            ref={meshRef}
            position={position}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={onClick}
        >
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color={hovered ? '#ffaa00' : '#00ffff'} />
        </mesh>
    );
}
