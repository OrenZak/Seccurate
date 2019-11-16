class CrawlerConfigScanBoundary {
    constructor(config, scanType, url, loginInfo) {
        this.config = config;
        this.scanType = scanType;
        this.url = url;
        this.loginInfo = loginInfo;
    }

    get Config() {
        return this.config
    }

    set Config(config) {
        this.config = config;
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

    static deserialize(scanConfigBoundary) {
        return new CrawlerConfigScanBoundary(scanConfigBoundary.config, scanConfigBoundary.scanType, scanConfigBoundary.url, scanConfigBoundary.loginInfo);
    }
}

module.exports = CrawlerConfigScanBoundary;