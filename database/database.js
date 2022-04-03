const { Pool } = require('pg')

const pool = new Pool({
    user: 'root',
    host: 'database.server.com',
    database: 'mydb',
    password: '',
    port: 5432,
  })
  

module.exports = pool;
