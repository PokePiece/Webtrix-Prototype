import { create } from 'zustand'

type PlaceableType = 'Box' | 'Chair' // adjust as needed

type InventoryItem = {
    id: string
    name: string
    count: number
}

export type ItemRequirement = {
    item: string
    count: number
}


type PlacedObject = {
    id: string
    type: PlaceableType
    position: [number, number, number]
}

type State = {
    avatarPosition: [number, number, number]
    setAvatarPosition: (pos: [number, number, number]) => void

    inventoryItems: InventoryItem[]
    addItem: (name: string, count?: number) => void
    addItems: (name: string, count: number) => void
    removeItem: (name: string, count?: number) => void
    removeItems: (requirements: ItemRequirement[]) => void
    setItemCount: (name: string, count: number) => void
    clearInventory: () => void
    getItemCount: (name: string) => number

    placedObjects: PlacedObject[]
    addPlacedObject: (obj: PlacedObject) => void
    removePlacedObject: (id: string) => void

    loadState: () => void
    saveState: () => void
}


const STORAGE_KEY = 'webtrix_persistent_state'

import { supabase } from '@/lib/supabaseClient'
import { tempClientId, tempUserId } from '@/lib/user'


async function syncStateToSupabase() {
    const { avatarPosition, inventoryItems, placedObjects } = useWorldStore.getState()

    if (!tempUserId || !tempClientId) {
        console.error('Missing user/client ID, skipping sync')
        return
    }

    try {
        // Upsert avatar (no delete)
        let { error } = await supabase
            .from('avatars')
            .upsert({ user_id: tempUserId, position: avatarPosition, client_id: tempClientId }, { onConflict: 'user_id' })
        if (error) throw error

        // Upsert inventory with conflict on id
        if (inventoryItems.length === 0) {
            error = (await supabase.from('inventory').delete().eq('user_id', tempUserId)).error
            if (error) throw error
        } else {
            error = (await supabase
                .from('inventory')
                .upsert(
                    inventoryItems.map(i => ({ ...i, user_id: tempUserId, client_id: tempClientId })),
                    { onConflict: 'id' }
                )).error
            if (error) throw error
        }

        // Upsert placed_objects with conflict on id
        if (placedObjects.length === 0) {
            error = (await supabase.from('placed_objects').delete().eq('user_id', tempUserId)).error
            if (error) throw error
        } else {
            error = (await supabase
                .from('placed_objects')
                .upsert(
                    placedObjects.map(o => ({ ...o, user_id: tempUserId, client_id: tempClientId })),
                    { onConflict: 'id' }
                )).error
            if (error) throw error
        }

        console.log('Sync to Supabase successful: object placement')
    } catch (e) {
        console.error('Supabase sync error:', e)
    }
}




export const useWorldStore = create<State>((set, get) => ({
    avatarPosition: [12, 0, 5],
    setAvatarPosition: (pos) => {
        set({ avatarPosition: pos });
        get().saveState(); // call sync function
    },

    inventoryItems: [],
    addItem: (name, count = 1) => {
        const items = [...get().inventoryItems]
        const idx = items.findIndex(i => i.name === name)
        if (idx === -1) {
            items.push({ id: crypto.randomUUID(), name, count })
        } else {
            items[idx].count += count
        }
        set({ inventoryItems: items })
        get().saveState()
    },
    removeItem: (name, count = 1) => {
        const items = [...get().inventoryItems]
        const idx = items.findIndex(i => i.name === name)
        if (idx !== -1) {
            items[idx].count -= count
            if (items[idx].count <= 0) items.splice(idx, 1)
            set({ inventoryItems: items })
            get().saveState()
        }
    },
    addItems: (name, count) => {
        const items = [...get().inventoryItems]
        const idx = items.findIndex(i => i.name === name)
        if (idx === -1) {
            items.push({ id: crypto.randomUUID(), name, count })
        } else {
            items[idx].count += count
        }
        set({ inventoryItems: items })
        get().saveState()
    },

    removeItems: (requirements) => {
        const currentItems = [...get().inventoryItems]
        for (const { item, count } of requirements) {
            const idx = currentItems.findIndex(i => i.name === item)
            if (idx !== -1) {
                currentItems[idx].count -= count
                if (currentItems[idx].count <= 0) {
                    currentItems.splice(idx, 1)
                }
            }
        }
        set({ inventoryItems: currentItems })
        get().saveState()
    },

    setItemCount: (id, count) => {
        const items = [...get().inventoryItems]
        const idx = items.findIndex(i => i.id === id)
        if (idx !== -1) {
            items[idx].count = count
            set({ inventoryItems: items })
            get().saveState()
        }
    },
    clearInventory: () => {
        set({ inventoryItems: [] })
        get().saveState()
    },
    getItemCount: (name) => {
        const item = get().inventoryItems.find(i => i.name === name)
        return item?.count ?? 0
    },

    placedObjects: [],
    addPlacedObject: (obj) => {
        set(state => ({ placedObjects: [...state.placedObjects, obj] }))
        get().saveState()
    },
    removePlacedObject: (id) => {
        set(state => ({ placedObjects: state.placedObjects.filter(o => o.id !== id) }));
        supabase.from('placed_objects').delete().eq('id', id).eq('user_id', tempUserId)
        get().saveState();
    },

    loadState: () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (!raw) return
            const parsed = JSON.parse(raw)
            set({
                avatarPosition: parsed.avatarPosition || [0, 0, 0],
                inventoryItems: parsed.inventoryItems || [],
                placedObjects: parsed.placedObjects || [],
            })
        } catch {
            // corrupted state, ignore
        }
    },

    saveState: () => {
        const { avatarPosition, inventoryItems, placedObjects } = get()
        const toSave = { avatarPosition, inventoryItems, placedObjects }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))

        // Now this must await the async sync
        syncStateToSupabase().catch(console.error)
    }


}))
