import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'



export default function FreeCam() {
    const { camera, gl, scene } = useThree()
    const velocity = useRef(new THREE.Vector3())
    const direction = useRef(new THREE.Vector3())
    const keys = useRef<Record<string, boolean>>({})
    const pitch = useRef(0)
    const yaw = useRef(0)
    const isPointerLocked = useRef(false)

    const raycaster = useRef(new THREE.Raycaster())
    const pointer = new THREE.Vector2(0, 0) // center of screen


    const sensitivity = 0.002
    const acceleration = 2500
    const friction = 10

    useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Control') {
            document.exitPointerLock();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
}, []);


    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            keys.current[e.key.toLowerCase()] = true
        }
        const handleKeyUp = (e: KeyboardEvent) => {
            keys.current[e.key.toLowerCase()] = false
        }
        const handleMouseMove = (e: MouseEvent) => {
            if (!isPointerLocked.current) return
            yaw.current -= e.movementX * sensitivity
            pitch.current -= e.movementY * sensitivity
            pitch.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch.current))
        }
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Allow UI elements to handle their own clicks
            if (target.closest('a, button, [data-ui]')) return;

            if (!isPointerLocked.current) {
                gl.domElement.requestPointerLock();
                return;
            }

            // Ensure pointer is centered for accurate raycasting
            pointer.set(0, 0); // center of screen in NDC (-1 to 1)

            // Setup ray from camera through pointer
            raycaster.current.setFromCamera(pointer, camera);

            // Raycast against scene objects
            const intersects = raycaster.current.intersectObjects(scene.children, true);

            if (intersects.length > 0) {
                const hit = intersects[0].object;
                console.log('Clicked object:', hit.name || hit);
                // Add custom interaction logic here
            }
        };



        const handlePointerLockChange = () => {
            isPointerLocked.current = document.pointerLockElement === gl.domElement
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('click', handleClick)
        document.addEventListener('pointerlockchange', handlePointerLockChange)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('click', handleClick)
            document.removeEventListener('pointerlockchange', handlePointerLockChange)
        }
    }, [gl.domElement])

    useFrame((_, delta) => {
        // Orientation
        camera.rotation.order = 'YXZ'
        camera.rotation.y = yaw.current
        camera.rotation.x = pitch.current
        camera.rotation.z = 0

        // Movement direction
        direction.current.set(0, 0, 0)
        if (keys.current['w']) direction.current.z -= 1
        if (keys.current['s']) direction.current.z += 1
        if (keys.current['a']) direction.current.x -= 1
        if (keys.current['d']) direction.current.x += 1
        if (keys.current[' ']) direction.current.y += 1
        if (keys.current['shift']) direction.current.y -= 1

        if (direction.current.lengthSq() > 0) direction.current.normalize()

        // Convert direction to world space
        const worldDirection = direction.current.clone()
            .applyEuler(camera.rotation)
            .multiplyScalar(acceleration * delta)

        // Apply velocity
        velocity.current.add(worldDirection)

        // Apply friction
        velocity.current.multiplyScalar(1 - Math.min(friction * delta, 1))

        // Move camera
        camera.position.add(velocity.current.clone().multiplyScalar(delta))
    })

    return null
}
