class GetScansResponseBoundary {
    constructor(scanEntityArray) {
        this.scanEntityArray = scanEntityArray;
    }

    get ScanEntityArray() {
        return this.scanEntityArray;
    }

    set ScanEntityArray(scanEntityArray) {
        this.scanEntityArray = scanEntityArray;
    }

    serialize() {
        return JSON.stringify(this);
    }

    static deserialize(boundary) {
        return;
    }
}

module.exports = GetScansResponseBoundary;