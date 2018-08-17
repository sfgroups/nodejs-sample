'use strict';

const express = require('express');
const mongoose = require('mongoose');
var PropertiesReader = require('properties-reader');
var fs = require("fs");

const options = {
  user : process.env.MONGODB_USERNAME || "",
  pass : process.env.MONGODB_PASSWORD || ""
};

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

var properties = PropertiesReader('/dbinfo/dbconfig.conf');
var MONGODB_USERNAME= properties.get('MONGODB_USERNAME');
var MONGODB_URI=properties.get('MONGODB_URI');
var MONGODB_PASSWORD = fs.readFileSync("/secret/secret.txt", { "encoding": "utf8"});

console.log('MONGODB_URI ='+MONGODB_URI)
console.log('MONGODB_USERNAME ='+MONGODB_USERNAME)
//console.log('MONGODB_PASSWORD  ='+MONGODB_PASSWORD )

const options = {
  user : MONGODB_USERNAME || process.env.MONGODB_USERNAME || "",
  pass : MONGODB_PASSWORD || process.env.MONGODB_PASSWORD || ""
};

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello world\n');
});

mongoose.connect(process.env.MONGODB_URI || MONGODB_URI, options)
mongoose.Promise = global.Promise

const db = mongoose.connection

db.on('error', err => console.error('Connection error', err))
db.on('open', () => console.log('Connected to db'))

module.exports = db

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
