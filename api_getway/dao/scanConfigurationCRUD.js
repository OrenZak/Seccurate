const mysql = require('mysql2')
const configurationEntity = require('../data/ConfigurationEntity')

class ScanConfigHistoryCRUD {
    constructor(db) {//should become db_type and read from globals
        this.conn = mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            //password: '18031997',
            database: db
        })
        this.conn.connect(function(err) {
            if (err) {
                console.error('error: ' + err);
            } else {
                console.log("mysql connected")
            }
        })
        this.table_name = 'ConfigurationsHistory'//TODO: should be read from configuration
        this.createTable()
    }

    createTable() {
        const sql = `CREATE TABLE IF NOT EXISTS ?? (id VARCHAR(100) PRIMARY KEY, maxDepth INTEGER, timeout INTEGER, interval_crawler INTEGER, maxConcurrency INTEGER, vulnsScanned VARCHAR(100) NOT NULL, credentials VARCHAR(300), loginPage VARCHAR(200))`
        this.conn.query(sql, [this.table_name], function(err) {
            if (err) {
                console.log(err)
            }
        })
        //this.conn.commit()
    }

    insertValue(value) {
        const id = new Date().toString().split(' ').join('').split('(').join('').split(')').join('').split(':').join('').split('+').join('')+Math.floor(Math.random()*100000)
        if (!value.getCredentials() || !value.getLoginPage()) {
            const sql = `INSERT INTO ??(id, maxDepth, timeout, interval_crawler, maxConcurrency, vulnsScanned) VALUES(?,?,?,?,?,?)`
            this.conn.query(sql, [this.table_name, id, value.getMaxDepth(), value.getTimeout(), value.getInterval(), value.getMaxConcurrency(), value.getVulnsScanned()], (err) => {
                if (err) {
                    console.log(err)
                }
            })
        }
        else {
            const sql = `INSERT INTO ?? VALUES (?,?,?,?,?,?,?,?)`
            //TODO: I assume that all three extra values are here. This should be checked in a different layer
            this.conn.query(sql, [this.table_name, id, value.getMaxDepth(), value.getTimeout(), value.getInterval(), value.getMaxConcurrency(), value.getVulnsScanned(), value.getCredentials(), value.getLoginPage()], (err) => {
                if (err) {
                    console.log(err)
                }
            })
        }
        value.setID(id)
        return value;
    }

    updateValue(new_value) {
        this.getValue(new_value.getID(), function (err, res) {
            if (err) {
                throw new Error('No such value ' + new_value.getID() + '\n' + err)
            }
        })
        if (!new_value.getCredentials() || !new_value.getLoginPage()) {
            const sql = `UPDATE ?? SET maxDepth=?, timeout=?, interval_crawler=?, maxConcurrency=?, vulnsScanned=? WHERE id=?`
            this.conn.query(sql, [this.table_name, new_value.getMaxDepth(), new_value.getTimeout(), new_value.getInterval(), new_value.getMaxConcurrency(), new_value.getVulnsScanned(), new_value.getID()], (err) => {
                if (err) {
                    console.log(err)
                }
            })
        }
        else {
            const sql = `UPDATE ?? SET maxDepth=?, timeout=?, interval_crawler=?, maxConcurrency=?, vulnsScanned=?, credentials=?, loginPage=? WHERE id=?`
            this.conn.query(sql,[this.table_name, new_value.getMaxDepth(), new_value.getTimeout(), new_value.getInterval(), new_value.getMaxConcurrency(), new_value.getVulnsScanned(), new_value.getCredentials(), new_value.getLoginPage(), new_value.getID()], (err) => {
                if (err) {
                    console.log(err)
                }
            })
        }
        return new_value
    }

    getValue(value_id, callback) {
        const sql = `SELECT * FROM ?? WHERE id=?`
        this.conn.query(sql,[this.table_name, value_id], function (err, result) {
            if (!err) {
                callback(null, result)
            }
            else {
                console.log(err)
            }
        })
    }

    getAll(callback, page=0, size=10) {
        const sql = `SELECT * from ?? ORDER BY id ASC LIMIT ?,?`
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
        this.getValue(value.getID(), this.table_name, function (err, res) {
            if (err) {
                throw new Error('No such value ' + value.getID() + '\n' + err)
            }
        })
        const sql = `DELETE FROM ?? WHERE id=?`
        this.conn.query(sql, [this.table_name, value.getID(), (err) => {
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
module.exports = ScanConfigHistoryCRUD;

//console.log('Config'+new Date().toString().split(' ').join('').split('(').join('').split(')').join('').split(':').join('').split('+').join('')+Math.random()*100000)
// var entity1 = new configurationEntity(null, 6,6,6,6, 'a;b')
// var entity2 = new configurationEntity(null, 5, 5, 5, 5, 'a;b', 'login;password', 'abcde')
// connection = new ScanConfigHistoryCRUD('test')
// connection.createTable()
// var value1 = connection.insertValue(entity1)
// var value2 = connection.insertValue(entity2)
// console.log('out - value1 credentials are ' + value1.getCredentials())
// console.log('out - value2 credentials are ' + value2.getCredentials())
// value2.setCredentials('login;password')
// var new_value2 = connection.updateValue(value2)
// console.log('after update - value2 credentials are ' + new_value2.getCredentials())
// connection.getAll(function(err, data) {
//     if (err) {
//         console.log(err)
//     }
//     else {
//         console.log(data)
//         console.log('length is ' + data.length)
//     }
// })
// connection.getValue(value1.getID(), (err, data) => {
//     if (err) {
//         console.log(err)
//     }
//     else {
//         Object.keys(data[0]).forEach(element => {
//             console.log(element + ': ' + data[0][element])
//         })
//     }
// })
// /*connection.deleteAll()
// connection.getAll((err, res) => {
//     if (err) {
//         console.log(err)
//     }
//     else {
//         console.log('new length is ' + res.length)
//     }
// })*/
// //connection.dropTable()
// connection.closeConnection()