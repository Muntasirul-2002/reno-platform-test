import mysql from 'mysql2/promise'

export const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    connectTimeout: 10000,
    idleTimeout: 30000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    port : Number(process.env.DB_PORT) || 3306
})


export async function testConnection() {

    try {
        const connection = await db.getConnection()
        await connection.ping()
        console.log('Database connection successful')
    } catch (error) {
        console.error('Database connection failed:', error)
    }
}