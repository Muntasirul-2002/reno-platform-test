import mysql from 'mysql2/promise'

export const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port : Number(process.env.DB_PORT) || 3306,
    ssl:{
        rejectUnauthorized: false
    },
    charset: 'utf8mb4',
    connectionLimit: 10,

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