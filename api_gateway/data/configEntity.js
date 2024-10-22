class ConfigEntity {
    constructor(name, timestamp, description, pageTableName, maxDepth, timeout, interval, vulnsScanned, credentials=null, loginPage=null) {
        this.name = name;
        this.timestamp = timestamp;
        this.description = description;
        this.pageTableName = pageTableName;
        this.maxDepth = maxDepth;
        this.timeout = timeout;
        this.interval = interval;
        this.vulnsScanned = vulnsScanned;
        this.credentials = credentials;
        this.loginPage = loginPage;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getTimestamp() {
        return this.timestamp;
    }

    setTimestamp(timestamp) {
        this.timestamp = timestamp;
    }

    getDescription() {
        return this.description;
    }

    setDescription(description) {
        this.description = description;
    }

    getPageTableName(){
        return this.pageTableName;
    }

    setPageTableName(pageTableName){
        this.pageTableName = pageTableName;
    }

    getMaxDepth() {
        return this.maxDepth
    }

    setMaxDepth(maxDepth) {
        this.maxDepth = maxDepth
    }

    getTimeout() {
        return this.timeout
    }

    setTimeout(timeout) {
        this.timeout = timeout
    }

    getInterval() {
        return this.interval
    }

    setInterval(interval) {
        this.interval = interval
    }

    getVulnsScanned() {
        return this.vulnsScanned
    }

    setVulnsScanned(vulnsScanned) {
        this.vulnsScanned = vulnsScanned
    }

    getCredentials() {
        return this.credentials
    }

    setCredentials(credentials) {
        this.credentials = credentials
    }

    getLoginPage() {
        return this.loginPage
    }

    setLoginPage(loginPage) {
        this.loginPage = loginPage
    }
}

module.exports = ConfigEntity;