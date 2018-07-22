#!/usr/bin/env node

const readFileSync = require('fs').readFileSync
const https = require('https')
const express = require('express')
const vhost = require('vhost')
const path = require('path')
const app = express()
const blackrole = require('../blackrole')

const PORT = 8080

app.use(express.static(path.join(__dirname, 'static')))
app.locals.hostname = 'brobsc.test'

if (process.env.NODE_ENV === 'production') {
  app.locals.hostname = 'brobsc.me'
} else {
  console.log('Running on dev mode')
}

app.use(vhost('blog.' + app.locals.hostname, (req, res, next) => {
  console.log('Blog reached')
  blackrole.app.handle(req, res, next)
}))
app.use(vhost('seafile.' + app.locals.hostname, (req, res, next) => {
  console.log('Seafile reached')
  res.redirect(`http://${app.locals.hostname}:8090`)
}))
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

if (process.env.NODE_ENV === 'production') {
  const options = {
    key: readFileSync('/etc/simple-server/privkey.pem'),
    cert: readFileSync('/etc/simple-server/cert.pem'),
  };

  https.createServer(options, app).listen(PORT , function(){
    console.log("Https server listening on port 8080");
  });
} else {
  app.listen(PORT, () => console.log('Listening on port 8080'))
}
