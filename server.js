if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev'
const express = require('express')
const app = express()
const compression = require('compression')
const cors = require('cors')
const routes = require('./routes/route')
require('./config/sequelize')
const { APP_NAME, PORT } = require('./config/constants')

require('events').EventEmitter.defaultMaxListeners = 0

app.use(cors())
app.use(compression()) // use compression
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api', routes)

try {
  app.listen(PORT, () => console.log(`${APP_NAME} server is starting on ${PORT} port`))
} catch (error) {
  console.log('Failed to start server.')
}
