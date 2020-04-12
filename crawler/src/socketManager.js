const { eventEmitter, startCrawl, setConfig, EVENTS } = require('./crawler');
const { paths } = require('../config');

const ACTIONS = {
  START_CRAWL: 'crawl'
};

// connect to api_gateway and listen to start crawler events.
const api_gateway = require('socket.io-client')(paths.API_GATEWAY);
api_gateway.on('connect', async function() {
  console.log(`Crawler connected to api Gateway:`);
});
api_gateway.on(ACTIONS.START_CRAWL, async function(data) {
  setConfig(data.config);
  startCrawl(data.url, data.loginInfo);
});

// crawler event listener
eventEmitter.on(EVENTS.PAGE_FETCHED, ({ mainUrl, data }) => {
  try {
    // console.log(data);
    api_gateway.emit(EVENTS.PAGE_FETCHED, data);
  } catch (err) {
    console.log(err);
  }
});

eventEmitter.on(EVENTS.CRAWLER_DONE, ({ mainUrl }) => {
  try {
    api_gateway.emit(EVENTS.CRAWLER_DONE);
  } catch (err) {
    console.log(err);
  }
});

module.exports = {};
