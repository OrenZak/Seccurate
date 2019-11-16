class ScanConfigBoundary {
    constructor(config, scanType, url, loginInfo, name, save) {
        this.config = config;
        this.scanType = scanType;
        this.url = url;
        this.loginInfo = loginInfo;
        this.name = name;
        this.save = save;
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

    get Save() {
        return this.save
    }

    set Save(save) {
        this.save = save;
    }

    serialize() {
        return JSON.stringify(this);
    }

    static deserialize(scanConfigBoundary) {
        return new ScanConfigBoundary(scanConfigBoundary.config, scanConfigBoundary.scanType, scanConfigBoundary.url, scanConfigBoundary.loginInfo, scanConfigBoundary.name, scanConfigBoundary.save);
    }
}

module.exports = ScanConfigBoundary;