class CompletedScanEntity {
    constructor(name, scanID, description, maxDepth, timeout, interval, scanType, url) {
        this.name = name;
        this.scanID = scanID;
        this.description = description;
        this.config = {};
        this.config["maxDepth"] = maxDepth;
        this.config["timeout"] = timeout;
        this.config["interval"] = interval;
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
        return this.config["maxDepth"];
    }

    setMaxDepth(maxDepth) {
        this.config["maxDepth"] = maxDepth;
    }

    getTimeout() {
        return this.config["timeout"];
    }

    setTimeout(timeout) {
        this.config["timeout"] = timeout;
    }

    getInterval() {
        return this.config["interval"];
    }

    setInterval(interval) {
        this.config["interval"] = interval;
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