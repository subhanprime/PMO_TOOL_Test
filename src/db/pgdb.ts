
import { Pool, Client } from 'pg';
import { Sequelize } from 'sequelize'


// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'node_postgre',
//     password: '12345',
//     port: 5432,
// });

// const pool = new Pool({
//     user: 'postgres',
//     host: 'db-postgres.chcuo48sw7kv.ap-south-1.rds.amazonaws.com',
//     database: 'initial_db',
//     password: 'database2612',
//     port: 5432,
//     ssl: { rejectUnauthorized: false }
// });
const pool = new Pool({
    user: 'postgres',
    host: 'db-postgres.chcuo48sw7kv.ap-south-1.rds.amazonaws.com',
    database: 'initial_db',
    password: 'database2612',
    port: 5432,
    ssl: {
        rejectUnauthorized: false,
    },
});


const sequelize = new Sequelize('postgres://postgres:database2612@db-postgres.chcuo48sw7kv.ap-south-1.rds.amazonaws.com:5432/initial_db', {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
});

export { pool, sequelize };
