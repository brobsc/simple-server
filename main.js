#!/usr/bin/env node

const express = require('express')
const vhost = require('vhost')
const path = require('path')
const app = express()

app.use(express.static(path.join(__dirname, 'static')))
app.locals.hostname = 'brobsc.me'

// app.use(vhost('*localhost', app));

app.get('/', (req, res) => {
  console.log(`${req.connection.remoteAddress} has connected`)
  if (app.locals.hostname != req.hostname) {
    console.log(`req has tried '${req.subdomains.join('.')}' subdomain. sending base`)
    res.redirect(`http://${app.locals.hostname}:80`)
    return
  }
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(8080, () => console.log('Listening on port 8080'))
