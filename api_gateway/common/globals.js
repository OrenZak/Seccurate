const VULNERABILITY_MICROSERVICE_SOCKETIO = 'localhost:8000';
const VULNERABILITY_MICROSERVICE_REST = 'http://localhost:5000';
const CRAWLER_MICROSERVICE = 'http://localhost:3000';
const API_GW_DB_NAME = 'test:prod';
const SCAN_CRUD_TABLE = 'scans';
const USERS_CRUD_TABLE = 'users';
const VULN_TABLE_PREFIX = 'vuln_';
const DB_INFO = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: "db"
};

module.exports = {
    VULNERABILITY_MICROSERVICE_REST,
    VULNERABILITY_MICROSERVICE_SOCKETIO,
    CRAWLER_MICROSERVICE,
    API_GW_DB_NAME,
    SCAN_CRUD_TABLE,
    VULN_TABLE_PREFIX,
    USERS_CRUD_TABLE,
    DB_INFO
};