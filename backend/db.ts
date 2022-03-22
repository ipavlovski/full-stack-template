import SQLite from 'backend/sqlite'
import { Item, RouterDelete, RouterInsert, RouterSelect, RouterUpdate } from 'common/types'

export default class DB extends SQLite {

    constructor(filename: string, debug = false) {
        super(filename, debug)
    }

    async init() {
        await this.createTables()
        return this
    }

    async createTables() {
        const table = `CREATE TABLE IF NOT EXISTS item (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            name TEXT, 
            description TEXT
        )`
        await this.run(table)
    }

    async queryItems(query: RouterSelect): Promise<Item[]> {
        const entries = Object.entries(query).filter(([key, val]) => val)
        const keys = entries.map(([key, _]) => `${key}=?`).join(', ') 
        const qstring = `SELECT * FROM item WHERE ${keys}`
        const args = entries.map(([_, val]) =>  val)

        return this.all<Item>(qstring, args)
    }

    async insertItem(query: RouterInsert): Promise<Item> {
        const qstring = 'INSERT INTO item (name, description) VALUES (?, ?) RETURNING *'
        const args = [ query.name, query.description ]
        return this.get<Item>(qstring, args)
    }

    async updateItem({oldName, newName}: RouterUpdate): Promise<Item> {
        const qstring = 'UPDATE item SET name = ? WHERE name = ? RETURNING *'
        const args = [ newName, oldName ]
        return this.get<Item>(qstring, args)
    }

    async deleteItem(query: RouterDelete): Promise<Item> {
        const qstring = 'DELETE FROM item WHERE id = ? RETURNING *'
        const args = [ query.id ]
        return this.get<Item>(qstring, args)
    }
}

