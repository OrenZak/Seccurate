class GetTargetsBoundary {
    constructor(scansEntityArray) {
        this._scansEntityArray = scansEntityArray;
    }

    get _scansEntityArray() {
        return this._configEntityArray;
    }

    set _scansEntityArray(value) {
        this._configEntityArray = value;
    }

    serialize() {
        return JSON.stringify(this);
    }

    static deserialize(boundary) {
        return;
    }
}

module.exports = GetTargetsBoundary;