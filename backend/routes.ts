import { wss, db } from 'backend/server'
import { RouterDeleteSchema, RouterInsertSchema, RouterSelectSchema, RouterUpdateSchema } from 'backend/validation'
import { ExceptionHandler } from 'common/errors'
import { Router } from 'express'
import { create } from 'superstruct'

const routes = Router()

routes.get('/ping', (_, res) => {
    return res.json('pong')
})

routes.get('/select', async (req, res) => {
    try {
        console.log(req.query)
        const query = create(req.query, RouterSelectSchema)
        const results = await db.queryItems(query)

        return res.status(200).send(JSON.stringify(results))
    } catch (error) {
        const msg = new ExceptionHandler(error).toJSON()
        return res.status(400).json(msg)
    }
})

routes.put('/insert', async (req, res) => {
    try {
        const item = create(req.body, RouterInsertSchema)
        const castable = await db.insertItem(item)

        wss.broadcast(castable)
        return res.sendStatus(201)
    } catch (error) {
        const msg = new ExceptionHandler(error).toJSON()
        return res.status(400).json(msg)
    }
})

routes.post('/update', async (req, res) => {
    try {
        const item = create(req.body, RouterUpdateSchema)
        const castable = await db.updateItem(item)

        wss.broadcast(castable)
        return res.sendStatus(200)
    } catch (error) {
        const msg = new ExceptionHandler(error).toJSON()
        return res.status(400).json(msg)
    }
})


routes.delete('/remove/:id', async (req, res) => {
    try {
        const item = create(req.params, RouterDeleteSchema)
        const castable = await db.deleteItem(item)

        wss.broadcast(castable)
        return res.sendStatus(200)
    } catch (error) {
        const msg = new ExceptionHandler(error).toJSON()
        return res.status(400).json(msg)
    }
})

export default routes