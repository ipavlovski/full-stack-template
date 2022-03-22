// connect to current instance of DB
import { dbPath } from 'common/config'
import DB from 'backend/db'

var db = new DB(dbPath!, false)
db.init()
await db.all('select * from item')


// test the insert route
import { serverHost, serverPort } from 'common/config'
import fetch from 'node-fetch'

var inputItem = { name: 'name3', description: 'description3' }
var res = await fetch(`http://${serverHost}:${serverPort}/insert`, {
    method: 'PUT',
    body: JSON.stringify(inputItem),
    headers: { 'Content-Type': 'application/json' }
})
res.status

// test the select route
var res = await fetch(`http://${serverHost}:${serverPort}/select?name=name3`)
res.status
await res.json()

// test the update route
var updateItem = { oldName: 'name3', newName: 'name300' }
var res = await fetch(`http://${serverHost}:${serverPort}/update`, {
    method: 'POST',
    body: JSON.stringify(updateItem),
    headers: { 'Content-Type': 'application/json' }
})
res.status

// test the delete route
var res = await fetch(`http://${serverHost}:${serverPort}/remove/3`, {
    method: 'DELETE'
})
res.status


// check broadcast rsults using a socket (update/insert/delete)
import { WebSocket } from 'ws'

const client = new WebSocket(`ws://${serverHost}:${serverPort}`)
void client.on('message', (data) => {
    console.log(data.toString())
})



