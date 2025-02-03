import cors from 'cors'
import express from 'express'
import { Routes } from './routes/routes'
import rTracer from 'cls-rtracer'
require('dotenv').config()

export default class App {
  public app:express.Application
  public routes:Routes = new Routes()

  constructor () {
    this.app = express()   
    const allowedOrigins = process.env.ALLOWED_ORIGINS ?? '*'
    this.app.use(cors({
      origin: function (origin, callback) {
        // bypass the requests with no origin (like curl requests, mobile apps, etc )
        if (!origin) return callback(null, true)

        if (allowedOrigins.indexOf(origin) === -1) {
          const msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`
          return callback(new Error(msg), false)
        }
        return callback(null, true)
      }
    }))
    this.config()
    this.routes.routes(this.app)
  }

  private config (): void {
    this.app.use(rTracer.expressMiddleware())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: false }))
  }
}