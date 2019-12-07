var app = require('express')();
var http = require('http').createServer(app);

var indexRouter = require('../routes/index');
indexRouter.setServer(http);
// set up Restful listener
http.listen(3001, function () {
    console.log('listening on *:3001');
});

app.use('/', indexRouter.router);

