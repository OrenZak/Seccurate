class SavedConfigurationEntity {
  constructor(id = null, name = null, max_depth, timeout, interval) {
    this.id = id;
    this.name = name;
    this.maxDepth = max_depth;
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

  setMaxDepth(max_depth) {
    this.maxDepth = max_depth;
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
