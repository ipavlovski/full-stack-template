import { RouterDelete, RouterInsert, RouterSelect, RouterUpdate } from 'common/types'
import { coerce, Describe, number, object, optional, string } from 'superstruct'

export const RouterSelectSchema: Describe<RouterSelect> = object({
    id: optional(coerce(number(), string(), (v) => parseInt(v))),
    name: optional(string()),
    description: optional(string())
})

export const RouterInsertSchema: Describe<RouterInsert> = object({
    name: string(),
    description: string()
})

export const RouterUpdateSchema: Describe<RouterUpdate> = object({
    oldName: string(),
    newName: string()
})

export const RouterDeleteSchema: Describe<RouterDelete> = object({
    id: coerce(number(), string(), (v) => parseInt(v))
})

