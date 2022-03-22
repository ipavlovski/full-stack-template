import { server, db } from 'backend/server'
import { Server } from 'http'
import { WebSocket } from 'ws'
import fetch from 'node-fetch'
import { serverHost, serverPort } from 'common/config'
import { Item } from 'common/types'

function startServer(port: number) {
    return new Promise<Server>((resolve) => {
        server.listen(port, () => {
            console.log(`Test server listening on: ${serverPort}`)
            resolve(server)
        })
    })
}

function waitForSocketState(socket: WebSocket, state: number) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            (socket.readyState === state) ?
                resolve(true) : waitForSocketState(socket, state).then(resolve)
        }, 50)
    })
}

async function createSocketClient() {
    const client = new WebSocket(`ws://${serverHost}:${serverPort}`)
    await waitForSocketState(client, client.OPEN)
    let messages: string[] = []
    client.on('message', (data) => {
        messages.push(data.toString())
        client.close()
    })
    return [client, messages] as [WebSocket, string[]]
}


async function populateDB(sourcePath: string) {
    console.log('DB: reloading tables.')
    await db.run(`ATTACH '${sourcePath}' AS db2;`)
    await db.run('INSERT INTO item SELECT * FROM db2.item')
    await db.run('DETACH db2')
}

async function clearDB() {
    console.log('DB: clearing tables')
    await db.run(`DROP TABLE item`)
}


let httpServer: Server

beforeAll(async () => {
    return httpServer = await startServer(serverPort)
})

afterAll(() => {
    return httpServer.close()
})

beforeEach(async () => {
    await db.init()
    await populateDB('./tests/fixtures/db-sample.sqlite')
})

afterEach(async () => {
    await clearDB()
})




describe('ping/pong', () => {

    test('http ping', async () => {
        const res = await fetch(`http://${serverHost}:${serverPort}/ping`)
        expect(res.status).toBe(200)

        const body = await res.json()
        expect(body).toBe('pong')  
    })

    test('websocket ping', async () => {
        const [client, messages] = await createSocketClient()
        client.send(JSON.stringify("ping"))
        await waitForSocketState(client, client.CLOSED)

        // this destructing is 'calling of a reference'
        const [message] = messages
        expect(message).toBe("pong")
    }, 2000)

})


describe('endpoint /insert', () => {
    test('insert normal row', async () => {
        const [client, messages] = await createSocketClient()

        var inputItem = { name: 'name11', description: 'description11' }
        var res = await fetch(`http://${serverHost}:${serverPort}/insert`, {
            method: 'PUT',
            body: JSON.stringify(inputItem),
            headers: { 'Content-Type': 'application/json' }
        })
        expect(res.status).toBe(201)

        await waitForSocketState(client, client.CLOSED)
        const [message] = messages
        const result: Item = JSON.parse(message)
        expect(result.name).toBe(inputItem.name)
        expect(result.description).toBe(inputItem.description)
    })
})


describe('endpoint /select', () => {
    test('select by name', async () => {
        var res = await fetch(`http://${serverHost}:${serverPort}/select?name=name3`)
        expect(res.status).toBe(200)
        const results: Item[] = await res.json()
        expect(results).toHaveLength(1)
        expect(results[0].description).toBe('desc3')
    })

    test('get zero length result', async () => {
        var res = await fetch(`http://${serverHost}:${serverPort}/select?id=123`)
        expect(res.status).toBe(200)
        const results: Item[] = await res.json()
        expect(results).toHaveLength(0)
    }, 20000)
})





