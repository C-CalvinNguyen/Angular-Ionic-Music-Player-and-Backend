const express = require('express')
let app = express()

app.get('/', (req, res) => {
    res.send("Test");
});

module.exports = app