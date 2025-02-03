import App  from './app'
require('dotenv').config()

const app = new App().app

const PORT = process.env.PORT

    app.listen(PORT, () => {
      console.log('TMS API is now available on port: ' + PORT)
    })