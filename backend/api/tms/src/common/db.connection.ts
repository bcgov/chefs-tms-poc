import { DataSource } from 'typeorm'

const config = require('../ormconfig.ts')

const AppDataSource = new DataSource(config)

export const connection = AppDataSource

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });