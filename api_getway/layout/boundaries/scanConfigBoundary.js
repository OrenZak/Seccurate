class ScanConfigBoundary {
    constructor(name, maxDepth, timeout, interval, maxConcurrency) {
        this._name = name;
        this._maxDepth = maxDepth;
        this._timeout = timeout;
        this._interval = interval;
        this._maxConcurrency = maxConcurrency;
    }


    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get maxDepth() {
        return this._maxDepth;
    }

    set maxDepth(value) {
        this._maxDepth = value;
    }

    get timeout() {
        return this._timeout;
    }

    set timeout(value) {
        this._timeout = value;
    }

    get interval() {
        return this._interval;
    }

    set interval(value) {
        this._interval = value;
    }

    get maxConcurrency() {
        return this._maxConcurrency;
    }

    set maxConcurrency(value) {
        this._maxConcurrency = value;
    }

    serialize() {
        return this;
    }

    static deserialize(scanConfigBoundary) {
        return new ScanConfigBoundary(scanConfigBoundary._name, scanConfigBoundary._maxDepth, scanConfigBoundary._timeout, scanConfigBoundary._interval, scanConfigBoundary._maxConcurrency);
    }
}

module.exports = ScanConfigBoundary;