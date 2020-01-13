//import {VULNERABILITY_MICROSERVICE_REST} from "../common/globals";

let VULNERABILITY_MICROSERVICE_REST = require("../common/globals").VULNERABILITY_MICROSERVICE_REST;

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
let UsersEntity = require('../data/userEntity');
let bcrypt = require('bcrypt');

let currentID;
let saltRounds = 10;

class LogicService {

    constructor(server) {
        console.log('created');

    }

    startSocketListen(server) {
        socketManager.start(server, this.scanDoneCallback);
    }

    scanDoneCallback() {
        console.log('entered scan Done Callback with ' + currentID);
        let dbName = 'test';
        let scansDao = new ScansDao(dbName);
        scansDao.updateScanFinished(currentID, (err, result) => {
            if (!err) {
                console.log('dont completing scan at db');
            }
        });

    }

    async updateScanTarget(interval, maxConcurrency, maxDepth, timeout, scanType, url, loginInfo, name, description, target_id) {
        let dbName = 'test';
        let scansDao = new ScansDao(dbName);
        let scanEntity = new ScanEntity(name, target_id, description, null, maxDepth, timeout, interval, maxConcurrency, scanType, false, JSON.stringify(loginInfo), url)
        scansDao.updateValue(scanEntity);
    }

    async scanTarget(interval, maxConcurrency, maxDepth, timeout, scanType, url, loginInfo, name, description) {
        let dbName = 'test';
        let scansDao = new ScansDao(dbName);
        let pageTableID = new Date().toString().split(' ').join('').split('(').join('').split(')').join('').split(':').join('').split('+').join('') + Math.floor(Math.random() * 100000);
        let timestamp = Date.now();
        let scanEntity = new ScanEntity(name, timestamp, description, pageTableID, maxDepth, timeout, interval, maxConcurrency, scanType,
            false, JSON.stringify(loginInfo), url);
        scansDao.insertValue(scanEntity);
        return timestamp;
    }

    async deleteTarget(id) {
        let dbName = 'test';
        let scansDao = new ScansDao(dbName);
        scansDao.deleteValue(id);
    }

    async getTargets(page, size, callback) {
        let dbName = 'test';
        let scansDao = new ScansDao(dbName);
        scansDao.getAllNotCompleted((err, results) => {
            if (err) {
                console.log(err);
            } else {
                let scans = [];
                results.forEach(element => {
                    let curEntity = new ScanEntity(element['name'], element['scan_timestamp'], element['description'], element['pageTableName'], element['maxDepth'], element['timeout'], element['interval_crawler'], element['vulnsScanned'], element['done'], element['credentials'], element['loginPage']);
                    scans.push(curEntity);
                });
                callback(scans);
            }
        }, page, size);
    }

    async startCrawl(id) {
        currentID = id;
        let dbName = 'test';
        let scansDao = new ScansDao(dbName);
        scansDao.getValue(id, (err, value) => {
            if (err) {
                console.log(err);
            } else {
                let config = {
                    interval: value[0]["interval_crawler"],
                    maxConcurrency: value[0]["maxConcurrency"],
                    maxDepth: value[0]["maxDepth"],
                    timeout: value[0]["timeout"]
                };
                let crawlerConfigBoundary = new CrawlerConfigScanBoundary(config, value[0]["vulnsScanned"], value[0]["loginPage"], JSON.parse(value[0]["credentials"]));
                let vulnerabilityConfigBoundary = new VulnerabilityConfigScanBoundary(globals.VULN_TABLE_PREFIX + value[0]["scan_timestamp"], value[0]["vulnsScanned"], value[0]["loginPage"], JSON.parse(value[0]["credentials"]));
                // INIT vulnerability micro service scan configuration
                socketManager.configDatabase(vulnerabilityConfigBoundary);
                console.log("config vulnerability database before scan");
                socketManager.startCrawl(crawlerConfigBoundary, id);
                console.log("crawler starts")
            }
        });
    }

    async getResults(scanName, callback) {
        let vulnerabilityGetResultsRequestBoundary = new VulnerabilityGetResultsRequestBoundary(scanName);
        var options = {
            uri: VULNERABILITY_MICROSERVICE_REST + "/get_results",
            method: 'POST',
            json: {
                scanName: globals.VULN_TABLE_PREFIX + vulnerabilityGetResultsRequestBoundary.ScanName
            }
        };
        request(options, (error, res, body) => {
            if (error) {
                console.error(error);
                return error;
            }
            console.log(`statusCode: ${res.statusCode}`);
            console.log(body);
            callback(body);
        });
    }

