export type Craftable = {
    id: string
    name: string
    requirements: { item: string; count: number }[]
    produces: { item: string; count: number }
}

export const craftables: Craftable[] = [
    {
        id: 'box',
        name: 'Box',
        requirements: [{ item: 'Wood', count: 5 }],
        produces: { item: 'Box', count: 1 }
    },
    {
        id: 'chair',
        name: 'Chair',
        requirements: [{ item: 'Wood', count: 5 }, { item: 'Metal', count: 3 }],
        produces: { item: 'Chair', count: 1 }
    },
    /*
    {
        id: 'box-to-wood',
        name: 'Wood',
        requirements: [{ item: 'Box', count: 1 }],
        produces: { item: 'Wood', count: 5 }
    },
    */
]
