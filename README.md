## `api-server`

## Setting Up

#### Install dependencies

yarn 말고 그냥 npm씀

```sh
npm install
```

mongodb start 해줘야함. mac에서는 `brew services start mongodb-community@4.4`

#### .env파일 설정

#### Starting the server

To start the server, run the following command

```bash
npm run start
```

#### database migration (Seed database)

For a lack of better approach, the database is seeded with new seed files whenever you run the project with

```bash
npm run start
```
