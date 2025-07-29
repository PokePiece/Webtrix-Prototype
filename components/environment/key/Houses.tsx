import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import GoodHouse from './GoodHouse'

export default function Houses() {

    return (
        <>
            <GoodHouse
                position={[17, 0, 12]}
                rotation={[0, 3.9, 0]}
                scale={[1, 1, 1]}
                baseColor='lavender'
                roofColor='black'
                doorColor='brown'
            />
            <GoodHouse
                position={[20, 0, 5]}
                rotation={[0, 4.6, 0]}
                scale={[1, 1, 1]}
                baseColor='#A07C33'
                roofColor='tan'
                doorColor='brown'
            />
        </>
    )
}
