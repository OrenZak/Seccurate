let express = require('express');
let router = express.Router();
let LogicService = require('../logic/logicService');
let logicService = new LogicService();
let NewTargetBoundary = require('../layout/boundaries/newTargetBoundary');
let NewSavedConfigurationBoundary = require('../layout/boundaries/newSavedConfigurationBoundary');
let UpdateScanTargetBoundary = require('../layout/boundaries/targetBoundary');
let UpdateSavedConfigBoundary = require('../layout/boundaries/savedConfigurationBoundary');
let StartCrawlBoundary = require('../layout/boundaries/startCrawlBoundary');
let GetCompletedScansBoundary = require('../layout/boundaries/getCompletedScansBoundary');
let GetConfigsBoundary = require('../layout/boundaries/getConfigsBoundary');
let GetTargetsBoundary = require('../layout/boundaries/getTargetsBoundary');
let DeleteScanBoundary = require('../layout/boundaries/deleteBoundary');
let UsersBoundary = require('../layout/boundaries/userBoundary');
let LoginBoundary = require('../layout/boundaries/loginBoundary');

let session = require('express-session');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');

router.use(express.json());
//router.use(express.urlencoded({extended: false}));
// initialize body-parser to parse incoming parameters requests to req.body
router.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser.
router.use(cookieParser());
router.use(
  session({
    key: 'user_sid',
    secret: 'NkoeH#&XN&7+M4$',
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
      httpOnly: false
    }
  })
);

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
router.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
});

