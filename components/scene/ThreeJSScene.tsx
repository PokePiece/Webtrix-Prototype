"use client";

import { useCallback, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { fetchBuildingData } from "@/lib/fetchBuildings";
import { useRef } from "react";
import Link from "next/link";
import studio from '@theatre/studio'
import { getProject } from '@theatre/core'
import { editable } from '@theatre/r3f'
import { SheetProvider } from '@theatre/r3f'
import { CapsuleCollider, Physics, RigidBody } from "@react-three/rapier";
import WebtrixEntry from "../environment/text/WebtrixEntry";
import ComplexBuildings from "../environment/key/ComplexBuildings";
import Trees from "../environment/key/Trees";
import GrassForest from "../environment/key/Landuse";
import House from "../environment/key/House";
import Renevade from "../environment/text/Renevade";
import Computer from "../environment/key/Computer";
import BlackrockPortal from "../environment/portals/BlackrockPortal";
import CenterPortal from "../environment/portals/CenterPortal";
import ThirdPersonCamera from "./ThirdPersonCamera";
import SurrealAvatar from "./SurrealAvatar";
import FreeCam from "./FreeCam";
import RiftInstance from "../environment/portals/RiftInstance";
import ChatOverlay from "./ChatOverlay";
import Footways from "../environment/key/Footways";
import Avatar from "./3DAvatar";
import MainOverlay from "./MainOverlay";
import Houses from "../environment/key/Houses";
import Chair from "../environment/key/Chair";
import { placeableComponents, PlaceableType } from '@/lib/placeables'
import ModeIndicator from "../action/build/ModeIndicator";
import ModeIndicatorWrapper from "../action/build/ModeIndicator";
import ProjectileUpdater from "../action/contact/ProjectileUpdater";
import InventoryOverlay from "../action/perform/InventoryOverlay";
import { useInventoryStore } from "../action/perform/inventoryStore";
import { CuboidCollider } from '@react-three/rapier'
import { RapierRigidBody } from '@react-three/rapier'
import NewAvatar from "./experimental/NewAvatar";
import NewThirdPersonCamera from "./experimental/ThirdPersonCamera";
import CraftingOverlay from "../action/perform/CraftingOverlay";

if (typeof window !== 'undefined') studio.initialize()

const sheet = getProject('My Project').sheet('Scene')

function gpsToXZ(lat: number, lon: number): [number, number] {
    const R = 6371000;
    const originLat = 40.7660;
    const originLon = -111.8460;
    const dLat = (lat - originLat) * (Math.PI / 180);
    const dLon = (lon - originLon) * (Math.PI / 180);
    const x = dLon * R * Math.cos(originLat * Math.PI / 180);
    const z = dLat * R;
    return [x, z];
}

type ComplexBuilding = {
    id: number
    coords: [number, number][]
    height: number
    name?: string
    type?: string
    amenity?: string
    address?: string
    wikidata?: string
    wikipedia?: string
    website?: string
    webspace?: string
}

export default function ThreeScene() {
    const [buildings, setBuildings] = useState<ComplexBuilding[]>([])
    const [selectedBuilding, setSelectedBuilding] = useState<ComplexBuilding | null>(null)
    const [avatarPos, setAvatarPos] = useState<any>([25, 0, 12]);
    const [controlMode, setControlMode] = useState<'avatar' | 'freecam' | 'freehidden'>('avatar')
    const [isChatting, setIsChatting] = useState(false)
    const [chatActive, setChatActive] = useState(false)
    const [followingSurreal, setFollowingSurreal] = useState(false);
    const lastSurrealPos = useRef<[number, number, number]>([avatarPos[0] - 5, avatarPos[1], avatarPos[2] - 10])
    const [surrealPos, setSurrealPos] = useState<[number, number, number]>([10, 0, 10])
    const [avatarSpeech, setAvatarSpeech] = useState<string | null>(null);
    const [surrealSpeech, setSurrealSpeech] = useState<string | null>(null);
    const [freeCamPos, setFreeCamPos] = useState<THREE.Vector3>(new THREE.Vector3())
    const [mainOverlayActive, setMainOverlayActive] = useState<boolean>(false)
    const [placingType, setPlacingType] = useState<PlaceableType | null>(null)
    const [placedObjects, setPlacedObjects] = useState<Array<{
        id: string
        type: PlaceableType 
        position: [number, number, number]
    }>>([])
    const [deletionMode, setDeletionMode] = useState(false)
    const [isBuilding, setIsBuildings] = useState<boolean>(false)
    const [pvpMode, setPvpMode] = useState(false)
    const [projectiles, setProjectiles] = useState<Array<{
        id: string;
        position: [number, number, number];
        velocity: [number, number, number];
    }>>([]);
    const [camera, setCamera] = useState<THREE.Camera | null>(null);
    const [showInventory, setShowInventory] = useState<boolean>(false);
    const addItem = useInventoryStore(state => state.addItem)
    const removeItem = useInventoryStore(state => state.removeItem)
    const items = useInventoryStore(state => state.items) 
    const [showCrafting, setShowCrafting] = useState<boolean>(false);


    const capsuleRef = useRef<THREE.Mesh | null>(null)
    const avatarRef = useRef<THREE.Group | null>(null)

    function getItemIdByName(name: string) {
        const item = items.find(i => i.name.toLowerCase() === name.toLowerCase())
        return item ? item.id : null
    }

    useEffect(() => {
        if (followingSurreal) {
            lastSurrealPos.current = [avatarPos[0], avatarPos[1], avatarPos[2] - 5];
        }
    }, [avatarPos, followingSurreal]);


    const types: PlaceableType[] = ['Box', 'Chair']

    useEffect(() => {
        addItem('Box', 5)
        addItem('Chair', 5)
        addItem('Energy', 5)
        addItem('Metal', 5)
        addItem('Wood', 5)
    }, [])

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'x' && !isChatting) {
                setControlMode('avatar')
            } else if (e.key.toLowerCase() === 'f' && !isChatting) {
                setControlMode('freecam')
            } else if (e.key.toLowerCase() === 'z' && !isChatting) {
                e.preventDefault()
                console.log('setting control mode to freehidden')
                setControlMode('freehidden')
            } else if (e.key.toLowerCase() === 'c' && !isChatting) {
                if (!mainOverlayActive) {
                    setChatActive(prev => !prev)
                }
            } else if (e.key.toLowerCase() === 'q' && controlMode === 'freecam') {
                if (!isChatting) {
                    setAvatarPos([freeCamPos.x, 0, freeCamPos.z])
                    setControlMode('avatar')
                }
            } else if (e.key.toLowerCase() === 'e') {
                if (!chatActive && !isChatting) {
                    setMainOverlayActive(prev => !prev)
                }
            } else if (e.key.toLowerCase() === 'b') {
                setPlacingType(prev => (prev === 'Box' ? null : 'Box'))
                setIsBuildings(prev => !prev)
            } else if (e.key.toLowerCase() === 'n') {
                setPlacingType(prev => {
                    const i = types.indexOf(prev ?? 'Box')
                    return types[(i + 1) % types.length]
                })
            } else if (e.key.toLowerCase() === 'g' && !isChatting) {
                setDeletionMode(prev => !prev)
                setPlacingType(null) // disable placing while deleting
            } else if (e.key.toLowerCase() === 'r') {
                setPvpMode(prev => {
                    console.log('Toggling PvP mode:', !prev)
                    return !prev
                })
            } else if (e.key.toLowerCase() === 'i') {
                setShowInventory(prev => !prev)
            } else if (e.key.toLowerCase() === 'k') {
                setShowCrafting(prev => !prev)
            }
        }

        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [controlMode, isChatting, freeCamPos, chatActive, setAvatarPos, mainOverlayActive])

    /*
        useEffect(() => {
            const [x, z] = gpsToXZ(40.7660, -111.8460)
            setAvatarPos([x, 0, z]);
        }, []);
    */

    useEffect(() => {
        const disableContextMenu = (e: MouseEvent) => e.preventDefault();
        window.addEventListener('contextmenu', disableContextMenu);
        return () => window.removeEventListener('contextmenu', disableContextMenu);
    }, []);


    const shootProjectile = useCallback(() => {
        if (!camera) {
            console.log('No camera available to shoot projectile');
            return;
        }
        console.log('Shooting projectile from position:', avatarPos);

        const pos: [number, number, number] = [
            avatarPos[0],
            avatarPos[1] + 1, // raise projectile start height
            avatarPos[2],
        ];

        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);

        // Flatten direction to horizontal plane if desired
        dir.y = 0;
        dir.normalize();

        const speed = 50;
        const velocity: [number, number, number] = [
            dir.x * speed,
            dir.y * speed,
            dir.z * speed,
        ];

        setProjectiles(prev => [
            ...prev,
            { id: crypto.randomUUID(), position: pos, velocity },
        ]);
    }, [avatarPos, camera]);

    useEffect(() => {
        if (!pvpMode) return;

        const handleShoot = (e: MouseEvent) => {
            e.preventDefault();
            console.log('Click detected, shooting projectile');
            shootProjectile();
        };

        window.addEventListener('click', handleShoot);
        return () => window.removeEventListener('click', handleShoot);
    }, [pvpMode, shootProjectile]);

    type Coord = [number, number]
    interface Detail {
        id: number
        coords: Coord[]
        tags: { [key: string]: string }
        type: 'node' | 'way'
    }

    function handleHarvestResource(tree: Detail) {
        console.log('Harvesting wood from tree id:', tree.id);
        useInventoryStore.getState().addItem('Wood', 1);
    }


    useEffect(() => {
        fetchBuildingData().then((res) => {
            setBuildings(res.buildings)
        })
    }, [])



    function SurrealFollower() {
        useFrame(() => {
            if (!followingSurreal) return;

            const target: [number, number, number] = [
                avatarPos[0] + 1,
                avatarPos[1],
                avatarPos[2] - 1,
            ];
            const speed = 0.05;

            setSurrealPos(([x, y, z]) => [
                x + (target[0] - x) * speed,
                y + (target[1] - y) * speed,
                z + (target[2] - z) * speed,
            ]);
        });

        return null;
    }





    return (
        <>

            <Canvas
                style={{ background: 'lightBlue' }}
                onCreated={({ scene }) => {
                    scene.background = new THREE.Color('#05021C');
                }}
            >
                <Physics>
                    <SheetProvider sheet={sheet}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[10, 10, 10]} />

                        <WebtrixEntry />

                        <ComplexBuildings buildingData={buildings} onSelect={setSelectedBuilding} />
                        <Trees onSelect={handleHarvestResource} />
                        <Footways onSelect={() => { }} />
                        <GrassForest onSelect={() => { }} />
                        <House />
                        <Renevade />
                        <Computer />
                        <BlackrockPortal onTeleport={() => setAvatarPos([0, 0, 5])} />
                        <CenterPortal onTeleport={() => setAvatarPos([1180, 0, 1330])} />
                        <Houses />
                        <Chair />

                        {/*Plane Catcher*/}
                        <mesh
                            position={[0, 0, 0]}
                            rotation={[-Math.PI / 2, 0, 0]}
                            onClick={(e) => {
                                if (!placingType) return

                                // Check inventory quantity before placing
                                const itemId = getItemIdByName(placingType)
                                if (!itemId) {
                                    console.log(`No ${placingType} left in inventory!`)
                                    return
                                }

                                // Remove one item from inventory
                                removeItem(itemId, 1)

                                const point = e.point
                                setPlacedObjects(prev => [
                                    ...prev,
                                    {
                                        id: crypto.randomUUID(),
                                        type: placingType,
                                        position: [point.x, 0.5, point.z],
                                    },
                                ])
                            }}
                        >
                            <planeGeometry args={[100, 100]} />
                            <meshBasicMaterial transparent opacity={0} />
                        </mesh>

                        {placedObjects.map(obj => {
                            const Component = placeableComponents[obj.type]
                            return (
                                <group
                                    key={obj.id}
                                    onClick={(e) => {
                                        if (deletionMode) {
                                            e.stopPropagation()
                                            setPlacedObjects(prev => prev.filter(o => o.id !== obj.id))
                                            addItem(obj.type, 1) // refund 1 item of this type
                                        }
                                    }}
                                >
                                    <Component position={obj.position} />
                                </group>
                            )
                        })}

                        {projectiles.map(p => {
                            console.log(`Rendering projectile ${p.id} at`, p.position);
                            return (
                                <mesh key={p.id} position={p.position}>
                                    <sphereGeometry args={[0.1, 8, 8]} />
                                    <meshStandardMaterial color="yellow" />
                                </mesh>
                            );
                        })}

                        <ProjectileUpdater projectiles={projectiles} setProjectiles={setProjectiles} />


                        {(controlMode === 'freecam' || controlMode === 'freehidden') && (
                            <FreeCam
                                isOverlayOn={(chatActive || mainOverlayActive)}
                                setCamPos={setFreeCamPos} />
                        )}
                        
                            {(controlMode === 'avatar' || controlMode === 'freecam') && (
                                <>
                                    
                                {controlMode === 'avatar' && (
                                    <ThirdPersonCamera avatarRef={avatarRef} setCamera={setCamera} />
                                )}

                                    <editable.group theatreKey="AvatarRoot1">
                                        <Avatar
                                            ref={avatarRef}
                                            position={avatarPos}
                                            setAvatarPos={setAvatarPos}
                                            active={controlMode === 'avatar' && !isChatting}
                                            text={avatarSpeech}
                                            capsuleRef={capsuleRef}
                                        />
                                    </editable.group>
                                </>
                            )}
                        
                      
                       
                            <SurrealAvatar
                                position={surrealPos}
                                active={followingSurreal}
                                onClick={() => setFollowingSurreal(!followingSurreal)}
                                text={surrealSpeech}
                            />
                      
                  
                            <SurrealFollower />
                        {/* Ground plane */}


                        <RigidBody type="fixed" colliders={false} position={[0, 0, 0]}>
                            <CuboidCollider args={[2500, 0, 1750]} position={[0, 0, 0]} />
                            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                                <planeGeometry args={[5000, 3500]} />
                                <meshStandardMaterial color="#454f54" />
                            </mesh>
                        </RigidBody>



                        <Html position={new THREE.Vector3(10.5, 5.5, 15)}>
                            <a href='http://localhost:3001'>
                                <span className='text-white'>⚫ Enter Webspace</span>
                            </a>
                        </Html>
                        <RiftInstance
                            center={new THREE.Vector3(10, 5, 15)}
                            height={1}
                            offset={new THREE.Vector3(0, 4, 0)}
                        />


                        <Html position={new THREE.Vector3(14, 10, 51)}>
                            <Link href='/webmatrix'>
                                <span className='text-white'>⚫ Enter Webspace</span>
                            </Link>
                        </Html>
                        <RiftInstance
                            center={new THREE.Vector3(15, 20, 50)}
                            height={20}
                            offset={new THREE.Vector3(0, -10, 0)}
                        />
                    </SheetProvider>
                </Physics>
            </Canvas>
            {mainOverlayActive && (
                <MainOverlay
                    isChatting={isChatting}
                    setIsChatting={setIsChatting}
                    onUserMessage={(msg) => {
                        setAvatarSpeech(msg);
                        setTimeout(() => setAvatarSpeech(null), 3000);
                    }}
                    onAiMessage={(msg) => {
                        setSurrealSpeech(msg);
                        setTimeout(() => setSurrealSpeech(null), 3000);
                    }}
                />
            )}
            {showCrafting  && <CraftingOverlay />}
            {chatActive && (
                <ChatOverlay
                    isChatting={isChatting}
                    setIsChatting={setIsChatting}
                    onUserMessage={(msg) => {
                        setAvatarSpeech(msg);
                        setTimeout(() => setAvatarSpeech(null), 3000);
                    }}
                    onAiMessage={(msg) => {
                        setSurrealSpeech(msg);
                        setTimeout(() => setSurrealSpeech(null), 3000);
                    }}
                />
            )}
            {showInventory && (
                <InventoryOverlay />
            )}
            <ModeIndicatorWrapper
                isBuilding={isBuilding}
                placingType={placingType}
                deletionMode={deletionMode}
            />



            {selectedBuilding && (
                <div className="absolute top-4 left-4 bg-white text-black p-4 rounded shadow z-50">
                    <p><strong>Name:</strong> {selectedBuilding.name ?? "—"}</p>
                    <p><strong>Height:</strong> {selectedBuilding.height ?? "—"}m</p>
                    <p><strong>ID:</strong> {selectedBuilding.id ?? "—"}</p>
                    <p><strong>Type:</strong> {selectedBuilding.type ?? "—"}</p>
                    <p><strong>Amenity:</strong> {selectedBuilding.amenity ?? "—"}</p>
                    <p><strong>Address:</strong> {selectedBuilding.address ?? "—"}</p>
                    <p><strong>Wikipedia:</strong> {selectedBuilding.wikipedia ?? "—"}</p>
                    <p><strong>Wikidata:</strong> {selectedBuilding.wikidata ?? "—"}</p>
                    <p><strong>Website:</strong> {selectedBuilding.website ?? "—"}</p>
                    <p>
                        <strong>Webspace:</strong>{" "}
                        {selectedBuilding.webspace ? (
                            <a
                                href={selectedBuilding.webspace}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                {selectedBuilding.webspace}
                            </a>
                        ) : (
                            "—"
                        )}
                    </p>

                    <button
                        className="mt-2 bg-gray-200 px-2 py-1 rounded"
                        onClick={() => setSelectedBuilding(null)}
                    >
                        Close
                    </button>
                </div>
            )}
        </>
    );
}

