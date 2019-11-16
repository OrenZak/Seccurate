class ScanConfigBoundary {
    constructor(interval, maxConcurrency, maxDepth, timeout, scanType, url, loginInfo, name, save) {
        this.interval = interval;
        this.maxConcurrency = maxConcurrency;
        this.maxDepth = maxDepth;
        this.timeout = timeout;
        this.scanType = scanType;
        this.url = url;
        this.loginInfo = loginInfo;
        this.name = name;
        this.save = save;
    }

    get Interval() {
        return this.interval
    }

    set Interval(interval) {
        this.interval = interval;
    }

    get ScanType() {
        return this.scanType
    }

    set ScanType(scanType) {
        this.scanType = scanType;
    }

    get MaxConcurrency() {
        return this.maxConcurrency
    }

    set MaxConcurrency(maxConcurrency) {
        this.maxConcurrency = maxConcurrency;
    }

    get MaxDepth() {
        return this.maxDepth
    }

    set MaxDepth(maxDepth) {
        this.maxDepth = maxDepth;
    }

    get Timeout() {
        return this.timeout
    }

    set Timeout(timeout) {
        this.timeout = timeout;
    }

    get URL() {
        return this.url
    }

    set URL(url) {
        this.url = url;
    }

    get LoginInfo() {
        return this.loginInfo
    }

    set LoginInfo(loginInfo) {
        this.loginInfo = loginInfo;
    }

    get Name() {
        return this.name
    }

    set Name(name) {
        this.name = name
    }

    get Save() {
        return this.save
    }

    set Save(save) {
        this.save = save;
    }

    serialize() {
        return JSON.stringify(this);
    }

    static deserialize(scanConfigBoundary) {
        return new ScanConfigBoundary(scanConfigBoundary.interval, scanConfigBoundary.maxConcurrency, scanConfigBoundary.maxDepth, scanConfigBoundary.timeout,scanConfigBoundary.scanType, scanConfigBoundary.url, scanConfigBoundary.loginInfo, scanConfigBoundary.name, scanConfigBoundary.save);
    }
}

module.exports = ScanConfigBoundary;