const mysql = require('mysql2');
const globals = require('./../common/globals');

class UsersCRUD {
    constructor(db_type) {//should be read from globals
        let index;
        if (db_type == 'test') {
            index = 0;
        } else if (db_type == 'prod') {
            index = 1;
        } else throw new Error('Wrong DB type specified - ' + db_type);
        this.conn = mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '311248496',
            database: globals.API_GW_DB_NAME.split(':')[index]
        })
        this.conn.connect(function (err) {
            if (err) {
                console.error('error: ' + err);
            } else {
                console.log("mysql connected")
            }
        })
        this.table_name = globals.USERS_CRUD_TABLE;
        this.createTable()
    }

    createTable() {
        const sql = `CREATE TABLE IF NOT EXISTS ?? (username VARCHAR(30) PRIMARY KEY, salt VARCHAR(100) NOT NULL, passwordHash VARCHAR(256) NOT NULL, admin BOOLEAN)`
        this.conn.query(sql, [this.table_name], function (err) {
            if (err) {
                console.log(err)
            }
        })
    }

    insertValue(value, callback) {
        const sql = `INSERT INTO ?? VALUES (?,?,?,?)`
        this.conn.query(sql, [this.table_name, value.getUsername(), value.getSalt(), value.getPasswordHash(),
            value.getAdmin()], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                callback(null, result);
            }
        })
    }

    updateValue(new_value, callback) {
        this.getValue(new_value.getUsername(), function (err, res) {
            if (err) {
                throw new Error('No such value ' + new_value.getUsername() + '\n' + err)
            }
        });
        const sql = `UPDATE ?? SET salt=?, passwordHash=?, admin=? WHERE username=?`
        this.conn.query(sql, [this.table_name, new_value.getSalt(), new_value.getPasswordHash(),
            new_value.getAdmin(), new_value.getUsername()], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                callback(null, result);
            }
        });
        return new_value
    }

    getValue(username, callback) {
        const sql = `SELECT * FROM ?? WHERE username=?`
        this.conn.query(sql, [this.table_name, username], function (err, result) {
            if (!err) {
                callback(null, result);
            } else {
                console.log(err);
                callback(err, result);
            }
        })
    }

    getAll(callback, page = 0, size = 20) {
        let intPage = parseInt(page, 10);
        let intSize = parseInt(size, 10);
        const sql = `SELECT * from ?? ORDER BY username ASC LIMIT ? OFFSET ?`;
        this.conn.query(sql, [this.table_name, intSize, intPage * intSize], function (err, results) {
            if (!err) {
                callback(null, results)
            } else {
                console.log(err)
            }
        })
    }

    deleteValue(username, callback) {
        const sql = `DELETE FROM ?? WHERE username=?`;
        this.conn.query(sql, [this.table_name, username], (err, result) => {
            if (err) {
                console.log(err);
                callback(err, false);
            } else {
                callback(null, true);
            }
        });
    }

    deleteAll() {
        const sql = `DELETE FROM ??`
        this.conn.query(sql, [this.table_name], (err) => {
            if (err) {
                console.log(err)
            }
        })
    }

    dropTable() {
        const sql = `DROP TABLE ??`
        return this.conn.query(sql, [this.table_name], (err) => {
            if (err) {
                console.log(err)
            }
        })
    }

    closeConnection() {
        this.conn.end(function (err) {
            if (err) {
                console.log(err)
            }
        })
        console.log('disconnected from db')
    }
}

module.exports = UsersCRUD