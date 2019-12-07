module.exports = {
    db_path: '../db',
    crawler: {
      'interval': 250, // 0.5 seconds
      'maxConcurrency': 3,
      'maxDepth': 10,
      'timeout': 10000 // 10sec
    },
    paths: {
      API_GETWAY: 'http://10.0.0.7:3001'
    }
}