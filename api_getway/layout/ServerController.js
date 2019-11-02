var app = require('express')();
var http = require('http').createServer(app);
var socketManager = require('./socketManager')
var LogicService = require('../logic/logicService')
var logicService = new LogicService();
var Boundary = require('../layout/urlBoundary');
var b = new Boundary();

socketManager.start(http);
// set up Restful listener
http.listen(3000, function () {
    console.log('listening on *:3000');
});

app.get('/', function (req, res) {
    res.send('<h1>Hello world</h1>');
    console.log("works");
});

