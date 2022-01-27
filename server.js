/*
const express = require('express')
let app = express()

const mongoose = require('mongoose')

// Use Connection
const DB_URL = "mongodb+srv://<user>:<password>@comp3123.bxzhg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.Promise = global.Promise

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }).then(() => {
        console.log("Successfully connected to the database mongoDB Atlas Server");    
    }).catch(err => {
        console.log('Could not connect to the database. Exiting now...', err);
        process.exit();
    });
*/
