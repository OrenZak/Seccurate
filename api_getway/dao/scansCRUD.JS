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
        const sql = `CREATE TABLE IF NOT EXISTS ?? (name VARCHAR(100), scan_timestamp VARCHAR(30) PRIMARY KEY, description VARCHAR(200), configuration VARCHAR(100), pageTableName VARCHAR(100), FOREIGN KEY(configuration) REFERENCES test.ConfigurationsHistory(id) on delete cascade)`
        this.conn.query(sql, [this.table_name], function(err) {
            if (err) {
                console.log(err)
            }
        })
    }

    insertValue(value) {
        const sql2 = `INSERT INTO ?? VALUES (?,?,?,?,?)`
        this.conn.query(sql2, [this.table_name, value.getName(), value.getTimestamp(), value.getDescription(), value.getConfiguration(), value.getPageTableName()], (err) => {
            if (err) {
                console.log(err)
            }
        })
    }

    /*updateValue(new_value) {
        this.getValue(new_value.getTimestamp(), async function (err, res) {
            if (err) {
                throw new Error('No such value ' + new_value.getName() + '\n' + err)
            }
        })
        const sql = `UPDATE ?? SET name=?, timeout=?, interval_crawler=?, maxConcurrency=? WHERE id=?`
        this.conn.query(sql,[this.table_name, new_value.getMaxDepth(), new_value.getTimestamp()], async (err) => {
            if (err) {
                console.log(err)
            }
        })
    }*/

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

    getByForeignKey(fk, callback){
        const sql = `SELECT * FROM ?? WHERE configuration=?`
        this.conn.query(sql,[this.table_name, fk], function (err, result) {
            if (!err) {
                callback(null, result)
            }
            else {
                console.log(err)
            }
        })
    }

    getAll(callback, page=0, size=20) {
        const sql = `SELECT * from ?? ORDER BY scan_timestamp ASC LIMIT ?,?`
        this.conn.query(sql, [this.table_name, page*size, (page*size)+size], function(err, results) {
            if (!err) {
                callback(null, results)
            }
            else {
                console.log(err)
            }
        })
    }
    
    deleteValue(value){
        this.getValue(value.getTimestamp(), this.table_name, function (err, res) {
            if (err) {
                throw new Error('No such value ' + value.getName() + '\n' + err)
            }
        })
        const sql = `DELETE FROM ?? WHERE scan_timestamp=?`
        this.conn.query(sql, [this.table_name, value.getTimestamp(), (err) => {
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