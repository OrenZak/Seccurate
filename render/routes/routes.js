const puppeteer = require('puppeteer');
let express = require("express");
let router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended: false}));

const PATHS = {
    HOME: "/",
    RENDER:"/render"
};

router.get(PATHS.HOME, function (req, res, next) {
    res.status(200).send('<h1>Welcome to Render Service</h1>');
});

router.post(PATHS.RENDER, function (req, res, next) {
    let data = req.body;
    //console.log(data);
    (async () => {
        const browser = await puppeteer.launch({executablePath: process.env.CHROMIUM_PATH,
            args: ['--no-sandbox']});
        const page = await browser.newPage();
        await page.setContent(data.content);
        let bodyHTML = await page.evaluate(() => document.body.innerHTML);
        res.status(200).send({result:bodyHTML});
        console.log(bodyHTML);
        await browser.close();
    })();

});

function setServer(httpServer) {


}


// Default error handling
router.use('*', function (req, res, next) {
    res.status(500).send({status: 500, message: 'bad path', type: 'internal'});
});

module.exports = {router, setServer};
