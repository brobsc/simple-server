#!/usr/bin/env node

const express = require('express')
const vhost = require('vhost')
const path = require('path')
const app = express()

app.use(express.static(path.join(__dirname, 'static')))
app.locals.hostname = 'brobsc.test'

if (process.env.NODE_ENV === 'production') {
  app.locals.hostname = 'brobsc.me'
} else {
  console.log('Running on dev mode')
}

port = process.env.NODE_PORT || 8080;

app.use(vhost('*' + app.locals.hostname, app));

redirectToBase = (req, res, next) => {
  console.log(`${req.connection.remoteAddress} has requested`)
  if (app.locals.hostname !== req.hostname) {
    console.log(`req has tried '${req.subdomains.join('.')}' subdomain. sending base`)
    // res.writeHead(302, {
    //   Location: `http://${app.locals.hostname}:8080`
    // })
    res.redirect(`http://${app.locals.hostname}:80`)
    console.log('header changed')
  } else {
    console.log('sending next')
    next()
  }
}

app.use('/', redirectToBase)

app.get('/', (req, res, next) => {
  console.log('Sending index.html')
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(port, () => console.log(`Listening on ${app.locals.hostname}:${port}`))
