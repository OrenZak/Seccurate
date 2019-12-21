class NewTargetBoundary {
    constructor(config, scanType, url, loginInfo, name, description) {
        this.config = config;
        this.scanType = scanType;
        this.url = url;
        this.loginInfo = loginInfo;
        this.name = name;
        this.description = description;
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

    get Name() {
        return this.name
    }

    set Name(name) {
        this.name = name
    }

    get Description() {
        return this.description
    }

    set Description(description) {
        this.description = description
    }

    serialize() {
        return this;
    }

    static deserialize(scanConfigBoundary) {
        return new NewTargetBoundary(scanConfigBoundary.config, scanConfigBoundary.scanType, scanConfigBoundary.url, scanConfigBoundary.loginInfo, scanConfigBoundary.name, scanConfigBoundary.description);
    }
}

module.exports = NewTargetBoundary;