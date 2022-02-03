/*
Modules
    bcrypt

    body-parser
        get body of post form (json)
    express
        start server, and manage routes
    jsonwebtoken
        create new token
    mongoose
        connect to database
    nodemon
        used to test server, live reloading
    passport
        used for authentication
    passport-jwt
        used for authentication
*/
// Implemented Streaming From Local File System
// TO DO: Implement Audio Information on MongoDB (Keep Audio File ON LOCAL)
// ID, PATH, USER

const express = require('express')
const bodyParser = require('body-parser')
//const passport = require('passport')
const routes = require('./routes/routes.js')
const mongoose = require('mongoose')
const config = require('./config/config.js')
const port = process.env.PORT || 8080

// Create App Using Express
const app = express()

// Use bodyParser to get info from POST request body
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

app.use(routes)

mongoose.connect(config.db, { useNewUrlParser: true , useUnifiedTopology: true})

const connection = mongoose.connection

connection.once('open', () => {
    console.log('SUCCESS - MongoDB connection established.');
});
 
connection.on('error', (err) => {
    console.log("FAILED - MongoDB connection error. " + err);
    process.exit();
});

app.listen(port, () => {
    console.log('Server is listening at port ' + port)
})


/*
const express = require('express')
const bodyParser = require('body-parser')
//const mongoose = require('mongoose')
const routes = require('./routes/routes.js')
const app = express()

// MiddleWare
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.send("Test Home");
});

app.use(routes)

// HTTP Server
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
*/