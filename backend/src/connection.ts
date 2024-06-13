import mysql from 'promise-mysql';

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'voluntex',
});

pool.getConnection()
    .then(connection => {
        pool.releaseConnection(connection);
        console.log('DB is Connected');
    });

export default pool;