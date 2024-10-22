class ScanEntity {
    constructor(name, scanID, description, pageTableID=null, maxDepth, timeout, interval, scanType, scanCompleted, loginInfo=null, url) {
        this.name = name;
        this.scanID = scanID;
        this.description = description;
        this.pageTableID = pageTableID;
        this.maxDepth = maxDepth;
        this.timeout = timeout;
        this.interval = interval;
        this.scanType = scanType;
        this.scanCompleted = scanCompleted;
        this.loginInfo = loginInfo;
        this.url = url;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getScanID() {
        return this.scanID;
    }

    setScanID(scanID) {
        this.scanID = scanID;
    }

    getDescription() {
        return this.description;
    }

    setDescription(description) {
        this.description = description;
    }

    getPageTableID(){
        return this.pageTableID;
    }

    setPageTableID(pageTableID){
        this.pageTableID = pageTableID;
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

    getScanType() {
        return this.scanType
    }

    setScanType(scanType) {
        this.scanType = scanType
    }

    isScanCompleted(){
        return this.scanCompleted;
    }

    setScanCompleted(scanCompleted){
        this.scanCompleted = scanCompleted;
    }

    getLoginInfo() {
        return this.loginInfo
    }

    setLoginInfo(loginInfo) {
        this.loginInfo = loginInfo
    }

    getURL() {
        return this.url
    }

    setURL(url) {
        this.url = url
    }
}

module.exports = ScanEntity;