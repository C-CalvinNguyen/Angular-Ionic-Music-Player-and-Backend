// Implemented Streaming From Local File System
// TO DO: Implement Audio Information on MongoDB (Keep Audio File ON LOCAL)
// ID, PATH, USER

const express = require('express')
const bodyParser = require('body-parser')
//const mongoose = require('mongoose')
const routes = require('./routes/tempRoute.js')
const app = express()

// MiddleWare
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(routes)

// HTTP Server
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});