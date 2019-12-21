class NewScanTargetBoundary {
    constructor(config, scanType, url, loginInfo, name, save, description, savedScanName) {
        this.config = config;
        this.scanType = scanType;
        this.url = url;
        this.loginInfo = loginInfo;
        this.name = name;
        this.description = description;
        this.save = save;
        this.savedScanName = savedScanName;
    }


    get Config() {
        return this.config
    }

    set Config(config) {
        this.config = config;
    }

    get SavedScanName() {
        return this.savedScanName
    }

    set SavedScanName(savedScanName) {
        this.savedScanName = savedScanName;
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

    get Save() {
        return this.save
    }

    set Save(save) {
        this.save = save;
    }

    serialize() {
        return this;
    }

    static deserialize(scanConfigBoundary) {
        return new NewScanTargetBoundary(scanConfigBoundary.config, scanConfigBoundary.scanType, scanConfigBoundary.url, scanConfigBoundary.loginInfo, scanConfigBoundary.name, scanConfigBoundary.save, scanConfigBoundary.description, scanConfigBoundary.savedScanName);
    }
}

module.exports = NewScanTargetBoundary;