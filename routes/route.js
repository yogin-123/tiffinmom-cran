const adminRoute = require('./v1/admin')
const webSiteRoute = require('./v1/website')
const app = require('express').Router()

app.use('/admin/v1', adminRoute)
app.use('/website/v1', webSiteRoute)

app.use((req, res, next) => {
  res.status(404)
  res.send('This Url Is Not Valid')
})

module.exports = app
