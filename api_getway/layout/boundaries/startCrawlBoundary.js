class CrawlBoundary {
    constructor(url, loginInfo) {
        this.url = url;
        this.loginInfo = loginInfo;
    }

    get URL() {
        return this.url
    }

    set URL(url) {
        this.url = url;
    }

    get LoginInfo() {
        return this.loginInfo
    }

    set LoginInfo(loginInfo) {
        this.loginInfo = loginInfo;
    }

    serialize() {
        return JSON.stringify(this);
    }

    static deserialize(crawlBoundary) {
        var deserialized = JSON.parse(crawlBoundary);
        return new CrawlBoundary(deserialized.url, deserialized.loginInfo);
    }
}

module.exports = CrawlBoundary;