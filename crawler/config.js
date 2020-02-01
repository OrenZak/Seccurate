module.exports = {
  crawler: {
    interval: 500, // 0.5 seconds
    maxConcurrency: 3,
    maxDepth: 3,
    timeout: 10000 // 10sec
  },
  paths: {
    API_GATEWAY: 'http://127.0.0.1:3001'
  }
};
