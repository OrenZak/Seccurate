class ScanConfigBoundary {
    constructor(interval, maxConcurrency, maxDepth, timeout, scanType) {
        this.interval = interval;
        this.maxConcurrency = maxConcurrency;
        this.maxDepth = maxDepth;
        this.timeout = timeout;
        this.scanType = scanType;
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

    serialize() {
        return JSON.stringify(this);
    }

    static deserialize(scanConfigBoundary) {
        return new ScanConfigBoundary(scanConfigBoundary.interval, scanConfigBoundary.maxConcurrency, scanConfigBoundary.maxDepth, scanConfigBoundary.timeout,scanConfigBoundary.scanType);
    }
}

module.exports = ScanConfigBoundary;