var mysql = require('mysql2');
var pool = mysql.createPool({
    connectionLimit: process.env.MYSQL_CONNECTIONS,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DBNAME
});

module.exports = pool;
