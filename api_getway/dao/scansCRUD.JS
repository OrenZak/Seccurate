const mysql = require('mysql2');
const scanEntity = require('../data/scanEntity');
const configurationCRUD = require('./scanConfigurationCRUD');
const globals = require('../common/globals');

class ScansDataCRUD {
    constructor(db_type) {//should become db_type and read from globals
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
        this.table_name = globals.SCAN_CRUD_TABLE;
        this.createTable()
    }

    createTable() {
        const sql = `CREATE TABLE IF NOT EXISTS ?? (name VARCHAR(100), scan_timestamp VARCHAR(30) PRIMARY KEY, description VARCHAR(200), pageTableName VARCHAR(100), maxDepth INTEGER, timeout INTEGER, interval_crawler INTEGER, maxConcurrency INTEGER, vulnsScanned VARCHAR(100) NOT NULL, credentials VARCHAR(300), loginPage VARCHAR(200))`
        this.conn.query(sql, [this.table_name], function(err) {
            if (err) {
                console.log(err)
            }
        })
    }

    insertValue(value) {
        if (!value.getCredentials() || !value.getLoginPage()) {
            const sql2 = `INSERT INTO ?? VALUES (name, scan_timestamp, description, pageTableName, maxDepth, timeout, interval_crawler, maxConcurrency, vulnsScanned)`
            this.conn.query(sql2, [this.table_name, value.getName(), value.getTimestamp(), value.getDescription(),
                value.getPageTableName(), value.getMaxDepth(),value.getTimeout(), value.getInterval(), value.getMaxConcurrency(),
                value.getVulnsScanned()], (err) => {
                if (err) {
                    console.log(err)
                }
            })
        }
        else {
            const sql = `INSERT INTO ?? VALUES (?,?,?,?,?,?,?,?,?,?,?)`
            this.conn.query(sql, [this.table_name, value.getName(), value.getTimestamp(), value.getDescription(),
                value.getPageTableName(), value.getMaxDepth(), value.getTimeout(), value.getInterval(), value.getMaxConcurrency(),
                value.getVulnsScanned(), value.getCredentials(), value.getLoginPage()], (err) => {
                if (err) {
                    console.log(err)
                }
            })
        }
    }

    updateValue(new_value) {
        this.getValue(new_value.getTimestamp(), function (err, res) {
            if (err) {
                throw new Error('No such value ' + new_value.getName() + '\n' + err)
            }
        })
        if (!new_value.getCredentials() || !new_value.getLoginPage()) {
            const sql = `UPDATE ?? SET name=?, description=?, pageTableName=?, maxDepth=?, timeout=?, interval_crawler=?, maxConcurrency=?, vulnsScanned=? WHERE scan_timestamp=?`
            this.conn.query(sql, [this.table_name, new_value.getName(), new_value.getDescription(),
                new_value.getPageTableName(), new_value.getMaxDepth(), new_value.getTimeout(), new_value.getInterval(),
                new_value.getMaxConcurrency(), new_value.getVulnsScanned(), new_value.getTimestamp()], (err) => {
                if (err) {
                    console.log(err)
                }
            })
        }
        else {
            const sql = `UPDATE ?? SET name=?, description=?, pageTableName=?, maxDepth=?, timeout=?, interval_crawler=?, maxConcurrency=?, vulnsScanned=?, credentials=?, loginPage=? WHERE scan_timestamp=?`
            this.conn.query(sql,[this.table_name, new_value.getName(), new_value.getDescription(),
                new_value.getPageTableName(), new_value.getMaxDepth(),new_value.getTimeout(), new_value.getInterval(),
                new_value.getMaxConcurrency(), new_value.getVulnsScanned(), new_value.getCredentials(),
                new_value.getLoginPage(), new_value.getTimestamp()], (err) => {
                if (err) {
                    console.log(err)
                }
            })
        }
        return new_value
    }

    getValue(value_timestamp, callback) {
        const sql = `SELECT * FROM ?? WHERE scan_timestamp=?`
        this.conn.query(sql,[this.table_name, value_timestamp], function (err, result) {
            if (!err) {
                callback(null, result)
            }
            else {
                console.log(err)
            }
        })
    }

    /*getByForeignKey(fk, callback){
        const sql = `SELECT * FROM ?? WHERE configuration=?`
        this.conn.query(sql,[this.table_name, fk], (err, result)=> {
            if (!err) {
                callback(null, result)
            }
            else {
                console.log(err)
            }
        })
    }*/

    getAll(callback, page=0, size=20) {
        const sql = `SELECT * from ?? ORDER BY scan_timestamp ASC LIMIT ?,?`
        this.conn.query(sql, [this.table_name, page*size, parseInt((page*size)+size,10)], function(err, results) {
            if (!err) {
                callback(null, results)
            }
            else {
                console.log(err)
            }
        })
    }
    
    deleteValue(value_timestamp){
        this.getValue(value_timestamp, function (err, res) {
            if (err) {
                throw new Error('No such value\n' + err)
            }
        })
        const sql = `DELETE FROM ?? WHERE scan_timestamp=?`
        this.conn.query(sql, [this.table_name, value_timestamp, (err) => {
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

module.exports = ScansDataCRUD

// var configCRUD = new configurationCRUD('test');
// var id1;
// var id2;
// var connection = new ScansDataCRUD('test');
// connection.createTable();
// configCRUD.getAll(function (err, data) {
//     if (err) {
//         console.log(err)
//     }
//     else {
//         connection.insertValue(new scanEntity('abc', Date.now()-5, data[0]['id'], 'aaa'));
//         connection.insertValue(new scanEntity('def', Date.now(), data[1]['id'], 'bbb'));
//     }
// })
// connection.getAll(function(err, data) {
//     if (err) {
//         console.log(err)
//     }
//     else {
//         console.log(data)
//         console.log('length is ' + data.length)
//     }
// })
/*connection.getValue(value1, (err, data) => {
    if (err) {
        console.log(err)
    }
    else {
        Object.keys(data[0]).forEach(element => {
            console.log(element + ': ' + data[0][element])
        })
    }
})*/
//connection.deleteAll()
/*connection.getAll((err, res) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log('new length is ' + res.length)
    }
})*/
//connection.dropTable()
//connection.closeConnection()