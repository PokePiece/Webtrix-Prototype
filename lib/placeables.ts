// lib/placeables.ts
import BoxComponent from "@/components/action/build/BoxComponent"

export type PlaceableType = 'Box' | 'Chair'

import Chair from "@/components/action/build/Chair"

export const placeableComponents: Record<PlaceableType, React.FC<{ position: [number, number, number] }>> = {
  Box: BoxComponent,
  Chair: Chair
}
