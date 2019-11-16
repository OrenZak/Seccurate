const { eventEmitter, startCrawl, setConfig , EVENTS } = require("./crawler");
const { paths } = require('../config'); 

const ACTIONS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  START_CRAWL: "crawl"
};

// connect to api_getway and listen to start crawler events.
api_getway = require("socket.io-client")(paths.API_GETWAY);
api_getway.on('connect', async function() {
  console.log(`Crawler connected to api getway:`);
});
api_getway.on(ACTIONS.START_CRAWL, async function(data) {
  setConfig(data.config)
  startCrawl(data.url, data.loginInfo);
});

// crawler event listener
eventEmitter.on(EVENTS.PAGE_FETCHED, ({ mainUrl, data }) => {
  try {
    console.log(data)
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

module.exports = {};
