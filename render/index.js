var app = require('express')();
var http = require('http').createServer(app);

var indexRouter = require('./routes/routes');
indexRouter.setServer(http);
// set up Restful listener
http.listen(3005, function () {
    console.log('listening on *:3005');
});

app.use('/', indexRouter.router);



