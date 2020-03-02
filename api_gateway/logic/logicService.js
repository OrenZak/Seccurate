//import {VULNERABILITY_MICROSERVICE_REST} from "../common/globals";

let VULNERABILITY_MICROSERVICE_REST = require('../common/globals')
    .VULNERABILITY_MICROSERVICE_REST;

const https = require('https');
const request = require('request');
const globals = require('../common/globals');
let socketManager = require('./socketManager');
let CrawlerConfigScanBoundary = require('./boundaries/crawlerConfigScanBoundary');
let VulnerabilityConfigScanBoundary = require('./boundaries/vulnerabilityConfigBoundary');
let VulnerabilityGetResultsRequestBoundary = require('./boundaries/vulnerabilityGetResultsRequestBoundary');
let SavedConfigurarionDao = require('../dao/savedScanConfigurationCRUD');
let ScansDao = require('../dao/scansCRUD');
let UsersDao = require('../dao/usersCRUD');
let SavedConfigEntity = require('../data/SavedConfigurationEntity');
let ScanEntity = require('../data/scanEntity');
let TargetEntity = require('../data/TargetEntity');
let CompletedScanEntity = require('../data/CompletedScanEntity');
let UsersEntity = require('../data/userEntity');
let bcrypt = require('bcrypt-nodejs');

let currentID;
let saltRounds = 10;
let dbName = 'test';
let scansDao = new ScansDao(dbName);
let usersDao = new UsersDao(dbName);
let savedConfigDao = new SavedConfigurarionDao(dbName);

class LogicService {
    constructor(server) {
        console.log('created');
    }

    startSocketListen(server) {
        try {
            socketManager.start(server, this.scanDoneCallback);
        } catch (error) {
            throw error;
        }
    }

    scanDoneCallback() {
        console.log('entered scan Done Callback with ' + currentID);
        scansDao.updateScanFinished(currentID, (err, result) => {
            if (!err) {
                console.log('scan finished');
                currentID = null;
            }
        });
    }

    async updateScanTarget(
        interval,
        maxDepth,
        timeout,
        scanType,
        url,
        loginInfo,
        name,
        description,
        scanID
    ) {
        try {
           // let dbName = 'test';
            //let scansDao = new ScansDao(dbName);
            let scanEntity = new ScanEntity(
                name,
                scanID,
                description,
                null,
                maxDepth,
                timeout,
                interval,
                scanType,
                false,
                JSON.stringify(loginInfo),
                url
            );
            scansDao.updateValue(scanEntity);
        } catch (error) {
            throw error;
        }
    }

    async scanTarget(
        interval,
        maxDepth,
        timeout,
        scanType,
        url,
        loginInfo,
        name,
        description
    ) {
        try {
            //let dbName = 'test';
            //let scansDao = new ScansDao(dbName);
            let pageTableID =
                new Date()
                    .toString()
                    .split(' ')
                    .join('')
                    .split('(')
                    .join('')
                    .split(')')
                    .join('')
                    .split(':')
                    .join('')
                    .split('+')
                    .join('') + Math.floor(Math.random() * 100000);
            let scanID = Date.now();
            let scanEntity = new ScanEntity(
                name,
                scanID,
                description,
                pageTableID,
                maxDepth,
                timeout,
                interval,
                scanType,
                false,
                JSON.stringify(loginInfo),
                url
            );
            scansDao.insertValue(scanEntity);
            return scanID;
        } catch (error) {
            console.log('In logic servic: ' + error);
            throw error;
        }
    }

    async deleteTarget(scanID) {
        try {
            //let dbName = 'test';
            //let scansDao = new ScansDao(dbName);
            scansDao.deleteValue(scanID);
        } catch (error) {
            throw error;
        }
    }

    async getTargets(page, size, callback) {
        try {
            //let dbName = 'test';
            //let scansDao = new ScansDao(dbName);
            scansDao.getAllNotCompleted(
                (err, results) => {
                    if (err) {
                        throw err;
                    } else {
                        let scans = [];
                        results.forEach(element => {
                            let curEntity = new TargetEntity(
                                element['name'],
                                element['scanID'],
                                element['description'],
                                element['maxDepth'],
                                element['timeout'],
                                element['interval_crawler'],
                                element['scanType'],
                                element['loginInfo'],
                                element['url']
                            );
                            scans.push(curEntity);
                        });
                        callback(scans);
                    }
                },
                page,
                size
            );
        } catch (error) {
            throw error;
        }
    }

