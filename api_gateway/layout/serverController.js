let app = require('express')();
let http = require('http').createServer(app);
const globals = require('../common/globals');
const cors = require('cors');

let indexRouter = require('../routes');
indexRouter.setServer(http);
// set up Restful listener
http.listen(3001, function() {
  console.log('listening on *:3001');
});

let corsOptions = {
  origin: globals.CLIENT_HOSTNAME,
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use('/', indexRouter.router);
