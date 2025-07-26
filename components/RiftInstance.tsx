import { useMemo } from 'react';
import * as THREE from 'three';

type RiftProps = {
  center: THREE.Vector3;
  height: number;
  offset?: THREE.Vector3; // optional offset, e.g., to move in front or above
};

export default function RiftInstance({ center, height, offset }: RiftProps) {
    const geometry = useMemo(
        () => new THREE.TorusGeometry(height * 0.25, 0.6, 16, 64),
        [height]
    );


    const material = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color: '#9B59B6',
                emissive: '#8E44AD',
                emissiveIntensity: 1.2,
                roughness: 0.4,
                metalness: 0.7,
            }),
        []
    );

    const position = useMemo(() => {
    const adjusted = center.clone().add(offset ?? new THREE.Vector3());
    return adjusted.setY(height + (offset?.y ?? 0)); // raise if offset.y is set
  }, [center, height, offset]);
    

    return <mesh geometry={geometry} material={material} position={position} />;
}
