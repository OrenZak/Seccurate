const Crawler = require("simplecrawler"),
  config = require("../config"),
  crypto = require("crypto"),
  events = require("events"),
  urlLib = require("url"),
  cheerio = require("cheerio"),
  request = require("request"),
  AppDAO = require("./db/dao");
CrawlerRepository = require("./db/crawler_repository");

let crawler_config = config.crawler;

const EVENTS = {
  PAGE_FETCHED: "page_fetched",
  CRAWLER_DONE: "crawler_done"
};

const dao = new AppDAO("./crawler.database");
const crawlerRepo = new CrawlerRepository(dao);

async function createTableByURL(mainUrl) {
  await crawlerRepo.createTable(mainUrl);
}

function doEmit(action, mainUrl, data) {
  module.exports.eventEmitter.emit(action, { mainUrl: mainUrl, data: data });
}

function startCrawl(mainUrl, loginInfo) {
  createTableByURL(mainUrl);
  const crawler = Crawler(mainUrl);
  crawler.interval = crawler_config.interval;
  crawler.maxDepth = crawler_config.maxDepth;
  crawler.maxConcurrency = crawler_config.maxConcurrency;
  crawler.timeout = crawler_config.timeout;``
  crawler.decodeResponses = true;
  crawler.parseHTMLComments = false;
  crawler.allowInitialDomainChange = false;
  crawler.parseScriptTags = true;
  crawler.respectRobotsTxt = false;
  crawler.filterByDomain = true;
  crawler.scanSubdomains = false;
  crawler.acceptCookies = true;

  crawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
    console.log(`New page: ${queueItem.url}`);
    const hash = createHash(queueItem)
    const urlCookies = getCookies(crawler, queueItem.url);
    doEmit(EVENTS.PAGE_FETCHED, mainUrl, {
      url: queueItem.url,
      cookies: urlCookies, 
      type: urlCookies.length > 0 ? 'Cookie' : 'Basic',
      pageHash: hash,
    });
  });

  crawler.on("complete", function() {
    console.log("Crawling completed");
    doEmit(EVENTS.CRAWLER_DONE, mainUrl);
  });

  crawler.addFetchCondition(function(queueItem, referrerQueueItem, callback) {
    callback(null, queueItem.depth < crawler.maxDepth);
  });

  crawler.addDownloadCondition(function(queueItem, response, callback) {
    const mimeTypeSupported = [/^text\/html/i].some(function(mimeCheck) {
      return mimeCheck.test(queueItem.stateData.contentType);
    });
    callback(null, mimeTypeSupported);
  });

  crawler.on;

  if (loginInfo) {
    startAfterLogin(crawler, loginInfo, mainUrl);
  } else {
    crawler.start();
  }
}

function startAfterLogin(crawler, loginInfo, mainUrl) {
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
      if (error) {
        console.log("There is an error: ", error);
      }

      addCookieHeader(crawler, response);

      // Time for the login request!
      request.post(
        urlLib.resolve(mainUrl, loginInfo.formAction),
        {
          // We can't be sure that all of the input fields have a correct default
          // value. Maybe the user has to tick a checkbox or something similar in
          // order to log in. This is something you have to find this out manually
          // by logging in to the site in your browser and inspecting in the
          // network panel of your favorite dev tools what parameter`s are included
          // in the request.
          form: loginInfo.form,
          // We want to include the saved cookies from the last request in this
          // one as well
          jar: true
        },
        function(error, response, body) {
          // That should do it! We're now ready to start the crawler
          if (error) {
            console.log("There is an error: ", error);
          } else {
            const nextPage = response.headers.location;
            addCookieHeader(crawler, response);
            if (nextPage) {
              const nextUrl = mainUrl.replace(/\/[^\/]*$/, "/" + nextPage);
              crawler.queueURL(nextUrl);
            }

            crawler.start();
          }
        }
      );
    }
  );
}

function getCookies(crawler, url) {
  let cookiesRes = [];
  crawler.cookies.cookies.forEach(cookie => {
    if (cookie.value != 'deleted' && (cookie.domain === '*' || url.contains(cookie.domain))) {
      cookiesRes.push(cookie)
    }
  });
  return cookiesRes;
}

function addCookieHeader(crawler, response) {
  if (response && response.headers && response.headers["set-cookie"]) {
    crawler.cookies.addFromHeaders(response.headers["set-cookie"]);
  }
}

function setConfig(config) {
  crawler_config = config;
}

function createHash(queueItem) {
  return crypto
    .createHash("md5")
    .update(`${queueItem.url}${queueItem.stateData.contentLength}`)
    .digest("hex");
}

// loginInfo = {
//   form: {
//     login: "bee",
//     password: "bug",
//     security: 0,
//     form: "submit"
//   },
//   formAction: "login.php"
// }
// startCrawl("http://192.168.64.2/bWAPP/login.php", loginInfo);

// {
//   "url": "http://192.168.64.2/bWAPP/login.php",
//   "loginInfo": {
//     "form": {
//     "login": "bee",
//     "password": "bug",
//     "security": 0,
//     "form": "submit"
//   },
//   "formAction": "login.php"
//   }
// }

module.exports = {
  eventEmitter: new events.EventEmitter(),
  startCrawl,
  setConfig,
  EVENTS
};
