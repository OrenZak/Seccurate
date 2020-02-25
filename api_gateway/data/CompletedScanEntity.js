class CompletedScanEntity {
    constructor(name, scanID, description, maxDepth, timeout, interval, scanType, url) {
        this.name = name;
        this.scanID = scanID;
        this.description = description;
        this.maxDepth = maxDepth;
        this.timeout = timeout;
        this.interval = interval;
        this.scanType = scanType;
        this.url = url;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getScanID() {
        return this.timestamp;
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

    getURL() {
        return this.url
    }

    setURL(url) {
        this.url = url
    }
}

module.exports = CompletedScanEntity;