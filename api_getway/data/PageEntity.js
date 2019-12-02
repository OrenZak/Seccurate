
class PageEntity {
    constructor(url, pageHash, sessionType, sessionValue, scanTimestamp) {
        this.url = url;
        this.pageHash = pageHash;
        this.sessionType = sessionType;
        this.sessionValue = sessionValue;
        this.scanTimestamp = scanTimestamp
    }

    getURL() {
        return this.url
    }

    setURL(url) {
        this.url=url
    }

    getPageHash() {
        return this.pageHash
    }

    setPageHash(pageHash) {
        this.pageHash = pageHash
    }

    getSessionType() {
        return this.sessionType
    }

    setSessionType(sessionType) {
        this.sessionType = sessionType
    }

    getSessionValue() {
        return this.sessionValue
    }

    setSessionValue(sessionValue) {
        this.sessionValue = sessionValue
    }

    getScanTimestamp() {
        return this.scanTimestamp
    }

    setScanTimestamp(scanTimestamp) {
        this.scanTimestamp = scanTimestamp
    }
}

module.exports = PageEntity