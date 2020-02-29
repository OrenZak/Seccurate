const mysql = require('mysql2');
const configurationEntity = require('../data/SavedConfigurationEntity');
const globals = require('../common/globals');
const vaildators = require('../dao/dataValidation');

class SavedConfigurationCRUD {
    constructor(db) {//should become db_type and read from globals
        let dbInfo = globals.DB_INFO;
        dbInfo.database = db;
        this.conn = mysql.createConnection(dbInfo);
        this.conn.connect(function(err) {
            if (err) {
                throw err;
            } else {
                console.log("mysql connected")
            }
        });
        this.table_name = 'SavedConfigurations'//TODO: should be read from configuration
        this.createTable()
    }

    createTable() {
        const sql = `CREATE TABLE IF NOT EXISTS ?? (id VARCHAR(100) PRIMARY KEY, name VARCHAR(100) UNIQUE, maxDepth INTEGER, timeout INTEGER, interval_crawler INTEGER, UNIQUE KEY unique_scan (maxDepth,timeout,interval_crawler))`
        this.conn.query(sql, [this.table_name], function(err) {
            if (err) {
                throw err;
            }
        })
    }

    insertValue(value) {
        this.validateValue(value);
        const id = new Date().toString().split(' ').join('').split('(').join('').split(')').join('').split(':').join('').split('+').join('')+Math.floor(Math.random()*100000)
        let name = id;
        if (value.getName() != null) {
            name = value.getName()
        }
        const sql = `INSERT INTO ?? VALUES (?,?,?,?,?)`
        this.conn.query(sql, [this.table_name, id, name, value.getMaxDepth(), value.getTimeout(), value.getInterval()], (err) => {
            if (err) {
                throw err;
            }
        })
        value.setID(id)
        return value
    }

    updateValue(new_value) {
        this.validateValue(new_value);
        this.getValue(new_value.getID(), function (err, res) {
            if (err) {
                throw new Error('No such value ' + new_value.getID() + '\n' + err)
            }
        })
        const sql = `UPDATE ?? SET name=?, maxDepth=?, timeout=?, interval_crawler=? WHERE id=?`
        this.conn.query(sql,[this.table_name, new_value.getName(), new_value.getMaxDepth(), new_value.getTimeout(), new_value.getInterval(), new_value.getID()], (err) => {
            if (err) {
                throw err;
            }
        })
        return new_value
    }

    validateValue (value) {
        if (!vaildators.checkNumericValues('interval', value.getInterval()))
            throw new Error('Wrong interval value supplied');
        if (!vaildators.checkNumericValues('maxDepth', value.getMaxDepth()))
            throw new Error('Wrong maxDepth value supplied');
        if (!vaildators.checkNumericValues('timeout', value.getTimeout()))
            throw new Error('Wrong timeout value supplied');
        if (!vaildators.checkString(value.getName()))
            throw new Error('Wrong name value supplied');
    }

    getValue(value_id, callback) {
        const sql = `SELECT * FROM ?? WHERE id=?`
        this.conn.query(sql,[this.table_name, value_id], function (err, result) {
            if (!err) {
                callback(null, result)
            }
            else {
                throw err;
            }
        })
    }

    getValueCount(callback) {
        const sql = `SELECT COUNT(*) as value FROM ??`
        this.conn.query(sql,[this.table_name], function (err, result) {
            if (!err) {
                callback(null, result[0].value)
            }
            else {
                throw err;
            }
        })
    }

    getAll(callback, page=0, size=10) {
        let intPage = parseInt(page,10);
        let intSize = parseInt(size,10);
        const sql = `SELECT * from ?? ORDER BY id ASC LIMIT ? OFFSET ?`;
        this.conn.query(sql, [this.table_name,intSize,intPage*intSize], function(err, results) {
            if (!err) {
                callback(null, results)
            }
            else {
                throw err;
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
                throw err;
            }
        }])
    }

    deleteAll() {
        const sql = `DELETE FROM ??`
        this.conn.query(sql, [this.table_name], (err) => {
            if (err) {
                throw err;
            }
        })
    }

    dropTable() {
        const sql = `DROP TABLE ??`
        return this.conn.query(sql, [this.table_name], (err) => {
            if (err) {
                throw err;
            }
        })
    }

    closeConnection() {
        this.conn.end(function(err) {
            if (err) {
                throw err;
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