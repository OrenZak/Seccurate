class SavedConfigurationEntity {
  constructor(id = null, name = null, maxDepth, timeout, interval) {
    this.id = id;
    this.name = name;
    this.config = {};
    this.config["maxDepth"] = maxDepth;
    this.config["timeout"] = timeout;
    this.config["interval"] = interval;
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
    return this.config["maxDepth"];
  }

  setMaxDepth(maxDepth) {
      this.config["maxDepth"] = maxDepth;
  }

  getTimeout() {
      return this.config["timeout"];
  }

  setTimeout(timeout) {
      this.config["timeout"] = timeout;
  }

  getInterval() {
      return this.config["interval"];
  }

  setInterval(interval) {
      this.config["interval"] = interval;
  }
}

module.exports = SavedConfigurationEntity;
