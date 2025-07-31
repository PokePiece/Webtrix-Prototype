const [others, setOthers] = useState({});

useEffect(() => {
  socket.on("init-players", setOthers);
  socket.on("player-joined", ({ id, position }) =>
    setOthers((p) => ({ ...p, [id]: { position } }))
  );
  socket.on("player-moved", ({ id, position }) =>
    setOthers((p) => ({ ...p, [id]: { position } }))
  );
  socket.on("player-left", ({ id }) =>
    setOthers((p) => {
      const copy = { ...p };
      delete copy[id];
      return copy;
    })
  );
}, []);

return (
  <>
    {Object.entries(others).map(([id, { position }]) => (
      <mesh key={id} position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    ))}
    <Player id={tempUserId} />
  </>
);
