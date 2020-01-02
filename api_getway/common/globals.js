const VULNERABILITY_MICROSERVICE_SOCKETIO = 'localhost:8000';
const VULNERABILITY_MICROSERVICE_REST = 'http://10.0.0.4:5000';
const CRAWLER_MICROSERVICE = 'http://localhost:3000';
const TEST_DB = 'C:\\DB\\node_test_api_db.db';
const PROD_DB = 'C:\\DB\\node_prod_api_db.db';
const API_GW_DB_NAME = 'test:prod';
const SCAN_CRUD_TABLE = 'scans';
const USERS_CRUD_TABLE = 'users';
const VULN_TABLE_PREFIX = 'vuln_';

module.exports = {
    VULNERABILITY_MICROSERVICE_REST,
    VULNERABILITY_MICROSERVICE_SOCKETIO,
    CRAWLER_MICROSERVICE,
    TEST_DB,
    PROD_DB,
    API_GW_DB_NAME,
    SCAN_CRUD_TABLE,
    VULN_TABLE_PREFIX,
    USERS_CRUD_TABLE
};