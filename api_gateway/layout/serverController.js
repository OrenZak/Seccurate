let app = require('express')();
let http = require('http').createServer(app);
const cors = require('cors');

let indexRouter = require('../routes');
indexRouter.setServer(http);
// set up Restful listener
http.listen(3001, function() {
  console.log('listening on *:3001');
});

app.use(cors());
app.use('/', indexRouter.router);
