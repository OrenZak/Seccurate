const Crawler = require("simplecrawler"),
  events = require("events"),
  urlLib = require("url"),
  cheerio = require("cheerio"),
  request = require("request");

const EVENTS = {
  PAGE_FETCHED: "page_fetched",
  CRAWLER_DONE: "crawler_done"
};

function startCrawl(mainUrl) {
  console.log("createCrawler with: " + mainUrl);
  const crawler = Crawler(mainUrl);
  crawler.interval = 2000; // 2 seconds
  crawler.maxDepth = 1;
  crawler.maxConcurrency = 3;
  crawler.decodeResponses = true;
  crawler.filterByDomain = true;
  crawler.supportedMimeTypes = [];

  request(
    mainUrl,
    {
      // The jar option isn't necessary for simplecrawler integration, but it's
      // the easiest way to have request remember the session cookie between this
      // request and the next
      jar: true
    },
    function(error, response, body) {
      // Start by saving the cookies. We'll likely be assigned a session cookie
      // straight off the bat, and then the server will remember the fact that
      // this session is logged in as user "bee" after we've successfully
      // logged in
      crawler.cookies.addFromHeaders(response.headers["set-cookie"]);

      // We want to get the names and values of all relevant inputs on the page,
      // so that any CSRF tokens or similar things are included in the POST
      // request
      const $ = cheerio.load(body),
        formDefaults = {},
        // You should adapt these selectors so that they target the
        // appropriate form and inputs
        formAction = $("#login").attr("action"),
        loginInputs = $("input");

      // We loop over the input elements and extract their names and values so
      // that we can include them in the login POST request
      loginInputs.each(function(i, input) {
        var inputName = $(input).attr("name"),
          inputValue = $(input).val();

        formDefaults[inputName] = inputValue;
      });

      // Time for the login request!
      request.post(
        urlLib.resolve(mainUrl, formAction),
        {
          // We can't be sure that all of the input fields have a correct default
          // value. Maybe the user has to tick a checkbox or something similar in
          // order to log in. This is something you have to find this out manually
          // by logging in to the site in your browser and inspecting in the
          // network panel of your favorite dev tools what parameters are included
          // in the request.
          form: Object.assign(formDefaults, {
            username: "bee",
            password: "bug"
          }),
          // We want to include the saved cookies from the last request in this
          // one as well
          jar: true
        },
        function(error, response, body) {
          // That should do it! We're now ready to start the crawler
          crawler.on("fetchcomplete", function(
            queueItem,
            responseBuffer,
            response
          ) {
            console.log("I just received queueItem: \n");
            console.log(queueItem.url);
            console.log("\n End queueItem");
            doEmit(EVENTS.PAGE_FETCHED, mainUrl, {
              fetchedUrl: queueItem.url
            });
          });

          // Data to send
          // {
          //   'url': "",
          //   'authType': basic / cookie / none,
          //   'hash': each page hash
          // }

          crawler.on("complete", function() {
            doEmit(EVENTS.CRAWLER_DONE, mainUrl);
          });

          crawler.start();
        }
      );
    }
  );
}

function getConfig() {
  //TODO get the crawler config, should have default conf.

function setConfig(config) {
  //TODO save the crawler config and load it as needed.
}

function doEmit(action, mainUrl, data) {
  module.exports.eventEmitter.emit(action, { mainUrl: mainUrl, data: data });
}

module.exports = {
  eventEmitter: new events.EventEmitter(),
  startCrawl,
  setConfig,
  EVENTS
};
