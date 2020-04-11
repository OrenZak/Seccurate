const Crawler = require('simplecrawler'),
    config = require('../config'),
    events = require('events'),
    request = require('request'),
    extractDomain = require('./utils').extractDomain;

let crawler_config = config.crawler;

const EVENTS = {
  PAGE_FETCHED: 'page_fetched',
  CRAWLER_DONE: 'crawler_done'
};

const AuthenticationTypes = {
  COOKIE: 'Cookie',
  BASIC_AUTH: 'BasicAuth',
  NONE: null
};

function doEmit(action, mainUrl, data) {
  module.exports.eventEmitter.emit(action, { mainUrl: mainUrl, data: data });
}

function startCrawl(mainUrl, loginInfo) {
  let count = 0;
  const crawler = Crawler(mainUrl);
  crawler.interval = crawler_config.interval;
  crawler.maxDepth = crawler_config.maxDepth;
  crawler.maxConcurrency = crawler_config.maxConcurrency;
  crawler.timeout = crawler_config.timeout;
  crawler.decodeResponses = true;
  crawler.parseHTMLComments = false;
  crawler.allowInitialDomainChange = false;
  crawler.parseScriptTags = true;
  crawler.respectRobotsTxt = false;
  crawler.filterByDomain = true;
  crawler.scanSubdomains = false;
  crawler.userAgent =
      'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/534.34 (KHTML, like Gecko) Chrome/53.0.2785.113 Safari/534.34';
  // crawler.downloadUnsupported = false;

  crawler.on('fetchcomplete', function(queueItem, responseBuffer, response) {
    console.log(`New page: ${queueItem.url}`);
    count += 1;
    const urlCookies = getCookies(crawler, queueItem.url);
    doEmit(EVENTS.PAGE_FETCHED, mainUrl, {
      url: queueItem.url,
      value: urlCookies,
      type: getAuthType(loginInfo),
    });
  });

  crawler.on('complete', function() {
    console.log(`Crawling completed and found ${count} pages`);
    doEmit(EVENTS.CRAWLER_DONE, mainUrl);
  });

  crawler.addFetchCondition(function(queueItem, referrerQueueItem, callback) {
    callback(null, queueItem.depth < crawler.maxDepth);
  });

  crawler.addDownloadCondition(function(queueItem, response, callback) {
    const mimeTypeSupported = [/^text\/html/i].some(function(mimeCheck) {
      return mimeCheck.test(queueItem.stateData.contentType);
    });
    console.log("mime: ", mimeTypeSupported, queueItem.stateData.contentType);
    callback(null, mimeTypeSupported);
  });

  switch (getAuthType(loginInfo)) {
    case AuthenticationTypes.COOKIE:
      crawler.acceptCookies = true;
      startAfterLogin(crawler, loginInfo, mainUrl);
      break;
    case AuthenticationTypes.BASIC_AUTH:
      crawler.needsAuth = true;
      crawler.authUser = loginInfo.form.username;
      crawler.authPass = loginInfo.form.password;
    default:
      crawler.start();
  }
}

function startAfterLogin(crawler, loginInfo, mainUrl) {
  request(
      loginInfo.formAction,
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
          console.log('There is an error: ', error);
        }

        addCookieHeader(crawler, response);

        // Time for the login request!
        // const resolved = urlLib.resolve(loginUrl, loginInfo.formAction);
        // console.log(' Resoved : ', resolved);
        request.post(
            loginInfo.formAction,
            // urlLib.resolve(loginUrl, loginInfo.formAction),
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
              // console.log('sec req', response);
              if (error) {
                console.log('There is an error: ', error);
              } else {
                const nextPage = response.headers.location;
                addCookieHeader(crawler, response);
                if (nextPage) {
                  const nextUrl = mainUrl + '/' + nextPage;
                  console.log('Crawler login succeed, adding to queue: ', nextUrl);
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
    if (
        cookie.value != 'deleted' &&
        (cookie.domain === '*' || url.includes(cookie.domain))
    ) {
      if (cookie.domain === '*') {
        cookie.domain = extractDomain(url);
      }
      cookiesRes.push(cookie);
    }
  });
  return cookiesRes;
}

function addCookieHeader(crawler, response) {
  if (response && response.headers && response.headers['set-cookie']) {
    crawler.cookies.addFromHeaders(response.headers['set-cookie']);
    console.log('The cookie is', response.headers['set-cookie']);
  }
}

function setConfig(config) {
  crawler_config = config;
  console.log('Crawler config: \n', crawler_config);
}

function getAuthType(loginInfo) {
  if (loginInfo === undefined || loginInfo.authenticationType === undefined) {
    return AuthenticationTypes.None;
  } else {
    return loginInfo.authenticationType;
  }
}

// const loginInfoCookie = {
//     authenticationType: 'Cookie',
// 	form: {
// 		login: 'bee',
// 		password: 'bug',
// 		security_level: 0,
// 		form: 'submit',
// 	},
// 	formAction: 'http://192.168.64.2/bWAPP/login.php',
// };
// startCrawl('http://192.168.64.2/bWAPP', loginInfoCookie);

// const loginInfoBasicAuth = {
//   authenticationType: 'BasicAuth',
//   form: {
//     username: 'test',
//     password: '123qwe'
//   },
//   formAction: 'http://192.168.56.101'
// };
// startCrawl('http://192.168.56.101', loginInfoBasicAuth);

// None Auth
// startCrawl('http://192.168.56.102');
// startCrawl('https://www.crawler-test.com/');

module.exports = {
  eventEmitter: new events.EventEmitter(),
  startCrawl,
  setConfig,
  EVENTS
};