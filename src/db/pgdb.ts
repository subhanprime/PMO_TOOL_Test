const { Pool } = require('pg');

// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'node_postgre',
//     password: '12345',
//     port: 5432,
// });

const pool = new Pool({
    user: 'postgres',
    host: 'db-postgres.chcuo48sw7kv.ap-south-1.rds.amazonaws.com',
    database: 'initial_db',
    password: 'database2612',
    port: 5432,
    ssl: { rejectUnauthorized: false }
});

export default pool;
