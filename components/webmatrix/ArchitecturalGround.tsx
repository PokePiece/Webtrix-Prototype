import { useMemo } from 'react';
import * as THREE from 'three';

export function ArchitecturalGround() {
  const gridTexture = useMemo(() => {
    const size = 512;
    const data = new Uint8Array(size * size * 3);
    for (let i = 0; i < size * size * 3; i++) data[i] = 255;

    const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(100, 100);
    texture.needsUpdate = true;
    return texture;
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial
        color="#cccccc"
        map={gridTexture}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}


//Inbound, call for fire, targets in the field!