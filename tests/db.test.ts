import DB from 'backend/db'
import { Item } from 'common/types'


describe('CRUD chain', () => {

    const db = new DB(':memory:', false)

    test('init DB', async () => {
        // prior to init, should be empty
        const qstring = 'SELECT name FROM sqlite_master WHERE type="table"'
        let tables = await db.all<{name: string}>(qstring)
        expect(tables).toHaveLength(0)

        // after init, should contain the 'item' table
        await db.init()
        tables = await db.all<{name: string}>(qstring)
        const match = tables.some(v => v.name == 'item')
        expect(match).toBeTruthy()
    })

    test('insertItem', async () => {
        await db.insertItem({name: 'item1', description: 'desc1'})
        const items = await db.all<Item>('select * from item')
        expect(items).toHaveLength(1)
        expect(items[0].name).toBe('item1')
    })

    test('queryItems', async () => {
        const items = await db.queryItems({id: 1})
        expect(items).toHaveLength(1)
        expect(items[0].name).toBe('item1')
    })

    test('updateItem', async () => {
        const item = await db.updateItem({newName: 'item100', oldName: 'item1'})
        expect(item.id).toBe(1)
        const items = await db.all<Item>('SELECT * FROM item')
        expect(item.name).toBe(items[0].name)
    })


    test('deleteItem', async () => {
        const item = await db.deleteItem({id: 1})
        expect(item.id).toBe(1)
        const items = await db.all<Item>('SELECT * FROM item')
        expect(items).toHaveLength(0)
    })


})