var express = require("express");
var router = express.Router();
const crawler = require("../src/crawler");
const config = require("../config")

/* POST set crawler config */
router.post("/scan_config", function(req, res, next) {
  try {
    crawler.setConfig({
      'interval':  req.query.interval || config.crawler.interval,
      'maxConcurrency': req.query.maxConcurrency || config.crawler.maxConcurrency,
      'maxDepth': req.query.maxDepth || config.crawler.maxDepth,
      'timeout': req.query.timeout || config.crawler.timeout
    });
    console.log('Scan Config - 200');
    res.sendStatus(200);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
