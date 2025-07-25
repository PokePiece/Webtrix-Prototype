import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Avatar({
  position,
  setAvatarPos
}: {
  position: [number, number, number];
  setAvatarPos: (pos: [number, number, number]) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const keys = useRef({ w: false, a: false, s: false, d: false });
  const meshRef = useRef<THREE.Mesh>(null);
  const previousPosition = useRef<string>("");

  /*
  useFrame(() => {
    if (!ref.current) return;

    let [x, y, z] = position;
    const speed = 2;

    if (keys.current.w) z -= speed;
    if (keys.current.s) z += speed;
    if (keys.current.a) x -= speed;
    if (keys.current.d) x += speed;

    const newPos: [number, number, number] = [x, y, z];

    // Update visual position
    ref.current.position.set(...newPos);

    // Update state
    setAvatarPos(newPos);
  });
*/

  /*
  useEffect(() => {
    const posRef = { current: [...position] as [number, number, number] };
    const interval = setInterval(() => {
      posRef.current[0] += 0.05;
      posRef.current[2] += 0.05;
      setAvatarPos([...posRef.current]);
    }, 16);
    return () => clearInterval(interval);
  }, [setAvatarPos]);
  */
  // Consider changing it so updates only when movement is detected


  useEffect(() => {
    const interval = setInterval(() => {
      if (!ref.current) return;

      const [prevX, prevY, prevZ] = ref.current.position.toArray();
      let x = prevX;
      let y = prevY;
      let z = prevZ;

      const speed = 5;

      let moved = false;
      if (keys.current.w) { z -= speed; moved = true; }
      if (keys.current.s) { z += speed; moved = true; }
      if (keys.current.a) { x -= speed; moved = true; }
      if (keys.current.d) { x += speed; moved = true; }

      if (moved) {
        const newPos: [number, number, number] = [x, y, z];
        ref.current.position.set(...newPos);
        setAvatarPos(newPos);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [position[0], position[1], position[2]]);



  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keys.current) keys.current[key as keyof typeof keys.current] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keys.current) keys.current[key as keyof typeof keys.current] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <group ref={ref} scale={[10, 10, 10]}>
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



//Basic person
/*

<group ref={ref} scale={[10, 10, 10]}>
      <mesh position={[0, 1, 0]}>
        <capsuleGeometry args={[0.5, 1.5, 4, 8]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <mesh position={[0, 2.3, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </group>


*/


//Red sphere avatar

/*
    <mesh ref={ref} scale={[10, 10, 10]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="red" />
    </mesh>
*/