const mysql = require('mysql2')
const pageEntity = require('../data/PageEntity')

class PageCRUD {
    constructor(db, table_name) {//should become db_type and read from globals
        this.conn = mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            //password: '18031997',
            database: db
        })
        this.conn.connect(function (err) {
            if (err) {
                console.error('error: ' + err);
            } else {
                console.log("mysql connected")
            }
        })
        this.table_name = table_name;
        this.createTable(this.table_name)
    }

    createTable(table_name) {
        const sql = `CREATE TABLE IF NOT EXISTS ?? (url VARCHAR(100) PRIMARY KEY)`
        this.conn.query(sql, [table_name], function (err) {
            if (err) {
                console.log("in create: " + err)
            }
        })
    }

    insertValue(value) {
        const sql = `INSERT INTO ?? VALUES (?)`
        this.conn.query(sql, [this.table_name, value.getURL()], (err) => {
            if (err) {
                console.log("in insert: " + err)
            }
        })
        return value;
    }

    getValue(value_id, callback) {
        const sql = `SELECT * FROM ?? WHERE url=?`
        this.conn.query(sql, [this.table_name, value_id], function (err, result) {
            if (!err) {
                callback(null, result)
            } else {
                console.log("in get value: " + err)
            }
        })
    }

    getAll(callback, page = 0, size = 10) {
        let intPage = parseInt(page, 10);
        let intSize = parseInt(size, 10);
        const sql = `SELECT * from ?? ORDER BY url ASC LIMIT ? OFFSET?`
        this.conn.query(sql, [this.table_name,intSize,intPage*intSize], function (err, results) {
            if (!err) {
                callback(null, results)
            } else {
                console.log("in getAll: " + err)
            }
        })
    }

    deleteValue(value) {
        this.getValue(value.getURL(), this.table_name, function (err, res) {
            if (err) {
                throw new Error('No such value ' + value.getURL() + '\n' + err)
            }
        })
        const sql = `DELETE FROM ?? WHERE url=?`
        this.conn.query(sql, [this.table_name, value.getURL(), (err) => {
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
        this.conn.end(function (err) {
            if (err) {
                console.log(err)
            }
        })
        console.log('disconnected from db')
    }
}

module.exports = PageCRUD;

//var table_name = new Date().toString().split(' ').join('').split('(').join('').split(')').join('').split(':').join('').split('+').join('')+Math.random()*100000
/*var entity1 = new pageEntity('abc', 'a','a','a','1573640900856');
var entity2 = new pageEntity('def', 'b', 'b', 'b', '1573640900861');
connection = new PageCRUD('test', 'aaa')
//connection.createTable(table_name)
var value1 = connection.insertValue(entity1,  'aaa')
var value2 = connection.insertValue(entity2,  'aaa')
console.log('out - value1 type is ' + value1.getSessionType())
console.log('out - value2 type is ' + value2.getSessionType())
value2.setSessionType('c')
var new_value2 = connection.updateValue(value2,  'aaa')
console.log('after update - value2 type is ' + new_value2.getSessionType())
connection.getAll( 'aaa', function(err, data) {
    if (err) {
        console.log(err)
    }
    else {
        console.log(data)
        console.log('length is ' + data.length)
    }
})
connection.getValue(value1.getURL(), 'aaa', (err, data) => {
    if (err) {
        console.log(err)
    }
    else {
        Object.keys(data[0]).forEach(element => {
            console.log(element + ': ' + data[0][element])
        })
    }
})*/
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