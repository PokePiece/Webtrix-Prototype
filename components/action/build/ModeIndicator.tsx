import { PlaceableType } from "@/lib/placeables";
import React, { useEffect, useRef, useState } from "react";

const types: PlaceableType[] = ['box', 'chair']

function ModeIndicator({ placingType, deletionMode }: { placingType: PlaceableType | null; deletionMode: boolean }) {
  let text = 'Mode: None'
  if (deletionMode) text = 'Mode: Deleting (Click objects to remove)'
  else if (placingType) text = `Mode: Placing ${placingType}`

  return (
    <div
      style={{
        position: 'fixed',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '6px 12px',
        borderRadius: 4,
        fontSize: 14,
        fontFamily: 'monospace',
        userSelect: 'none',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      {text}
    </div>
  )
}

export default function ModeIndicatorWrapper({ isBuilding, placingType, deletionMode }:{isBuilding:any, placingType:any, deletionMode:any}) {
  const [visible, setVisible] = useState(false)
  const prevIsBuilding = useRef(isBuilding)

  useEffect(() => {
    if (isBuilding || prevIsBuilding.current !== isBuilding) {
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 1500)
      prevIsBuilding.current = isBuilding
      return () => clearTimeout(timer)
    }
  }, [isBuilding, placingType, deletionMode])

  if (!visible) return null

  return <ModeIndicator placingType={placingType} deletionMode={deletionMode} />
}
