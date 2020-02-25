class GetTargetsBoundary {
    constructor(scansEntityArray) {
        this.scansEntityArray = scansEntityArray;
    }

    getScansEntityArray() {
        return this._scansEntityArray;
    }

    setScansEntityArray(scansEntityArray) {
        this.scansEntityArray = scansEntityArray;
    }

    serialize() {
        return JSON.stringify(this);
    }

    static deserialize(boundary) {
        return;
    }
}

module.exports = GetTargetsBoundary;