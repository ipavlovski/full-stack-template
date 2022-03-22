import DB from 'backend/db'
import routes from 'backend/routes'
import WSS from 'backend/websocket'
import { dbPath } from 'common/config'
import express, { json } from 'express'
import { createServer } from 'http'
import morgan from 'morgan'

const app = express()

app.use(json())

morgan.token('session', (req: any) => {
    return req.user?.id ?? 'anon'
})
app.use(morgan(':session :method :url :response-time'))

app.use(express.static(`${__dirname}/../dist`))

app.use(routes)

console.log('DB PATH @SERVER:', dbPath!)
const db = new DB(dbPath!, false)
db.init()



const server = createServer(app)
const wss = new WSS(server)

export { server, wss, db }
