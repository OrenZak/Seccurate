class CrawlerPageScanBoundary {
    constructor(url, pageHash=null, sessionType=null, sessionValue=null) {
        this.url = url;
    }

    get URL() {
        return this.url
    }

    set URL(url) {
        this.url = url;
    }

    serialize() {
        return this;
    }

    static deserialize(pageBoundary) {
        return new CrawlerPageScanBoundary(pageBoundary.url);
    }
}

module.exports = CrawlerPageScanBoundary;