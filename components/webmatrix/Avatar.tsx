import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function Avatar({
    position,
    setAvatarPos,
    active, // new prop
}: {
    position: [number, number, number];
    setAvatarPos: (pos: [number, number, number]) => void;
    active: boolean; // or use a string like 'avatar' | 'free'
}) {
    const avatarRef = useRef<THREE.Group>(null);
    const keys = useRef({ w: false, a: false, s: false, d: false });
    const { camera } = useThree();

    const isDragging = useRef(false);
    const mousePos = useRef({ x: 0, y: 0 });
    const yaw = useRef(0);
    const pitch = useRef(0);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!active) return;
            const key = e.key.toLowerCase();
            if (key in keys.current) keys.current[key as keyof typeof keys.current] = true;
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (!active) return;
            const key = e.key.toLowerCase();
            if (key in keys.current) keys.current[key as keyof typeof keys.current] = false;
        };

        const handleMouseDown = (e: MouseEvent) => {
            if (!active) return;
            isDragging.current = true;
            mousePos.current = { x: e.clientX, y: e.clientY };
        };
        const handleMouseUp = () => {
            if (!active) return;
            isDragging.current = false;
        };
        const handleMouseMove = (e: MouseEvent) => {
            if (!active) return;
            if (!isDragging.current) return;
            const dx = e.clientX - mousePos.current.x;
            const dy = e.clientY - mousePos.current.y;
            mousePos.current = { x: e.clientX, y: e.clientY };
            yaw.current -= dx * 0.002;
            pitch.current -= dy * 0.002;
            pitch.current = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, pitch.current)); // clamp
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useFrame(() => {
        if (!avatarRef.current || !active) return;
        if (!avatarRef.current) return;

        const avatar = avatarRef.current;
        const speed = 0.1;
        const direction = new THREE.Vector3();

        const frontVector = new THREE.Vector3(
            0,
            0,
            (keys.current.s ? 1 : 0) - (keys.current.w ? 1 : 0)
        );
        const sideVector = new THREE.Vector3(
            (keys.current.d ? 1 : 0) - (keys.current.a ? 1 : 0),
            0,
            0
        );

        const moveEuler = new THREE.Euler(0, yaw.current, 0, 'YXZ');
        direction
            .addVectors(frontVector, sideVector)
            .normalize()
            .applyEuler(moveEuler)
            .multiplyScalar(speed);

        avatar.position.add(direction);
        setAvatarPos([avatar.position.x, avatar.position.y, avatar.position.z]);

        // Third-person camera logic with yaw/pitch
        const offset = new THREE.Vector3(0, 3, 7);
        const rot = new THREE.Euler(pitch.current, yaw.current, 0, 'YXZ');
        offset.applyEuler(rot);
        offset.y += 3; // elevate above avatar

        const cameraTarget = avatar.position.clone();
        const cameraPosition = cameraTarget.clone().add(offset);

        camera.position.lerp(cameraPosition, 0.1);
        camera.lookAt(cameraTarget);
    });

    return (
        <group ref={avatarRef} position={position} scale={[1, 1, 1]}>
            <mesh position={[0, 1, 0]}>
                <capsuleGeometry args={[0.5, 1.5, 4, 8]} />
                <meshStandardMaterial color="orange" />
            </mesh>
            <mesh position={[0, 2.3, 0]}>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshStandardMaterial color="orange" />
            </mesh>
        </group>
    );
}
