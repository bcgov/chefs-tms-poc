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
    const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*'];
    this.app.use(cors({
      origin: function (origin, callback) {
        if (!origin) return callback(null, true)
          if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
            return callback(null, true)
          } else {
            const msg = `CORS Error: This site ${origin} does not have access`
            return callback(new Error(msg), false)
          }
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