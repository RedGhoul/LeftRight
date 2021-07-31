var mysql = require('mysql2');
var pool = mysql.createPool({
    connectionLimit: process.env.MYSQL_CONNECTIONS,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    port: process.env.MYSQL_PORT,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DBNAME
});

module.exports = pool;
