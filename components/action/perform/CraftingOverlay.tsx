import React from 'react'
import { useInventoryStore } from './inventoryStore'
import { craftables } from './craftables'

export default function CraftingOverlay() {
  const items = useInventoryStore(state => state.items)
  const addItems = useInventoryStore(state => state.addItems)
  const removeItems = useInventoryStore(state => state.removeItems)
  const getItemCount = useInventoryStore(state => state.getItemCount)

  const canCraft = (requirements: { item: string; count: number }[]) =>
    requirements.every(({ item, count }) => getItemCount(item) >= count)

  const craft = (
    requirements: { item: string; count: number }[],
    output: { item: string; count: number }
  ) => {
    if (!canCraft(requirements)) return
    removeItems(requirements)
    addItems(output.item, output.count)
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-gray-300 text-black p-4 rounded shadow overflow-y-auto z-50">
      <h2 className="text-xl font-bold mb-4">Crafting</h2>
      {craftables.map(({ id, name, requirements, produces }) => (
        <div key={id} className="mb-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold">{name}</div>
              <div className="text-sm text-gray-700">
                {requirements.map(r => `${r.count} ${r.item}`).join(', ')} 
              </div>
            </div>
            <button
              onClick={() => craft(requirements, produces)}
              disabled={!canCraft(requirements)}
              className="px-2 py-1 bg-blue-500 text-white rounded disabled:bg-gray-400"
            >
              Craft
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

//→ {produces.count} {produces.item}