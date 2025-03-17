import * as dotenv from "dotenv";
dotenv.config();

const isTestEnv = process.env.NODE_ENV === "test"
 let dbConfig

if(isTestEnv) {
  dbConfig = {
    type: 'postgres',
    host: 'localhost',
    port: 54321,
    username: 'testuser',
    password: 'testpassword',
    database: 'testdb',
    synchronize: false,
    logging: false,
    entities: [
      'src/entities/**/*.ts'
    ],
    migrations: [
      './src/migrations/*.ts'
    ],
    subscribers: [
      'src/subscriber/**/*.ts'
    ],
    cli: {
      entitiesDir: 'src/entities',
      migrationsDir: 'src/migration',
      subscribersDir: 'src/subscriber'
    }
 }
}

 else {

  dbConfig = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: false,
    entities: [
      'src/entities/**/*.ts'
    ],
    migrations: [
      './src/migrations/*.ts'
    ],
    subscribers: [
      'src/subscriber/**/*.ts'
    ],
    cli: {
      entitiesDir: 'src/entities',
      migrationsDir: 'src/migration',
      subscribersDir: 'src/subscriber'
    }
 }

 }
 

module.exports = dbConfig