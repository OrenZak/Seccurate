const mysql = require('mysql2')
const configurationEntity = require('./../data/SavedConfigurationEntity')

class SavedConfigurationCRUD {
    constructor(db) {//should become db_type and read from globals
        this.conn = mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '311248496',
            database: db
        })
        this.conn.connect(function(err) {
            if (err) {
                console.error('error: ' + err);
            } else {
                console.log("mysql connected")
            }
        })
        this.table_name = 'SavedConfigurations'//TODO: should be read from configuration
        this.createTable()
    }

    createTable() {
        const sql = `CREATE TABLE IF NOT EXISTS ?? (id VARCHAR(100) PRIMARY KEY, name VARCHAR(100) UNIQUE, maxDepth INTEGER, timeout INTEGER, interval_crawler INTEGER, maxConcurrency INTEGER, UNIQUE KEY unique_scan (maxDepth,timeout,interval_crawler,maxConcurrency))`
        this.conn.query(sql, [this.table_name], function(err) {
            if (err) {
                console.log(err)
            }
        })
        //this.conn.commit()
    }

    insertValue(value) {
        const id = new Date().toString().split(' ').join('').split('(').join('').split(')').join('').split(':').join('').split('+').join('')+Math.floor(Math.random()*100000)
        const sql = `INSERT INTO ?? VALUES (?,?,?,?,?,?)`
        /*if (value.getDefaultScan()) {
            this.getDefaultValue((err, value) => {
                if (err) {
                    console.log(err)
                }
                else if (value.length > 0){
                    this.updateValue(new configurationEntity(value[0]['id'], value[0]['maxDepth'], value[0]['timeout'], value[0]['interval_crawler'], value[0]['maxConcurrency'], false));
                }
            })
        }*/
        //TODO: I assume that all three extra values are here. This should be checked in a different layer
        this.conn.query(sql, [this.table_name, id, value.getName(), value.getMaxDepth(), value.getTimeout(), value.getInterval(), value.getMaxConcurrency()], (err) => {
            if (err) {
                console.log(err)
            }
        })
        value.setID(id)
        return value
    }

    updateValue(new_value) {
        this.getValue(new_value.getID(), function (err, res) {
            if (err) {
                throw new Error('No such value ' + new_value.getID() + '\n' + err)
            }
        })
        const sql = `UPDATE ?? SET name=?, maxDepth=?, timeout=?, interval_crawler=?, maxConcurrency=? WHERE id=?`
        /*if (new_value.getDefaultScan()) {
            this.getDefaultValue((err, value) => {
                if (err) {
                    console.log(err)
                }
                else if (value.length > 0 && value[0]['id'] != new_value.getID()) {
                    this.updateValue(new configurationEntity(value[0]['id'], value[0]['maxDepth'], value[0]['timeout'], value[0]['interval_crawler'], value[0]['maxConcurrency'], false));
                }
            })
        }*/
        this.conn.query(sql,[this.table_name, new_value.getName(), new_value.getMaxDepth(), new_value.getTimeout(), new_value.getInterval(), new_value.getMaxConcurrency(), new_value.getID()], (err) => {
            if (err) {
                console.log(err)
            }
        })
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

    getIDByValue(value, callback)
    {
        const sql = `SELECT id FROM ?? WHERE maxDepth=? AND timeout=? AND interval_crawler=? AND maxConcurrency=?`
        this.conn.query(sql,[this.table_name, value.getMaxDepth(), value.getTimeout(), value.getInterval(), value.getMaxConcurrency()], function (err, result) {
            if (!err) {
                callback(null, result)
            }
            else {
                console.log(err)
            }
        })
    }

    /*getDefaultValue(callback) {
        const sql = 'SELECT * FROM ?? WHERE default_scan=true';
        this.conn.query(sql,[this.table_name], function (err,result) {
            if (!err) {
                callback(null, result);
            }
            else {
                console.log(err)
            }
        })
    }*/

    getAll(callback, page=0, size=10) {
        let intPage = parseInt(page,10);
        let intSize = parseInt(size,10);
        const sql = `SELECT * from ?? ORDER BY id ASC LIMIT ? OFFSET ?`;
        this.conn.query(sql, [this.table_name,intSize,intPage*intSize], function(err, results) {
            if (!err) {
                callback(null, results)
            }
            else {
                console.log(err)
            }
        })
    }
    
    deleteValue(id){
        this.getValue(id, function (err, res) {
            if (err) {
                throw new Error('No such value ' + id + '\n' + err)
            }
        })
        const sql = `DELETE FROM ?? WHERE id=?`
        this.conn.query(sql, [this.table_name, id, (err) => {
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
module.exports = SavedConfigurationCRUD

//console.log('Config'+new Date().toString().split(' ').join('').split('(').join('').split(')').join('').split(':').join('').split('+').join('')+Math.random()*100000)
//  var entity1 = new configurationEntity(null, 6,6,6,6, true)
//  var entity2 = new configurationEntity(null, 5, 5, 5, 5, true)
//  connection = new SavedConfigurationCRUD('test')
//  //connection.createTable()
//  var value1 = connection.insertValue(entity1)
//  var value2 = connection.insertValue(entity2)
//  console.log('out - value1 interval is ' + value1.getInterval())
//  console.log('out - value2 interval is ' + value2.getInterval())
//  value2.setInterval(4)
//  var new_value2 = connection.updateValue(value2)
//  console.log('after update - value2 interval is ' + new_value2.getInterval())
//  connection.getAll(function(err, data) {
//      if (err) {
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
/*connection.deleteAll()
connection.getAll((err, res) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log('new length is ' + res.length)
     }
 })*/
//connection.dropTable()
//connection.closeConnection()