#!/usr/bin/env node

const express = require('express')
const vhost = require('vhost')
const path = require('path')
const app = express()
const blackrole = require('../blackrole')

app.use(express.static(path.join(__dirname, 'static')))
app.locals.hostname = 'brobsc.me'

app.use(vhost('blog.' + app.locals.hostname, (req, res, next) => {
  console.log('Blog reached')
  blackrole.app.handle(req, res, next)
}))
app.use(vhost('*' + app.locals.hostname, app));

app.get('/', (req, res) => {
  console.log(`${req.connection.remoteAddress} has requested`)
  if (app.locals.hostname !== req.hostname) {
    console.log(`req has tried '${req.subdomains.join('.')}' subdomain. sending base`)
    res.redirect(`http://${app.locals.hostname}:80`)
  }
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(8080, () => console.log('Listening on port 8080'))
