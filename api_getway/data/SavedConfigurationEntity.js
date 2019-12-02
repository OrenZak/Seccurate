
class SavedConfigurationEntity {
    constructor(id=null, max_depth, timeout, interval, max_concurrency, default_scan) {
        this.id=id
        this.max_depth = max_depth
        this.timeout = timeout
        this.interval = interval
        this.max_concurrency = max_concurrency
        this.default_scan = default_scan
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

    getDefaultScan() {
        return this.default_scan
    }

    setDefaultScan(default_scan) {
        this.default_scan = default_scan
    }
}

module.exports = SavedConfigurationEntity