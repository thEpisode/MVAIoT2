
console.log('\n\t\t\t\t== MVA.IoT ==');

// =======================
// libraries =========
// =======================
var express = require("express");
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require("socket.io")(http);
var ioClient = require('socket.io-client');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var checkInternet = require('is-online');

var globals = require('./app/controllers/global');
var frontend = require('./app/controllers/frontend');
var socketController = require('./app/controllers/socket');

var SerialPort = require("serialport").SerialPort;
var serialport = new SerialPort("/dev/ttyACM0",{
  baudRate: 9600
});

console.log('\nLibs imported');

// =======================
// configuration =========
// =======================
var port = 3000;

var isOnline = true;

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// =======================
// initialize modules =========
// =======================

serialport.on('open', function () {
    console.log('Serial Port Opend');
    frontend.initialize(app, express, path);
    socketController.initialize(io, ioClient, globals, serialport);
});


console.log('modules initialized');

// =======================
// listening app =========
// =======================
io.listen(app.listen(port));
console.log('Listening on port 3000');