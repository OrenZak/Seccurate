class NewSavedConfigurationBoundary {
    constructor(name, maxDepth, timeout, interval) {
        this._name = name;
        this._maxDepth = maxDepth;
        this._timeout = timeout;
        this._interval = interval;
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

    serialize() {
        return this;
    }

    static deserialize(scanConfigBoundary) {
        return new NewSavedConfigurationBoundary(scanConfigBoundary.name, scanConfigBoundary.maxDepth, scanConfigBoundary.timeout, scanConfigBoundary.interval);
    }
}

module.exports = NewSavedConfigurationBoundary;