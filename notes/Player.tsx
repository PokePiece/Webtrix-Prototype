import { useRef, useEffect } from "react";
import { socket } from "@/lib/multiplayer";

export default function Player({ id }:{id:any}) {
  const ref = useRef(null);

  useEffect(() => {
    const pos = ref.current?.position.toArray() || [0, 0, 0];
    socket.emit("join", { id, position: pos });

    const interval = setInterval(() => {
      const pos = ref.current?.position.toArray();
      socket.emit("move", { id, position: pos });
    }, 50);

    return () => clearInterval(interval);
  }, [id]);

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}
