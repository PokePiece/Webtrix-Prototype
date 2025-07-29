import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function Computer() {
  const compRef = useRef<THREE.Group>(null)
  //const screenTexture = useTexture('/google.png') // replace with your image path

  /*
  useFrame(() => {
    if (compRef.current) {
      compRef.current.rotation.y += 0.001
    }
  })
    */

  return (
    <group ref={compRef} position={[10, 0, 8]}>
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[2, 1.5, 0.2]} />
        <meshStandardMaterial color="black" />
      </mesh>

      <mesh position={[0, 2, 0.11]}>
        <planeGeometry args={[1.6, 1.2]} />
        <meshStandardMaterial color="#00ffcc" />
      </mesh>

      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.2, 0.3, 0.2]} />
        <meshStandardMaterial color="gray" />
      </mesh>

      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color="gray" />
      </mesh>

      <mesh position={[0, 0.5, 1]}>
        <boxGeometry args={[2, 0.1, 1]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    </group>
  )
}



/*
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Computer() {
  const compRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (compRef.current) {
      compRef.current.rotation.y += 0.001
    }
  })

  return (
    <group ref={compRef} position={[0, 0, 0]}>
    
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[2, 1.5, 0.2]} />
        <meshStandardMaterial color="black" />
      </mesh>

   
      <mesh position={[0, 2, 0.11]}>
        <planeGeometry args={[1.6, 1.2]} />
        <meshStandardMaterial color="#00ffcc" />
      </mesh>

     
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="gray" />
      </mesh>

      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color="gray" />
      </mesh>

 
      <mesh position={[0, 0.5, 1]}>
        <boxGeometry args={[2, 0.1, 1]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    </group>
  )
}


<mesh position={[0, 2, 0.11]}>
        <planeGeometry args={[1.6, 1.2]} />
        <meshBasicMaterial map={screenTexture} toneMapped={false} />
      </mesh>


*/

