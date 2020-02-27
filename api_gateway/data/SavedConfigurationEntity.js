class SavedConfigurationEntity {
  constructor(id = null, name = null, maxDepth, timeout, interval) {
    this.id = id;
    this.name = name;
    this.maxDepth = maxDepth;
    this.timeout = timeout;
    this.interval = interval;
  }

  getID() {
    return this.id;
  }

  setID(id) {
    this.id = id;
  }

  getName() {
    return this.name;
  }

  setName(name) {
    this.name = name;
  }

  getMaxDepth() {
    return this.maxDepth;
  }

  setMaxDepth(maxDepth) {
    this.maxDepth = maxDepth;
  }

  getTimeout() {
    return this.timeout;
  }

  setTimeout(timeout) {
    this.timeout = timeout;
  }

  getInterval() {
    return this.interval;
  }

  setInterval(interval) {
    this.interval = interval;
  }
}

module.exports = SavedConfigurationEntity;
