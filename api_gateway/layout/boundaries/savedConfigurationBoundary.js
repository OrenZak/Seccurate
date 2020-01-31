class SavedConfigurationBoundary {
    constructor(id, name, maxDepth, timeout, interval, maxConcurrency) {
        this._id = id;
        this._name = name;
        this._maxDepth = maxDepth;
        this._timeout = timeout;
        this._interval = interval;
        this._maxConcurrency = maxConcurrency;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
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
        return new SavedConfigurationBoundary(scanConfigBoundary.id, scanConfigBoundary.name, scanConfigBoundary.maxDepth, scanConfigBoundary.timeout, scanConfigBoundary.interval, scanConfigBoundary.maxConcurrency);
    }
}

module.exports = SavedConfigurationBoundary;