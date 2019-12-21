//import {VULNERABILITY_MICROSERVICE_REST} from "../common/globals";

let VULNERABILITY_MICROSERVICE_REST = require("../common/globals").VULNERABILITY_MICROSERVICE_REST;

const https = require('https');
const request = require('request');
const globals = require('../common/globals');
let socketManager = require('./socketManager');
let CrawlerConfigScanBoundary = require('./boundaries/crawlerConfigScanBoundary');
let VulnerabilityConfigScanBoundary = require('./boundaries/vulnerabilityConfigBoundary');
let VulnerabilityGetResultsRequestBoundary = require('./boundaries/vulnerabilityGetResultsRequestBoundary');
let ConfigurationHistoryDao = require('../dao/scanConfigurationCRUD');
let SavedConfigurarionDao = require('../dao/savedScanConfigurationCRUD')
let ScansDao = require('../dao/scansCRUD');
let ConfigEntity = require('../data/ConfigurationEntity');
let SavedConfigEntity = require('../data/SavedConfigurationEntity')
let ScanEntity = require('../data/configEntity');

class LogicService {
    constructor(server) {
        this.configurationHistoryDao = new ConfigurationHistoryDao("test");
        console.log('created');

    }

    startSocketListen(server) {
        socketManager.start(server);
    }

    async updateScanTarget(interval, maxConcurrency, maxDepth, timeout, scanType, url, loginInfo, name, save, description, scanID, savedScanName) {
        let dbName = 'test';
        let savedConfigDao = new SavedConfigurarionDao(dbName);
        let configEntity = new ConfigEntity(scanID, maxDepth, timeout, interval, maxConcurrency, scanType, JSON.stringify(loginInfo), url);
        if (save) {
            let a = this.configurationHistoryDao.getValue(scanID, (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    let ent = new SavedConfigEntity(null, savedScanName, data[0]['maxDepth'], data[0]['timeout'], data[0]['interval_crawler'], data[0]['maxConcurrency']);
                    savedConfigDao.getIDByValue(ent, (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            let id = result[0]['id'];
                            let updatedScan = new SavedConfigEntity(id, savedScanName, maxDepth, timeout, interval, maxConcurrency);
                            savedConfigDao.updateValue(updatedScan);
                        }
                    })
                }
            });
        }
        let configHistoryValue = this.configurationHistoryDao.updateValue(configEntity);
        return;
    }

    async scanTarget(interval, maxConcurrency, maxDepth, timeout, scanType, url, loginInfo, name, save, description, savedScanName) {
        let dbName = 'test';
        let configEntity = new ConfigEntity(null, maxDepth, timeout, interval, maxConcurrency, scanType, JSON.stringify(loginInfo), url);
        let configHistoryValue = this.configurationHistoryDao.insertValue(configEntity);
        if (save) {
            let savedConfigDao = new SavedConfigurarionDao(dbName);
            let savedConfigEntity = new SavedConfigEntity(null, savedScanName, maxDepth, timeout, interval, maxConcurrency);
            savedConfigDao.insertValue(savedConfigEntity);
        }
        let scansDao = new ScansDao(dbName);
        let scanEntity = new ScanEntity(name, Date.now(), configHistoryValue.getID(), description, configHistoryValue.getID());
        scansDao.insertValue(scanEntity);
        return configHistoryValue.getID();
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
                    let curEntity = new ScanEntity(element['name'], element['scan_timestamp'], element['configuration'], element['description'], element['pageTableName']);
                    scans.push(curEntity);
                });
                callback(scans);
            }
        }, page, size);
    }

    async startCrawl(id) {
        this.configurationHistoryDao.getValue(id, (err, value) => {
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
                let vulnerabilityConfigBoundary = new VulnerabilityConfigScanBoundary(value[0]["id"], value[0]["vulnsScanned"], value[0]["loginPage"], JSON.parse(value[0]["credentials"]));
                // INIT vulnerability micro service scan configuration
                socketManager.configDatabase(vulnerabilityConfigBoundary);
                console.log("config vulnerability database before scan")
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
                scanName: vulnerabilityGetResultsRequestBoundary.ScanName
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

    async login() {

    }

    async register() {

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
                    let curEntity = new ScanEntity(element['name'], element['scan_timestamp'], element['configuration'], element['description'], element['pageTableName']);
                    scans.push(curEntity);
                });
                callback(scans);
            }
        }, page, size);
    }

}

module.exports = LogicService;