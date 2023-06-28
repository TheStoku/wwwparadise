const mysql = require('mysql2');
const config = require('config');

const connection = mysql.createPool({
	host: config.get('database.host'),
	port: config.get('database.port'),
	user: config.get('database.user'),
	password: config.get('database.password'),
	database: config.get('database.database'),
	waitForConnections: true,
	connectionLimit: 10,
	maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
	idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
	queueLimit: 0,
	enableKeepAlive: true,
	keepAliveInitialDelay: 0,
	connectTimeout: 60000,
});
/*
var connection = mysql.createConnection({
    host: config.get("database.host"),
    port: config.get("database.port"),
    user: config.get("database.user"),
    password: config.get("database.password"),
    database: config.get("database.database")
});
*/
module.exports = connection;
