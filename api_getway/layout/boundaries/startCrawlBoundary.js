class StartCrawlBoundary {
    constructor(id) {
        this.id = id;
    }

    get ID() {
        return this.id;
    }

    set ID(id) {
        this.id = id;
    }

    serialize() {
        return JSON.stringify(this);
    }

    static deserialize(crawlBoundary) {
        return new StartCrawlBoundary(crawlBoundary.id);
    }
}

module.exports = StartCrawlBoundary;