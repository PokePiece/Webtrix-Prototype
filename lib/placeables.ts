// lib/placeables.ts
import BoxComponent from "@/components/action/build/BoxComponent"

export type PlaceableType = 'box' | 'chair'

import Chair from "@/components/action/build/Chair"

export const placeableComponents: Record<PlaceableType, React.FC<{ position: [number, number, number] }>> = {
  box: BoxComponent,
  chair: Chair
}
