module.exports = {
    db_path: '../db',
    crawler: {
      'interval': 250, // 0.5 seconds
      'maxConcurrency': 3,
      'maxDepth': 10,
      'timeout': 10000 // 10sec
    },
    paths: {
      API_GETWAY: 'http://192.168.1.26:3000'
    }
}