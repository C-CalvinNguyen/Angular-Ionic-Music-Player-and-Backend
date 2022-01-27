// Comment - To Update server.js
/*
const express = require('express')
const bodyParser = require('body-parser')
const mongoConnect = require('./server.js')
const tempRoute = require('./routes/tempRoute.js')
const app = express()


app.use(mongoConnect)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(tempRoute)

app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});
*/

// Implement Streaming From Local File
// TO DO: Implement Video Information on MongoDB (Keep Audio File ON Local)

const express = require('express')
const bodyParser = require('body-parser')
const tempRoute = require('./routes/tempRoute.js')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(tempRoute)

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});