const { eventEmitter, startCrawl, EVENTS } = require("./crawler");
const { paths } = require('../config'); 

const ACTIONS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  START_CRAWL: "crawl"
};

// connect to api_getway and listen to start crawler events.
api_getway = require("socket.io-client")(paths.API_GETWAY);
api_getway.on(ACTIONS.START_CRAWL, async function(data) {
  console.log(`Start crawling on:`, JSON.stringify(data));
  socket.join(data.url);
  startCrawl(data.url, data.loginInfo);
});

// crawler event listener
eventEmitter.on(EVENTS.PAGE_FETCHED, ({ mainUrl, data }) => {
  try {
    api_getway.emit(EVENTS.PAGE_FETCHED, data);
  } catch (err) {
    console.log(err);
  }
});

eventEmitter.on(EVENTS.CRAWLER_DONE, ({ mainUrl }) => {
    try {
      api_getway.emit(EVENTS.CRAWLER_DONE);
    } catch (err) {
      console.log(err);
    }
  });

module.exports = {
  start
};
