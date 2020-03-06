const VULNERABILITY_MICROSERVICE_SOCKETIO = 'vulnerabilities:8000';
const VULNERABILITY_MICROSERVICE_REST = 'http://vulnerabilities:5000';
const CRAWLER_MICROSERVICE = 'http://crawler:3000';
const API_GW_DB_NAME = 'test:prod';
const SCAN_CRUD_TABLE = 'scans';
const USERS_CRUD_TABLE = 'users';
const VULN_TABLE_PREFIX = 'vuln_';
const DB_INFO = {
    host: 'mySQL',
    port: 3306,
    user: 'root',
    password: '311248496',
    database: 'test'
};

const CLIENT_HOSTNAME = 'http://localhost:3000';

const THRESHOLD_VALUES = {
    maxDepth: {
        max: 10,
        min: 1
    },
    interval: {
        min: 250,
        max: 1000
    },
    timeout: {
        max: 30,
        min: 10
    }
}

module.exports = {
    VULNERABILITY_MICROSERVICE_REST,
    VULNERABILITY_MICROSERVICE_SOCKETIO,
    CRAWLER_MICROSERVICE,
    API_GW_DB_NAME,
    SCAN_CRUD_TABLE,
    VULN_TABLE_PREFIX,
    USERS_CRUD_TABLE,
    DB_INFO,
    THRESHOLD_VALUES,
    CLIENT_HOSTNAME
};
