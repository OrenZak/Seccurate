var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// set up Restfull listener
http.listen(3000, function () {
    console.log('listening on *:3000');
});

app.get('/', function (req, res) {
    res.send('<h1>Hello world</h1>');
});


// handle socket io connetion
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.on('scan results', function (vulnerabilityBoundary) {

    });
});