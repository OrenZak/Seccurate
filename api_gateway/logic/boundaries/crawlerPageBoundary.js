class CrawlerPageScanBoundary {
    constructor(url, pageHash, sessionType, sessionValue) {
        this.url = url;
        this.pageHash = pageHash;
        this.type = sessionType;
        this.value = sessionValue;
    }

    get URL() {
        return this.url
    }

    set URL(url) {
        this.url = url;
    }

    get PageHash() {
        return this.pageHash
    }

    set PageHash(pageHash) {
        this.pageHash = pageHash;
    }

    get SessionType() {
        return this.type
    }

    set SessionType(sessionType) {
        this.type = sessionType;
    }

    get SessionValue() {
        return this.value
    }

    set SessionValue(sessionValue) {
        this.value = sessionValue;
    }

    serialize() {
        return this;
    }

    static deserialize(pageBoundary) {
        return new CrawlerPageScanBoundary(pageBoundary.url, pageBoundary.pageHash, pageBoundary.type, pageBoundary.value);
    }
}

module.exports = CrawlerPageScanBoundary;