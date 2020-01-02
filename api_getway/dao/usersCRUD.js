const mysql = require('mysql2');
const globals = require('../common/globals');

class UsersCRUD {
    constructor(db_type) {//should be read from globals
        let index;
        if (db_type == 'test') {
            index = 0;
        }
        else if (db_type == 'prod') {
            index = 1;
        }
        else throw new Error('Wrong DB type specified - ' + db_type);
        this.conn = mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            //password: '18031997',
            database: globals.API_GW_DB_NAME.split(':')[index]
        })
        this.conn.connect(function(err) {
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
        this.conn.query(sql, [this.table_name], function(err) {
            if (err) {
                console.log(err)
            }
        })
    }

    insertValue(value) {
        const sql = `INSERT INTO ?? VALUES (?,?,?,?)`
        this.conn.query(sql, [this.table_name, value.getUsername(), value.getSalt(), value.getPasswordHash(),
            value.getAdmin()], (err) => {
            if (err) {
                console.log(err)
            }
        })
    }

    updateValue(new_value) {
        this.getValue(new_value.getUsername(), function (err, res) {
            if (err) {
                throw new Error('No such value ' + new_value.getUsername() + '\n' + err)
            }
        })
        const sql = `UPDATE ?? SET salt=?, passwordHash=?, admin=? WHERE username=?`
        this.conn.query(sql,[this.table_name, value.getSalt(), value.getPasswordHash(),
            value.getAdmin(), value.getUsername()], (err) => {
            if (err) {
                console.log(err)
            }
        })
        return new_value
    }

    getValue(username, callback) {
        const sql = `SELECT * FROM ?? WHERE username=?`
        this.conn.query(sql,[this.table_name, username], function (err, result) {
            if (!err) {
                callback(null, result)
            }
            else {
                console.log(err)
            }
        })
    }

    getAll(callback, page=0, size=20) {
        let intPage = parseInt(page, 10);
        let intSize = parseInt(size, 10);
        const sql = `SELECT * from ?? ORDER BY username ASC LIMIT ? OFFSET ?`;
        this.conn.query(sql, [this.table_name,intSize,intPage*intSize], function(err, results) {
            if (!err) {
                callback(null, results)
            }
            else {
                console.log(err)
            }
        })
    }
    
    deleteValue(username){
        this.getValue(username, function (err, res) {
            if (err) {
                throw new Error('No such value\n' + err)
            }
        })
        const sql = `DELETE FROM ?? WHERE username=?`
        this.conn.query(sql, [this.table_name, username, (err) => {
            if (err) {
                console.log(err)
            }
        }])
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
        this.conn.end(function(err) {
            if (err) {
                console.log(err)
            }
        })
        console.log('disconnected from db')
    }
}

module.exports = UsersCRUD