const mysql = require('mysql2');
const Promise = require('bluebird');
const globals = require('../common/globals');

class DAO {
    constructor(db) {//should become db_type and read from globals
        //this.db = new sqlite3.Database(db)
        let dbInfo = globals.DB_INFO;
        dbInfo.database = db;
        this.db = mysql.connect(dbInfo);
    }

    run(sql_command, params=[]) {
        return new Promise((resolve, reject) => {
            this.db.run(sql_command, params, (err) => {
                if (err) {
                    reject(err)
                } else {
                    console.log(this.lastID)
                    resolve(this.lastID)
                }
            })
        })
    }

    get(sql_command, params=[]) {
        return new Promise((resolve, reject) => {
            this.db.get(sql_command, params, (err,result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }

    all(sql_command, params=[]) {
        return new Promise((resolve, reject) => {
            this.db.all(sql_command, params, (err,rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }
}

module.exports = DAO