// connect to current instance of DB
import { dbPath } from 'common/config'
import DB from 'backend/db'

const db = new DB(dbPath!, false)
db.init()
db.queryItems({id: 3})
