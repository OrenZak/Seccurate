
class ConfigurationEntity {
    constructor(id=null, max_depth, timeout, interval, max_concurrency, vulns_scanned, credentials=null, login_page=null) {
        this.id=id
        this.max_depth = max_depth
        this.timeout = timeout
        this.interval = interval
        this.max_concurrency = max_concurrency
        this.vulns_scanned=vulns_scanned
        this.credentials=credentials
        this.login_page=login_page
    }

    getID() {
        return this.id
    }

    setID(id) {
        this.id=id
    }

    getMaxDepth() {
        return this.max_depth
    }

    setMaxDepth(max_depth) {
        this.max_depth = max_depth
    }

    getTimeout() {
        return this.timeout
    }

    setTimeout(timeout) {
        this.timeout = timeout
    }

    getInterval() {
        return this.interval
    }

    setInterval(interval) {
        this.interval = interval
    }

    getMaxConcurrency() {
        return this.max_concurrency
    }

    setMaxConcurrency(max_concurrency) {
        this.max_concurrency = max_concurrency
    }

    getVulnsScanned() {
        return this.vulns_scanned
    }

    setVulnsScanned(vulns_scanned) {
        this.vulns_scanned = vulns_scanned
    }

    getCredentials() {
        return this.credentials
    }

    setCredentials(credentials) {
        this.credentials = credentials
    }

    getLoginPage() {
        return this.login_page
    }

    setLoginPage(login_page) {
        this.login_page = login_page
    }
}

module.exports = ConfigurationEntity