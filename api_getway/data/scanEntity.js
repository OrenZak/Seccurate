class ScanEntity {
    constructor(name, timestamp, configuration, description) {
        this.name = name;
        this.timestamp = timestamp;
        this.configuration = configuration;
        this.description = description;
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

    getDescription() {
        return this.description;
    }

    setDescription(description) {
        this.description = description;
    }
}

module.exports = ScanEntity;