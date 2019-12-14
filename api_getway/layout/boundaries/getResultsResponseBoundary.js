class GetResultsResponseBoundary {
    constructor(resultsEntityArray) {
        this.resultsArray = resultsEntityArray;
    }

    get ResultsArray() {
        return this.resultsArray
    }

    set ScanName(resultsArray) {
        this.resultsArray = resultsArray;
    }

    serialize() {
        return JSON.stringify(this);
    }

    static deserialize(crawlBoundary) {
        return
    }
}

module.exports = GetResultsResponseBoundary;