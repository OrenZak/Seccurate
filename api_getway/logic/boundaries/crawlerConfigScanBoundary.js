class CrawlerConfigScanBoundary {
    constructor(interval, maxConcurrency, maxDepth, timeout) {
        this.interval = interval;
        this.maxConcurrency = maxConcurrency;
        this.maxDepth = maxDepth;
        this.timeout = timeout;
    }

    get Interval() {
        return this.interval
    }

    set Interval(interval) {
        this.interval = interval;
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

    static deserialize(crawlerConfigScanBoundary) {
        var deserialized = JSON.parse(crawlerConfigScanBoundary);
        return new CrawlerConfigScanBoundary(deserialized.interval, deserialized.maxConcurrency, deserialized.maxDepth, deserialized.timeout);
    }
}

module.exports = CrawlerConfigScanBoundary;