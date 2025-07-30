import { useFrame } from "@react-three/fiber";

function isOutOfBounds(position: [number, number, number]): boolean {
    const [x, y, z] = position;
    const distanceSquared = x * x + y * y + z * z;
    return distanceSquared > 50 * 50; // radius 100 meters
}

export default function ProjectileUpdater({ projectiles, setProjectiles }: { projectiles: any, setProjectiles: any }) {
    useFrame((state, delta) => {
        setProjectiles((prev: { id: string; position: [number, number, number]; velocity: [number, number, number] }[]) =>
            prev
                .map(p => {
                    const newPosition: [number, number, number] = [
                        p.position[0] + p.velocity[0] * delta,
                        p.position[1] + p.velocity[1] * delta,
                        p.position[2] + p.velocity[2] * delta,
                    ];
                    console.log(`Projectile ${p.id} position:`, newPosition);
                    return {
                        ...p,
                        position: newPosition,
                    };
                })
                .filter(p => !isOutOfBounds(p.position))
                
        );
    });

    return null;
}
