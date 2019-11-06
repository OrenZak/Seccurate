var app = require('express')();
var http = require('http').createServer(app);
var socketManager = require('./socketManager');
var LogicService = require('../logic/logicService');
var indexRouter = require('../routes/index');
var logicService = new LogicService();
var Boundary = require('../layout/urlBoundary');

socketManager.start(http);
// set up Restful listener
http.listen(3000, function () {
    console.log('listening on *:3000');
});

app.use('/', indexRouter);

