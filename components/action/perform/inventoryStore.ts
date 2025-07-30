// stores/inventoryStore.ts
/*
import { create } from "zustand"
import { persist } from "zustand/middleware"

export type InventoryItem = {
  id: string
  name: string
  count: number
}

type InventoryState = {
  items: InventoryItem[]
  addItem: (name: string, count?: number) => void
  removeItem: (id: string, count?: number) => void
  setItemCount: (id: string, count: number) => void
  clearInventory: () => void
  getItemCount: (name: string) => number
  removeItems: (requirements: { item: string; count: number }[]) => void
  addItems: (item: string, count: number) => void
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (name, count = 1) => {
        const items = [...get().items]
        const idx = items.findIndex(i => i.name === name)
        if (idx === -1) {
          items.push({ id: crypto.randomUUID(), name, count })
        } else {
          items[idx].count += count
        }
        set({ items })
      },

      getItemCount: (name) => {
        const item = get().items.find(i => i.name === name)
        return item?.count ?? 0
      },

      removeItems: (requirements) => {
        const currentItems = [...get().items]
        for (const { item, count } of requirements) {
          const idx = currentItems.findIndex(i => i.name === item)
          if (idx !== -1) {
            currentItems[idx].count -= count
            if (currentItems[idx].count <= 0) {
              currentItems.splice(idx, 1)
            }
          }
        }
        set({ items: currentItems })
      },

      addItems: (name, count) => {
        const items = [...get().items]
        const idx = items.findIndex(i => i.name === name)
        if (idx === -1) {
          items.push({ id: crypto.randomUUID(), name, count })
        } else {
          items[idx].count += count
        }
        set({ items })
      },

      removeItem: (id, count = 1) => {
        let items = [...get().items]
        const idx = items.findIndex(i => i.id === id)
        if (idx !== -1) {
          items[idx].count -= count
          if (items[idx].count <= 0) {
            items.splice(idx, 1)
          }
          set({ items })
        }
      },

      setItemCount: (id, count) => {
        const items = [...get().items]
        const idx = items.findIndex(i => i.id === id)
        if (idx !== -1) {
          items[idx].count = count
          set({ items })
        }
      },

      clearInventory: () => set({ items: [] }),
    }),
    {
      name: "inventory-store", // localStorage key
    }
  )
)
*/