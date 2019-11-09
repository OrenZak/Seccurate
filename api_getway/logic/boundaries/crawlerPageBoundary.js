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
        return JSON.stringify(this);
    }

    static deserialize(pageBoundary) {
        var deserialized = JSON.parse(pageBoundary);
        return new CrawlerPageScanBoundary(deserialized.url, deserialized.pageHash, deserialized.type, deserialized.value);
    }
}

module.exports = CrawlerPageScanBoundary;