    async startCrawl(id) {
        try {
            if(currentID == null) {
                currentID = id;
                //let dbName = 'test';
                //let scansDao = new ScansDao(dbName);
                scansDao.getValue(id, (err, value) => {
                  if (err) {
                    throw err;
                  } else {
                    let config = {
                      interval: value[0]['interval_crawler'],
                      maxDepth: value[0]['maxDepth'],
                      timeout: value[0]['timeout']
                    };
                    let crawlerConfigBoundary = new CrawlerConfigScanBoundary(
                        config,
                        value[0]['scanType'],
                        value[0]['url'],
                        JSON.parse(value[0]['loginInfo'])
                    );
                    let vulnerabilityConfigBoundary = new VulnerabilityConfigScanBoundary(
                        globals.VULN_TABLE_PREFIX + value[0]['scanID'],
                        value[0]['scanType'],
                        value[0]['url'],
                        JSON.parse(value[0]['loginInfo'])
                    );
                    // INIT vulnerability micro service scan configuration
                    socketManager.configDatabase(vulnerabilityConfigBoundary);
                    console.log('config vulnerability database before scan');
                    socketManager.startCrawl(crawlerConfigBoundary, id);
                    console.log('crawler starts');
                  }
                });
              }
              else{
                throw "Scan already in progress";
              }
        } catch (error) {
            throw error;
        }
    }

    async getResults(scanID, callback) {
        let vulnerabilityGetResultsRequestBoundary = new VulnerabilityGetResultsRequestBoundary(
            scanID
        );
        var options = {
            uri: VULNERABILITY_MICROSERVICE_REST + '/get_results',
            method: 'POST',
            json: {
                scanID:
                    globals.VULN_TABLE_PREFIX +
                    vulnerabilityGetResultsRequestBoundary.ScanID
            }
        };
        request(options, (error, res, body) => {
            if (error) {
                console.error(error);
                throw error;
                //return error;
            }
            console.log(`statusCode: ${res.statusCode}`);
            console.log(body);
            callback(body);
        });
    }

    async login(username, password, callback) {
        //let dbName = 'test';
        //let usersDao = new UsersDao(dbName);
        usersDao.getValue(username, (err, results) => {
            if (err) {
                console.log(err);
                callback(null);
            } else {
                // check if user exist
                if (results.length === 1) {
                    // user exists
                    let userEntity = new UsersEntity(
                        results[0]['username'],
                        results[0]['salt'],
                        results[0]['passwordHash'],
                        results[0]['admin']
                    );
                    if (bcrypt.compareSync(password, userEntity.passwordHash)) {
                        // true
                        callback(userEntity);
                    } else {
                        // false, bad password
                        callback(false);
                    }
                } else {
                    // user does not exists
                    callback(null);
                }
            }
        });
    }

    async register(username, password, role, callback) {
        if (!username.trim() || !password.trim()) {
            callback(false);
        }
        else {
        //let dbName = 'test';
        //let usersDao = new UsersDao(dbName);
            usersDao.getValue(username, (err, results) => {
                if (err) {
                    console.log(err);
                    callback(null);
                } else {
                    // check if user exist
                    if (results.length == 1) {
                        // user exists
                        callback(false);
                    } else {
                        let isAdmin = false;
                        if (role == 'ADMIN') {
                            isAdmin = true;
                        }
                        let salt = bcrypt.genSaltSync(saltRounds);
                        let hash = bcrypt.hashSync(password, salt);
                        let userEntity = new UsersEntity(username, salt, hash, isAdmin);
                        // store user in the db
                        usersDao.insertValue(userEntity, (err, newUser) => {
                            if (err) {
                                console.log(err);
                            } else {
                                callback(newUser);
                            }
                        });
                    }
                }
            });
        }
    }

    async getAllUsers(callback) {
        //let dbName = 'test';
        //let usersDao = new UsersDao(dbName);
        usersDao.getAll(
            (err, results) => {
                if (err) {
                    callback(null);
                } else {
                    callback(results);
                }
            },
            0,
            200
        );
    }

