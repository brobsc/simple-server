#!/usr/bin/env node

const express = require('express')
const path = require('path')
const app = express()

app.use(express.static(path.join(__dirname, 'static')))

app.get('/', (req, res) => {
  console.log(`${req.connection.remoteAddress} has connected`)
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(8080, () => console.log('Listening on port 8080:'))
