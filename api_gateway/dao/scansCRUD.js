const mysql = require('mysql2');
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
        let dbInfo = globals.DB_INFO;
        dbInfo.database = globals.API_GW_DB_NAME.split(':')[index];
        this.conn = mysql.createConnection(dbInfo);
        this.conn.connect(function(err) {
            if (err) {
                throw err;
            } else {
                console.log("mysql connected")
            }
        });
        this.table_name = globals.SCAN_CRUD_TABLE;
        this.createTable()
    }

    createTable() {
        const sql = `CREATE TABLE IF NOT EXISTS ?? (name VARCHAR(100), scanID VARCHAR(30) PRIMARY KEY, description VARCHAR(200), pageTableID VARCHAR(100), maxDepth INTEGER, timeout INTEGER, interval_crawler INTEGER, scanType VARCHAR(100) NOT NULL, scanCompleted BOOLEAN, loginInfo VARCHAR(300), url VARCHAR(200))`
        this.conn.query(sql, [this.table_name], function(err) {
            if (err) {
                throw err;
            }
        })
    }

    insertValue(value) {
        if (!value.getLoginInfo()) {
            const sql2 = `INSERT INTO ?? VALUES (name, scanID, description, pageTableID, maxDepth, timeout, interval_crawler, scanType, scanCompleted, url)`
            this.conn.query(sql2, [this.table_name, value.getName(), value.getScanID(), value.getDescription(),
                value.getPageTableID(), value.getMaxDepth(),value.getTimeout(), value.getInterval(),
                value.getScanType(), value.isScanCompleted(), value.getURL()], (err) => {
                if (err) {
                    throw err;
                }
            })
        }
        else {
            const sql = `INSERT INTO ?? VALUES (?,?,?,?,?,?,?,?,?,?,?)`
            this.conn.query(sql, [this.table_name, value.getName(), value.getScanID(), value.getDescription(),
                value.getPageTableID(), value.getMaxDepth(), value.getTimeout(), value.getInterval(),
                value.getScanType(), value.isScanCompleted(), value.getLoginInfo(), value.getURL()], (err) => {
                if (err) {
                    throw err;
                }
            })
        }
    }

    updateValue(new_value) {
        this.getValue(new_value.getScanID(), function (err, res) {
            if (err) {
                throw new Error('No such value ' + new_value.getName() + '\n' + err)
            }
        })
        if (!new_value.getLoginInfo()) {
            const sql = `UPDATE ?? SET name=?, description=?, maxDepth=?, timeout=?, interval_crawler=?, scanType=?, scanCompleted=?, url=? WHERE scanID=?`
            this.conn.query(sql, [this.table_name, new_value.getName(), new_value.getDescription(),
                new_value.getMaxDepth(), new_value.getTimeout(), new_value.getInterval(),
                new_value.getScanType(), new_value.isScanCompleted(), new_value.getURL(), new_value.getScanID()], (err) => {
                if (err) {
                    throw err;
                }
            })
        }
        else {
            const sql = `UPDATE ?? SET name=?, description=?, maxDepth=?, timeout=?, interval_crawler=?, scanType=?, scanCompleted=?, loginInfo=?, url=? WHERE scanID=?`
            this.conn.query(sql,[this.table_name, new_value.getName(), new_value.getDescription(),
                new_value.getMaxDepth(),new_value.getTimeout(), new_value.getInterval(),
                new_value.getScanType(), new_value.isScanCompleted(), new_value.getLoginInfo(),
                new_value.getURL(), new_value.getScanID()], (err) => {
                if (err) {
                    throw err;
                }
            })
        }
        return new_value
    }

    updateScanFinished(scanID, callback){
        const sql = `UPDATE ?? SET scanCompleted=TRUE WHERE scanID=?`
        this.conn.query(sql, [this.table_name, scanID], function (err, result) {
            if (!err){
                callback(null, result)
            }
            else{
                throw err;
            }
        })
    }

    getValue(scanID, callback) {
        const sql = `SELECT * FROM ?? WHERE scanID=?`
        this.conn.query(sql,[this.table_name, scanID], function (err, result) {
            if (!err) {
                callback(null, result)
            }
            else {
                throw err;
            }
        })
    }

    getCompletedCount(callback) {
        const sql = `SELECT COUNT(*) as value FROM ?? WHERE scanCompleted=TRUE`
        this.conn.query(sql,[this.table_name], function (err, result) {
            if (!err) {
                callback(null, result[0].value)
            }
            else {
                throw err;
            }
        })
    }

    getNotCompletedCount(callback) {
        const sql = `SELECT COUNT(*) as value FROM ?? WHERE scanCompleted=FALSE`
        this.conn.query(sql,[this.table_name], function (err, result) {
            if (!err) {
                callback(null, result[0].value)
            }
            else {
                throw err;
            }
        })
    }

    getAllCompleted(callback, page=0, size=20) {
        let intPage = parseInt(page, 10);
        let intSize = parseInt(size, 10);
        const sql = `SELECT * from ?? WHERE scanCompleted=TRUE ORDER BY scanID ASC LIMIT ? OFFSET ?`;
        this.conn.query(sql, [this.table_name,intSize,intPage*intSize], function(err, results) {
            if (!err) {
                callback(null, results)
            }
            else {
                throw err;
            }
        })
    }

    getAllNotCompleted(callback, page=0, size=20) {
        let intPage = parseInt(page, 10);
        let intSize = parseInt(size, 10);
        const sql = `SELECT * from ?? WHERE scanCompleted=FALSE ORDER BY scanID ASC LIMIT ? OFFSET ?`;
        this.conn.query(sql, [this.table_name,intSize,intPage*intSize], function(err, results) {
            if (!err) {
                callback(null, results)
            }
            else {
                throw err;
            }
        })
    }

    deleteValue(scanID){
        this.getValue(scanID, function (err, res) {
            if (err) {
                throw new Error('No such value\n' + err)
            }
        })
        const sql = `DELETE FROM ?? WHERE scanID=?`
        this.conn.query(sql, [this.table_name, scanID, (err) => {
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