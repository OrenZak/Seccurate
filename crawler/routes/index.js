var express = require("express");
var router = express.Router();
const crawler = require("../src/crawler");

/* GET start Crawler */
router.get("/crawl", function(req, res, next) {
  const mainUrl = req.query.url;
  crawler.startCrawl(mainUrl);
  res.render("index", { title: `Crawler started on: ${mainUrl}` });
});

router.post("/scan_config ", function(req, res, next) {
  try {
    const config = {
      'interval':  req.query.interval || 2000, // 2 seconds
      'maxConcurrency': req.query.maxConcurrency || 3,
      'maxDepth': req.query.maxDepth || 3
    };
    crawler.setConfig(config);
    res.sendStatus(200);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
