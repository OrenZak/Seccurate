const mysql = require('mysql2');
const globals = require('../common/globals');
const vaildators = require('../dao/dataValidation');

class UsersCRUD {
    constructor(db_type) {//should be read from globals
        let index;
        if (db_type == 'test') {
            index = 0;
        } else if (db_type == 'prod') {
            index = 1;
        } else throw new Error('Wrong DB type specified - ' + db_type);
        let dbInfo = globals.DB_INFO;
        dbInfo.database = globals.API_GW_DB_NAME.split(':')[index];
        this.conn = mysql.createConnection(dbInfo);
        this.conn.connect(function (err) {
            if (err) {
                throw err;
            } else {
                console.log("mysql connected")
            }
        })
        this.table_name = globals.USERS_CRUD_TABLE;
        this.createTable()
    }

	createTable() {
		const sql = `CREATE TABLE IF NOT EXISTS ?? (username VARCHAR(30) PRIMARY KEY, salt VARCHAR(100) NOT NULL, passwordHash VARCHAR(256) NOT NULL, admin BOOLEAN)`;
		this.conn.query(sql, [this.table_name], function(err) {
			if (err) {
				throw err;
			}
		});
	}

	insertValue(value, callback) {
		this.validateValue(value);
		const sql = `INSERT INTO ?? VALUES (?,?,?,?)`;
		this.conn.query(
			sql,
			[this.table_name, value.getUsername(), value.getSalt(), value.getPasswordHash(), value.getAdmin()],
			(err, result) => {
				if (err) {
					throw err;
				} else {
					callback(null, result);
				}
			},
		);
	}

	updateValue(new_value, callback) {
		this.validateValue(new_value);
		this.getValue(new_value.getUsername(), function(err, res) {
			if (err) {
				throw err;
			}
		});
		const sql = `UPDATE ?? SET admin=? WHERE username=?`;
		this.conn.query(
			sql,
			[
				this.table_name,
				new_value.getAdmin(),
				new_value.getUsername(),
			],
			(err, result) => {
				if (err) {
					throw err;
				} else {
					callback(null, result);
				}
			},
		);
		return new_value;
	}

	validateValue (value) {
        if (!vaildators.checkString(value.getUsername()))
            throw new Error('Wrong userName value supplied');
        if (value.getSalt() && !vaildators.checkString(value.getSalt()))
			throw new Error('Wrong salt value supplied');
		if (value.getPasswordHash() && !vaildators.checkString(value.getPasswordHash()))
			throw new Error('Wrong password value supplied');
        if (value.getAdmin() != 0 && value.getAdmin() != 1)
            throw new Error('Wrong url value supplied');
    }

	getValue(username, callback) {
		const sql = `SELECT * FROM ?? WHERE username=?`;
		this.conn.query(sql, [this.table_name, username], function(err, result) {
			if (!err) {
				callback(null, result);
			} else {
				throw err;
				//callback(err, result);
			}
		});
	}

	getAll(callback, page = 0, size = 20) {
		let intPage = parseInt(page, 10);
		let intSize = parseInt(size, 10);
		const sql = `SELECT username, admin from ?? ORDER BY username ASC LIMIT ? OFFSET ?`;
		this.conn.query(sql, [this.table_name, intSize, intPage * intSize], function(err, results) {
			if (!err) {
				callback(null, results);
			} else {
				throw err;
			}
		});
	}

	deleteValue(username, callback) {
		const sql = `DELETE FROM ?? WHERE username=?`;
		this.conn.query(sql, [this.table_name, username], (err, result) => {
			if (err) {
				throw err;
				//callback(err, false);
			} else {
				callback(null, true);
			}
		});
	}

	deleteAll() {
		const sql = `DELETE FROM ??`;
		this.conn.query(sql, [this.table_name], err => {
			if (err) {
				throw err;
			}
		});
	}

	dropTable() {
		const sql = `DROP TABLE ??`;
		return this.conn.query(sql, [this.table_name], err => {
			if (err) {
				throw err;
			}
		});
	}

	closeConnection() {
		this.conn.end(function(err) {
			if (err) {
				throw err;
			}
		});
		console.log('disconnected from db');
	}
}

module.exports = UsersCRUD;
