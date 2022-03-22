export interface RunResult {
    changes: number
    lastID: number
}

export interface ErrorMessage {
    type: string
    message: string
}

export interface Item {
    id: number
    name: string
    description: string
}

export type RouterSelect = Partial<Item>
export type RouterInsert = Omit<Item, 'id'>
export type RouterUpdate = { oldName: string, newName: string }
export type RouterDelete = Pick<Item, 'id'>