const PATHS = {
  HOME: '/',
  START_SCAN: '/start_scan',
  CONFIG_TARGET: '/config_target',
  GET_COMPLETED_SCANS: '/completed_scans',
  LOGIN: '/login',
  LOGOUT: '/logout',
  USERS: '/users',
  MANAGE_USERS: '/manage_users',
  GET_RESULTS: '/results',
  SAVED_CONFIG: '/saved_config',
  CONFIGS_COUNT: '/config_count',
  TARGETS_COUNT: '/targets_count',
  COMPLETED_SCANS_COUNT: '/completed_scans_count'
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

router.get(PATHS.CONFIGS_COUNT, async function(req, res, next) {
  try {
    await logicService.getConfigsCount(count => {
      res.status(200).send({ results: count });
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get(PATHS.TARGETS_COUNT, async function(req, res, next) {
  try {
    await logicService.getTargetsCount(count => {
      res.status(200).send({ results: count });
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get(PATHS.COMPLETED_SCANS_COUNT, async function(req, res, next) {
  try {
    await logicService.getCompletedScansCount(count => {
      res.status(200).send({ results: count });
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get(PATHS.GET_COMPLETED_SCANS, function(req, res, next) {
  try {
    logicService.getCompletedScans(req.query.page, req.query.size, scans => {
      let scansResponseBoundary = new GetCompletedScansBoundary(scans);
      console.log('Scans count: ', scans.length);
      res.status(200).send({ results: scansResponseBoundary });
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post(PATHS.START_SCAN, async function(req, res, next) {
  try {
    crawlBoundary = StartCrawlBoundary.deserialize(req.body);
    await logicService.startCrawl(crawlBoundary.id);
    res.status(200).send({ results: 'started crawling' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post(PATHS.CONFIG_TARGET, async function(req, res, next) {
  try {
    let scanConfigBoundary = NewTargetBoundary.deserialize(req.body);
    let result = await logicService.scanTarget(
      scanConfigBoundary.config.interval,
      scanConfigBoundary.config.maxDepth,
      scanConfigBoundary.config.timeout,
      scanConfigBoundary.scanType,
      scanConfigBoundary.url,
      scanConfigBoundary.loginInfo,
      scanConfigBoundary.name,
      scanConfigBoundary.description
    );
    res.status(200).send({ results: result });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.put(PATHS.CONFIG_TARGET, async function(req, res, next) {
  try {
    scanConfigBoundary = UpdateScanTargetBoundary.deserialize(req.body);
    let result = await logicService.updateScanTarget(
      scanConfigBoundary.config.interval,
      scanConfigBoundary.config.maxDepth,
      scanConfigBoundary.config.timeout,
      scanConfigBoundary.scanType,
      scanConfigBoundary.url,
      scanConfigBoundary.loginInfo,
      scanConfigBoundary.name,
      scanConfigBoundary.description,
      scanConfigBoundary.scanID
    );
    res.status(200).send({ results: result });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete(PATHS.CONFIG_TARGET, async function(req, res, next) {
  try {
    deleteBoundary = DeleteScanBoundary.deserialize(req.body);
    let result = await logicService.deleteTarget(deleteBoundary.ID);
    res.status(200).send({ results: result });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get(PATHS.CONFIG_TARGET, async function(req, res, next) {
  try {
    logicService.getTargets(req.query.page, req.query.size, scans => {
      let targetsBoundary = new GetTargetsBoundary(scans);
      res.status(200).send({ results: targetsBoundary });
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post(PATHS.LOGIN, function(req, res, next) {
  try {
    let loginBoundary = LoginBoundary.deserialize(req.body);
    if (req.session.user && req.cookies.user_sid) {
      res.status(500).send({ error: 'Already logged in' });
    } else {
      let isUser = logicService.login(
        loginBoundary.username,
        loginBoundary.password,
        user => {
          if (user == null) {
            res.status(500).send({ error: 'Bad username/password' });
          } else if (!user) {
            res.status(500).send({ error: 'Bad username/password' });
          } else {
            req.session.user = user;
            res.status(200).send({ results: { isAdmin: user.admin === 1 } });
          }
        }
      );
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post(PATHS.LOGOUT, function(req, res, next) {
  try {
    if (req.session.user && req.cookies.user_sid) {
      res.clearCookie('user_sid');
      res.status(200).send({ results: 'logged out' });
    } else {
      res.status(500).send({ error: 'Login first' });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post(PATHS.MANAGE_USERS, function(req, res, next) {
  try {
    let usersBoundary = UsersBoundary.deserialize(req.body);
    logicService.register(
      usersBoundary.username,
      usersBoundary.password,
      usersBoundary.role,
      user => {
        if (user == null) {
          res.status(500).send({ error: 'something bad happened' });
        } else if (user == false) {
          res
            .status(500)
            .send({ error: 'choose another username or password' });
        } else {
          res.status(200).send({ results: 'registered' });
        }
      }
    );
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete(PATHS.MANAGE_USERS, function(req, res, next) {
  try {
    if (req.session.user && req.cookies.user_sid) {
      if (req.session.user.admin == 1) {
        logicService.deleteUser(req.query.userName, result => {
          if (result == null) {
            res.status(500).send({ error: 'something bad happened' });
          } else if (result == false) {
            res.status(500).send({ error: 'username does not exists' });
          } else {
            res.status(200).send({ results: 'user deleted' });
          }
        });
      }
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.put(PATHS.MANAGE_USERS, function(req, res, next) {
  try {
    if (req.session.user && req.cookies.user_sid) {
      if (req.session.user.admin == 1) {
        let usersBoundary = UsersBoundary.deserializeWithNoPassword(req.body);
        let user = logicService.updateUser(
          usersBoundary.username,
          usersBoundary.role,
          user => {
            if (user == null) {
              res.status(500).send({ error: 'something bad happened' });
            } else if (user == false) {
              res.status(500).send({ error: 'username does not exists' });
            } else {
              res.status(200).send({ results: 'updated' });
            }
          }
        );
      } else {
        res
          .status(200)
          .send({ results: 'This method can be performed only by admin' });
      }
    } else {
      res
        .status(200)
        .send({ results: 'This method can be performed only by admin' });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get(PATHS.USERS, function(req, res, next) {
  try {
    if (req.session.user && req.cookies.user_sid) {
      if (req.session.user.admin == 1) {
        logicService.getAllUsers(
          req.query.page,
          req.query.size,
          usersEntity => {
            if (usersEntity == null) {
              res.status(200).send({ results: 'something bad happened' });
            } else {
              let usersArray = [];
              usersEntity.forEach(user => {
                let roleName = 'USER';
                if (user['admin'] == 1) {
                  roleName = 'ADMIN';
                }
                usersArray.push({
                  username: user['username'],
                  role: roleName
                });
              });
              res.status(200).send({ results: usersArray });
            }
          }
        );
      } else {
        res
          .status(401)
          .send({ error: 'This method can be performed only by admin' });
      }
    } else {
      res
        .status(401)
        .send({ error: 'This method can be performed only by admin' });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get(PATHS.GET_RESULTS, function(req, res, next) {
  try {
    logicService.getResults(req.query.scanName, results => {
      let resultsArray = [];

      results.forEach(element => {
        elem = JSON.parse(element);
        resultsArray.push({
          description: elem._VulnerabilityBoundary__description,
          name: elem._VulnerabilityBoundary__name,
          payload: elem._VulnerabilityBoundary__payload,
          affected_urls: elem._VulnerabilityBoundary__affected_urls,
          recommendations: JSON.parse(elem._VulnerabilityBoundary__recommendations),
          requestB64: elem._VulnerabilityBoundary__requestB64,
          severity: elem._VulnerabilityBoundary__severity,
          url: elem._VulnerabilityBoundary__url
        });
      });
      res.status(200).send({ results: resultsArray });
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get(PATHS.SAVED_CONFIG, async function(req, res, next) {
  try {
    logicService.getSavedConfigs(req.query.page, req.query.size, configs => {
      let configsBoundary = new GetConfigsBoundary(configs);
      res.status(200).send({ results: configsBoundary });
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post(PATHS.SAVED_CONFIG, async function(req, res, next) {
  try {
    let scanConfigBoundary = NewSavedConfigurationBoundary.deserialize(
      req.body
    );
    let result = await logicService.newSavedConfig(
      scanConfigBoundary.name,
      scanConfigBoundary.interval,
      scanConfigBoundary.maxDepth,
      scanConfigBoundary.timeout,
      (err, result) => {
        if (err != null) {
          res.status(500).send({ error: err.message });
        } else {
          res.status(200).send({ results: result });
        }
      }
    );
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.put(PATHS.SAVED_CONFIG, async function(req, res, next) {
  try {
    let scanConfigBoundary = UpdateSavedConfigBoundary.deserialize(req.body);
    let result = await logicService.updateSavedConfig(
      scanConfigBoundary.id,
      scanConfigBoundary.name,
      scanConfigBoundary.interval,
      scanConfigBoundary.maxDepth,
      scanConfigBoundary.timeout,
      (err, result) => {
        if (err) {
          res.status(500).send({ error: err.message });
        } else {
          res.status(200).send({ results: result });
        }
      }
    );
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete(PATHS.SAVED_CONFIG, async function(req, res, next) {
  try {
    let deleteBoundary = DeleteScanBoundary.deserialize(req.body);
    let result = await logicService.deleteSavedConfig(deleteBoundary.ID);
    res.status(200).send({ results: result });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

function setServer(httpServer) {
  logicService.startSocketListen(httpServer);
}

// route for handling 404 requests(unavailable routes)
router.use(function(req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

module.exports = { router, setServer };
