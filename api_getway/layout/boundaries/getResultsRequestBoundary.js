class GetResultsRequestBoundary {
    constructor(scanName) {
        this.scanName = scanName;
    }

    get ScanName() {
        return this.scanName
    }

    set ScanName(scanName) {
        this.scanName = scanName;
    }

    serialize() {
        return JSON.stringify(this);
    }

    static deserialize(crawlBoundary) {
        var deserialized = JSON.parse(crawlBoundary);
        return new GetResultsRequestBoundary(deserialized.scanName);
    }
}

module.exports = GetResultsRequestBoundary;