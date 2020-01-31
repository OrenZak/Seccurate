class GetConfigsBoundary {
    constructor(configEntityArray) {
        this._configEntityArray = configEntityArray;
    }

    get configEntityArray() {
        return this._configEntityArray;
    }

    set configEntityArray(value) {
        this._configEntityArray = value;
    }

    serialize() {
        return JSON.stringify(this);
    }

    static deserialize(boundary) {
        return;
    }
}

module.exports = GetConfigsBoundary;