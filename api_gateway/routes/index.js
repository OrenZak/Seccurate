let express = require("express");
let router = express.Router();
let LogicService = require('./../logic/logicService');
let logicService = new LogicService();
let NewTargetBoundary = require('./../layout/boundaries/newTargetBoundary');
let NewSavedConfigurationBoundary = require('./../layout/boundaries/newSavedConfigurationBoundary');
let UpdateScanTargetBoundary = require('./../layout/boundaries/targetBoundary');
let UpdateSavedConfigBoundary = require('./../layout/boundaries/savedConfigurationBoundary');
let StartCrawlBoundary = require('./../layout/boundaries/startCrawlBoundary');
let GetCompletedScansBoundary = require('./../layout/boundaries/getCompletedScansBoundary');
let GetConfigsBoundary = require('./../layout/boundaries/getConfigsBoundary');
let GetTargetsBoundary = require('./../layout/boundaries/getTargetsBoundary');
let DeleteScanBoundary = require('./../layout/boundaries/deleteBoundary');
let UsersBoundary = require('./../layout/boundaries/userBoundary');
let LoginBoundary = require('./../layout/boundaries/loginBoundary');

let session = require('express-session');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');

router.use(express.json());
//router.use(express.urlencoded({extended: false}));
// initialize body-parser to parse incoming parameters requests to req.body
router.use(bodyParser.urlencoded({extended: true}));

// initialize cookie-parser to allow us access the cookies stored in the browser.
router.use(cookieParser());
router.use(session({
    key: 'user_sid',
    secret: 'NkoeH#&XN&7+M4$',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
router.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});

const PATHS = {
    HOME: "/",
    START_SCAN: "/start_scan",
    CONFIG_TARGET: "/config_target",
    GET_COMPLETED_SCANS: "/completed_scans",
    LOGIN: "/login",
    LOGOUT: "/logout",
    USERS: "/users",
    MANAGE_USERS: "/manage_users",
    GET_RESULTS: "/results",
    SAVED_CONFIG: "/saved_config"
};

// middleware function to check for logged-in users
let sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }
};


// route for Home-Page
router.get(PATHS.HOME, sessionChecker, (req, res) => {
    res.redirect('/login');
});

router.get(PATHS.GET_COMPLETED_SCANS, function (req, res, next) {
    logicService.getCompletedScans(req.query.page, req.query.size, (scans) => {
        let scansResponseBoundary = new GetCompletedScansBoundary(scans);
        res.status(200).send(scansResponseBoundary.serialize());
    });

});

router.post(PATHS.START_SCAN, async function (req, res, next) {
    crawlBoundary = StartCrawlBoundary.deserialize(req.body);
    logicService.startCrawl(crawlBoundary.id);
    res.status(200).send('<h1>Hello world</h1>');
});

router.post(PATHS.CONFIG_TARGET, async function (req, res, next) {
    let scanConfigBoundary = NewTargetBoundary.deserialize(req.body);
    let result = await logicService.scanTarget(scanConfigBoundary.config.interval, scanConfigBoundary.config.maxConcurrency, scanConfigBoundary.config.maxDepth, scanConfigBoundary.config.timeout, scanConfigBoundary.scanType, scanConfigBoundary.url, scanConfigBoundary.loginInfo, scanConfigBoundary.name, scanConfigBoundary.description);
    res.status(200).send({result});
});

router.put(PATHS.CONFIG_TARGET, async function (req, res, next) {
    scanConfigBoundary = UpdateScanTargetBoundary.deserialize(req.body);
    let result = await logicService.updateScanTarget(scanConfigBoundary.config.interval, scanConfigBoundary.config.maxConcurrency, scanConfigBoundary.config.maxDepth, scanConfigBoundary.config.timeout, scanConfigBoundary.scanType, scanConfigBoundary.url, scanConfigBoundary.loginInfo, scanConfigBoundary.name, scanConfigBoundary.description, scanConfigBoundary.scanID);
    res.status(200).send(result);
});

router.delete(PATHS.CONFIG_TARGET, async function (req, res, next) {
    deleteBoundary = DeleteScanBoundary.deserialize(req.body);
    let result = await logicService.deleteTarget(deleteBoundary.ID);
    res.status(200).send(result);
});

router.get(PATHS.CONFIG_TARGET, async function (req, res, next) {
    logicService.getTargets(req.query.page, req.query.size, (scans) => {
        let targetsBoundary = new GetTargetsBoundary(scans);
        res.status(200).send(targetsBoundary.serialize());
    });
});

router.post(PATHS.LOGIN, function (req, res, next) {
    let loginBoundary = LoginBoundary.deserialize(req.body);
    if (req.session.user && req.cookies.user_sid) {
        res.status(200).send("Already logged in");
    } else {
        let isUser = logicService.login(loginBoundary.username, loginBoundary.password, (user) => {
            if (user == null) {
                res.status(200).send("Bad username/password");
            } else if (!user) {
                res.status(200).send("Bad username/password");
            } else {
                req.session.user = user;
                res.status(200).send("Connected");
            }
        });
    }
});

