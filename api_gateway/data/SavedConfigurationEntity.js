
class SavedConfigurationEntity {
    constructor(id=null, name=null, max_depth, timeout, interval, max_concurrency) {
        this.id=id;
        this.name = name;
        this.max_depth = max_depth;
        this.timeout = timeout;
        this.interval = interval;
        this.max_concurrency = max_concurrency;
    }

    getID() {
        return this.id
    }

    setID(id) {
        this.id=id
    }

    getName(){
        return this.name;
    }

    setName(name){
        this.name = name
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
}

module.exports = SavedConfigurationEntity