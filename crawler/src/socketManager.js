const { eventEmitter, startCrawl, EVENTS } = require("./crawler");

const ACTIONS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  START_CRAWL: "crawl"
};

function start(server) {
  io = require("socket.io")(server);
  io.on(ACTIONS.CONNECTION, async function(socket, next, a) {
    console.log(`SocketIO - connection`);

    socket.on(ACTIONS.START_CRAWL, async function(data) {
      console.log(`Start crawling on:`, JSON.stringify(data));
      socket.join(data.url);
      startCrawl(data.url, data.loginInfo);
    });

    socket.on(ACTIONS.DISCONNECT, async function() {
      console.log("socket disconnected");
    });
  });
}

// crawler event listener
eventEmitter.on(EVENTS.PAGE_FETCHED, ({ mainUrl, data }) => {
  try {
    io.to(mainUrl).emit(EVENTS.PAGE_FETCHED, data);
  } catch (err) {
    console.log(err);
  }
});

eventEmitter.on(EVENTS.CRAWLER_DONE, ({ mainUrl }) => {
    try {
      io.to(mainUrl).emit(EVENTS.CRAWLER_DONE);
    } catch (err) {
      console.log(err);
    }
  });

module.exports = {
  start
};
