import React from 'react'
import { useInventoryStore } from './inventoryStore'

export default function InventoryOverlay() {
  const items = useInventoryStore(state => state.items)

  return (
    <div className="fixed bottom-4 left-4 w-80 h-96 bg-white text-black p-4 rounded shadow overflow-y-auto z-50">
      <h2 className="text-xl font-bold mb-4">Inventory</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">Inventory is empty</p>
      ) : (
        <ul>
          {items.map(({ id, name, count }) => (
            <li key={id} className="mb-2 flex justify-between border-b border-gray-200 pb-1">
              <span>{name}</span>
              <span className="font-semibold">{count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
