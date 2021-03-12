const { Client, Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '34e5d10fc71541e786ed75bf8e6b48bc',
    database: 'LeftRight',
});

module.exports = pool;