    async updateUser(username, role, callback) {
        if (!username.trim()) {
            callback(null);
            return;
        }
        else {
            //let dbName = 'test';
            //let usersDao = new UsersDao(dbName);
            // check if user exist
            usersDao.getValue(username, (err, results) => {
                if (err) {
                    console.log(err);
                    callback(null);
                } else {
                    // check if user exist
                    if (results.length == 1) {
                        // user exists
                        let isAdmin = false;
                        if (role === 'ADMIN') {
                            isAdmin = true;
                        }
                        let userEntity = new UsersEntity(username, '', '', isAdmin);
                        // store user in the db
                        let newUser = usersDao.updateValue(userEntity, (err2, results2) => {
                            if (err) {
                                console.log(err);
                                callback(null);
                            } else {
                                callback(newUser);
                            }
                        });
                    } else {
                        callback(false);
                    }
                }
            });
        }
    }

    async deleteUser(username, callback) {
        //let dbName = 'test';
        //let usersDao = new UsersDao(dbName);
        // check if user exist
        console.log('');
        usersDao.getValue(username, (err, results) => {
            if (err) {
                console.log(err);
                callback(null);
            } else {
                // check if user exist
                if (results.length == 1) {
                    usersDao.deleteValue(username, err => {
                        if (err) {
                            callback(null);
                        } else {
                            // user deleted
                            callback(true);
                        }
                    });
                } else {
                    // user does not exists
                    callback(false);
                }
            }
        });
    }

    async newSavedConfig(name = null, interval, maxDepth, timeout) {
        try {
            //let dbName = 'test';
            //let savedConfigDao = new SavedConfigurarionDao(dbName);
            let savedConfigEntity = new SavedConfigEntity(
                null,
                name,
                maxDepth,
                timeout,
                interval
            );
            let newEntity = savedConfigDao.insertValue(savedConfigEntity);
            return newEntity.getID();
        } catch (error) {
            throw error;
        }
    }

    async updateSavedConfig(id, name, interval, maxDepth, timeout) {
        try {
            //let dbName = 'test';
            //let savedConfigDao = new SavedConfigurarionDao(dbName);
            let configEntity = new SavedConfigEntity(
                id,
                name,
                maxDepth,
                timeout,
                interval
            );
            savedConfigDao.updateValue(configEntity);
            return;
        } catch (error) {
            throw error;
        }
    }

    async deleteSavedConfig(id) {
        try {
            //let dbName = 'test';
            //let savedConfigDao = new SavedConfigurarionDao(dbName);
            savedConfigDao.deleteValue(id);
        } catch (error) {
            throw error;
        }
    }

    async getSavedConfigs(page, size, callback) {
        try {
            //let dbName = 'test';
            //let savedConfigDao = new SavedConfigurarionDao(dbName);
            savedConfigDao.getAll(
                (err, results) => {
                    if (err) {
                        throw err;
                    } else {
                        let savedConfigs = [];
                        results.forEach(element => {
                            let curEntity = new SavedConfigEntity(
                                element['id'],
                                element['name'],
                                element['maxDepth'],
                                element['timeout'],
                                element['interval_crawler']
                            );
                            savedConfigs.push(curEntity);
                        });
                        callback(savedConfigs);
                    }
                },
                page,
                size
            );
        } catch (error) {
            throw error;
        }
    }

    async getCompletedScans(page, size, callback) {
        try {
            //let dbName = 'test';
            //let scansDao = new ScansDao(dbName);
            scansDao.getAllCompleted(
                (err, results) => {
                    if (err) {
                        throw err;
                    } else {
                        let scans = [];
                        results.forEach(element => {
                            let curEntity = new CompletedScanEntity(
                                element['name'],
                                element['scanID'],
                                element['description'],
                                element['maxDepth'],
                                element['timeout'],
                                element['interval_crawler'],
                                element['scanType'],
                                element['url']
                            );
                            scans.push(curEntity);
                        });
                        callback(scans);
                    }
                },
                page,
                size
            );
        } catch (error) {
            throw error;
        }
    }

    async getCompletedScansCount(callback) {
        try {
            //let dbName = 'test';
            //let scansDao = new ScansDao(dbName);
            scansDao.getCompletedCount((err, count) => {
                if (err) {
                    throw err;
                } else {
                    callback(count);
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async getTargetsCount(callback) {
        try {
            //let dbName = 'test';
            //let scansDao = new ScansDao(dbName);
            scansDao.getNotCompletedCount((err, count) => {
                if (err) {
                    throw err;
                } else {
                    callback(count);
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async getConfigsCount(callback) {
        try {
            //let dbName = 'test';
            //let savedConfigDao = new SavedConfigurarionDao(dbName);
            savedConfigDao.getValueCount((err, count) => {
                if (err) {
                    throw err;
                } else {
                    callback(count);
                }
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = LogicService;
