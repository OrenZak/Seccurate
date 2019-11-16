class ScanEntity {
    constructor(name, timestamp, configuration) {
        this.name = name;
        this.timestamp = timestamp;
        this.configuration = configuration;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getTimestamp() {
        return this.timestamp;
    }

    setTimestamp(timestamp) {
        this.timestamp = timestamp;
    }

    getConfiguration() {
        return this.configuration;
    }

    setConfiguration(configuration) {
        this.configuration = configuration;
    }
}

module.exports = ScanEntity;