var express = require('express');
var router = express.Router();
const Crawler = require('simplecrawler')

/* GET start Crawler */
router.get('/crawl', function(req, res, next) {
  const mainUrl = req.query.url;
  res.render('index', { title: `Crawler started on: ${mainUrl}` });
  startCrawl(mainUrl)
});

const startCrawl = function (mainUrl) {
  createCrawler(mainUrl).start();
}

const createCrawler = function(mainUrl) {
  console.log('createCrawler with: ' + mainUrl);
  const crawler = Crawler(mainUrl);
  crawler.interval = 2000; // 2 seconds
  crawler.maxDepth = 10;
  crawler.maxConcurrency = 3;
  crawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
      console.log("I just received queueItem: ", queueItem.url);

  });
  return crawler;
}

module.exports = router;