router.post(PATHS.LOGOUT, function (req, res, next) {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.status(200).send("logged out");
    } else {
        res.status(200).send("Login first");
    }
});

router.post(PATHS.MANAGE_USERS, function (req, res, next) {
    let usersBoundary = UsersBoundary.deserialize(req.body);
    logicService.register(usersBoundary.username, usersBoundary.password, usersBoundary.role, (user) => {
        if (user == null) {
            res.status(200).send("something bad happened");
        } else if (user == false) {
            res.status(200).send("choose another username or password");
        } else {
            res.status(200).send("registered");
        }
    });
});

router.delete(PATHS.MANAGE_USERS, function (req, res, next) {
    if (req.session.user && req.cookies.user_sid) {
        if (req.session.user[0].admin == 1) {
            logicService.deleteUser(req.query.userName, (result) => {
                if (result == null) {
                    res.status(200).send("something bad happened");
                } else if (result == false) {
                    res.status(200).send("username does not exists");
                } else {
                    res.status(200).send("user deleted");
                }
            });
        }
    }
});

router.put(PATHS.MANAGE_USERS, function (req, res, next) {
    if (req.session.user && req.cookies.user_sid) {
        if (req.session.user[0].admin == 1) {
            let usersBoundary = UsersBoundary.deserialize(req.body);
            let user = logicService.updateUser(usersBoundary.username, usersBoundary.password, usersBoundary.role, (user) => {
                if (user == null) {
                    res.status(200).send("something bad happened");
                } else if (user == false) {
                    res.status(200).send("username does not exists");
                } else {
                    res.status(200).send("updated");
                }
            });
        } else {
            res.status(200).send("This method can be performed only by admin");
        }
    } else {
        res.status(200).send("This method can be performed only by admin");
    }
});

router.get(PATHS.USERS, function (req, res, next) {
    if (req.session.user && req.cookies.user_sid) {
        if (req.session.user[0].admin == 1) {
            logicService.getAllUsers((usersEntity) => {
                if (usersEntity == null) {
                    res.status(200).send("something bad happened");
                } else {
                    let usersArray = [];
                    usersEntity.forEach(user => {
                        let roleName = "USER";
                        if (user["admin"] == 1) {
                            roleName = "ADMIN";
                        }
                        usersArray.push({
                            username: user["username"],
                            role:roleName
                        });
                    });
                    res.status(200).send(usersArray);
                }
            });
        } else {
            res.status(200).send("This method can be performed only by admin");
        }
    } else {
        res.status(200).send("This method can be performed only by admin");
    }
});

router.get(PATHS.GET_RESULTS, function (req, res, next) {
    //getResultsRequestBoundary = GetResultsRequestBoundary.deserialize(req.query);
    logicService.getResults(req.query.scanName, (results) => {
        let resultsArray = [];
        results.forEach(element => {
            elem = JSON.parse(element);
            resultsArray.push({
                description: elem._VulnerabilityBoundary__description,
                name: elem._VulnerabilityBoundary__name,
                payload: elem._VulnerabilityBoundary__payload,
                recommendation: elem._VulnerabilityBoundary__recommendations,
                requestB64: elem._VulnerabilityBoundary__requestB64,
                severity: elem._VulnerabilityBoundary__severity,
                url: elem._VulnerabilityBoundary__url,
                vulnID: elem._VulnerabilityBoundary__vulnID
            })
        });
        res.status(200).send(resultsArray);
    });
});

router.get(PATHS.SAVED_CONFIG, async function (req, res, next) {
    logicService.getSavedConfigs(req.query.page, req.query.size, (configs) => {
        let configsBoundary = new GetConfigsBoundary(configs);
        res.status(200).send(configsBoundary.serialize());
    });
});

router.post(PATHS.SAVED_CONFIG, async function (req, res, next) {
    let scanConfigBoundary = NewSavedConfigurationBoundary.deserialize(req.body);
    let result = await logicService.newSavedConfig(scanConfigBoundary.name, scanConfigBoundary.interval, scanConfigBoundary.maxConcurrency, scanConfigBoundary.maxDepth, scanConfigBoundary.timeout);
    res.status(200).send(result);
});

router.put(PATHS.SAVED_CONFIG, async function (req, res, next) {
    let scanConfigBoundary = UpdateSavedConfigBoundary.deserialize(req.body);
    let result = await logicService.updateSavedConfig(scanConfigBoundary.id, scanConfigBoundary.name, scanConfigBoundary.interval, scanConfigBoundary.maxConcurrency, scanConfigBoundary.maxDepth, scanConfigBoundary.timeout);
    res.status(200).send(result);
});

router.delete(PATHS.SAVED_CONFIG, async function (req, res, next) {
    let deleteBoundary = DeleteScanBoundary.deserialize(req.body);
    let result = await logicService.deleteSavedConfig(deleteBoundary.ID);
    res.status(200).send(result);
});

function setServer(httpServer) {
    logicService.startSocketListen(httpServer);

}

// route for handling 404 requests(unavailable routes)
router.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
});

module.exports = {router, setServer};
