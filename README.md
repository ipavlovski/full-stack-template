## Full Stack Template

Full stack pre-configured project with:
- Sqlite DB backend
- App/server/routes architecture
- Websockets
- Debuggable with VSCode
- Testable with Jest

### Installation

Need to install `sqlite3` driver manually 
```bash
npm install sqlite3 --build-from-source --sqlite=/usr/include
npm install
```

Sample `.env` file:
```conf
SERVER_HOST=localhost
SERVER_PORT=3014
DB_PATH=db.sqlite
```

Other notes:
- `tmux-task` in debug switches to shell#3
- requires `ts-node` installed globally

### Backend

```bash
npm run tsnd
```

- Use `scratch.ts` to manually db/routes

```bash
npm run jest db
npm run jest routes
```

- Use `db.test.ts` to jest-test dbs
- Use `routes.test.ts` to jest-test routes

### Frontend

```bash
npm run webpack watch
```

Compiles:
- pug files
- typescript code
- css files

### Debugging

1. Debug with runner
2. Debug with jest-test 
3. Debug running backend
4. Debug running frontend