    async login(username, password, callback) {
        let dbName = 'test';
        let usersDao = new UsersDao(dbName);
        usersDao.getValue(username, (err, results) => {
            if (err) {
                console.log(err);
                callback(null);
            } else {
                // check if user exist
                if (results.length == 1) {
                    // user exists
                    let userEntity = new UsersEntity(results[0]["username"], results[0]["salt"], results[0]["passwordHash"], results[0]["admin"]);
                    if (bcrypt.compareSync(password, userEntity.passwordHash)) {
                        // true
                        callback(results);
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
        let dbName = 'test';
        let usersDao = new UsersDao(dbName);
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
                    if (role == "ADMIN") {
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

    async getAllUsers(callback) {
        let dbName = 'test';
        let usersDao = new UsersDao(dbName);
        usersDao.getAll((err, results) => {
            if (err) {
                callback(null);
            } else {
                callback(results);
            }
        }, 0, 200)
    }

    async updateUser(username, password, role, callback) {
        if (!username.trim() || !password.trim()) {
            callback(null);
            return;
        }
        let dbName = 'test';
        let usersDao = new UsersDao(dbName);
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
                    if (role == "ADMIN") {
                        isAdmin = true;
                    }
                    let salt = bcrypt.genSaltSync(saltRounds);
                    let hash = bcrypt.hashSync(password, salt);
                    let userEntity = new UsersEntity(username, salt, hash, isAdmin);
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

    async deleteUser(username, callback) {
        let dbName = 'test';
        let usersDao = new UsersDao(dbName);
        // check if user exist
        usersDao.getValue(username, (err, results) => {
            if (err) {
                console.log(err);
                callback(null);
            } else {
                // check if user exist
                if (results.length == 1) {
                    usersDao.deleteValue(username, (err) => {
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

    async newSavedConfig(name, interval, maxConcurrency, maxDepth, timeout) {
        let dbName = 'test';
        let savedConfigDao = new SavedConfigurarionDao(dbName);
        let savedConfigEntity = new SavedConfigEntity(null, name, maxDepth, timeout, interval, maxConcurrency);
        let newEntity = savedConfigDao.insertValue(savedConfigEntity);
        return newEntity.getID();
    }

    async updateSavedConfig(id, name, interval, maxConcurrency, maxDepth, timeout) {
        let dbName = 'test';
        let savedConfigDao = new SavedConfigurarionDao(dbName);
        let configEntity = new SavedConfigEntity(id, name, maxDepth, timeout, interval, maxConcurrency);
        savedConfigDao.updateValue(configEntity);
        return;
    }

    async deleteSavedConfig(id) {
        let dbName = 'test';
        let savedConfigDao = new SavedConfigurarionDao(dbName);
        savedConfigDao.deleteValue(id);
    }

    async getSavedConfigs(page, size, callback) {
        let dbName = 'test';
        let savedConfigDao = new SavedConfigurarionDao(dbName);
        savedConfigDao.getAll((err, results) => {
            if (err) {
                console.log(err);
            } else {
                let savedConfigs = [];
                results.forEach(element => {
                    let curEntity = new SavedConfigEntity(element['id'], element['name'], element['maxDepth'], element['timeout'], element['interval_crawler'], element['maxConcurrency']);
                    savedConfigs.push(curEntity);
                });
                callback(savedConfigs);
            }
        }, page, size);
    }

    async getCompletedScans(page, size, callback) {
        let dbName = 'test';
        let scansDao = new ScansDao(dbName);
        scansDao.getAllCompleted((err, results) => {
            if (err) {
                console.log(err);
            } else {
                let scans = [];
                results.forEach(element => {
                    let curEntity = new ScanEntity(element['name'], element['scan_timestamp'], element['description'], element['pageTableName'], element['maxDepth'], element['timeout'], element['interval_crawler'], element['vulnsScanned'], element['done'], element['credentials'], element['loginPage']);
                    scans.push(curEntity);
                });
                callback(scans);
            }
        }, page, size);
    }

}

module.exports = LogicService;