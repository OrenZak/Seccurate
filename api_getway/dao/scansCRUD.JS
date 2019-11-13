const mysql = require('mysql2');
const configurationEntity = require('../data/scanEntity');
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
            password: '18031997',
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
        //this.createTable()
    }

    createTable() {
        const sql = `CREATE TABLE IF NOT EXISTS ?? (name VARCHAR(100), scan_timestamp VARCHAR(30) PRIMARY KEY, configuration VARCHAR(100), FOREIGN KEY(configuration) REFERENCES test.ConfigurationsHistory(id) on delete cascade)`
        this.conn.query(sql, [this.table_name], async function(err) {
            if (err) {
                console.log(err)
            }
        })
    }

    insertValue(value) {
        const sql2 = `INSERT INTO ?? VALUES (?,?,?)`
        this.conn.query(sql2, [this.table_name, value.getName(), value.getTimestamp(), value.getConfiguration()], async (err) => {
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
        this.conn.query(sql,[this.table_name, value_timestamp], async function (err, result) {
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
        this.conn.query(sql, [this.table_name, page*size, (page*size)+size], async function(err, results) {
            if (!err) {
                callback(null, results)
            }
            else {
                console.log(err)
            }
        })
    }
    
    deleteValue(value){
        this.getValue(value.getTimestamp(), this.table_name, async function (err, res) {
            if (err) {
                throw new Error('No such value ' + value.getName() + '\n' + err)
            }
        })
        const sql = `DELETE FROM ?? WHERE scan_timestamp=?`
        this.conn.query(sql, [this.table_name, value.getTimestamp(), async (err) => {
            if (err) {
                console.log(err)
            }
        }])
    }

    deleteAll() {
        const sql = `DELETE FROM ??`
        this.conn.query(sql, [this.table_name], async (err) => {
            if (err) {
                console.log(err)
            }
        })
    }

    dropTable() {
        const sql = `DROP TABLE ??`
        return this.conn.query(sql, [this.table_name], async (err) => {
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

var configCRUD = new configurationCRUD('test');
var id1;
var id2;
var connection = new ScansDataCRUD('test');
connection.createTable();
configCRUD.getAll(function (err, data) {
    if (err) {
        console.log(err)
    }
    else {
        //Object.keys(data[0]).forEach(element => {
        //    console.log(element + ': ' + data[0][element])
        //})
        connection.insertValue(new configurationEntity('abc', Date.now()-5, data[0]['id']));
        connection.insertValue(new configurationEntity('def', Date.now(), data[1]['id']));
        //console.log("id1 is " + id1);
    }
})
connection.getAll(function(err, data) {
    if (err) {
        console.log(err)
    }
    else {
        console.log(data)
        console.log('length is ' + data.length)
    }
})
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