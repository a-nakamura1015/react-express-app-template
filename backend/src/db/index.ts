import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

export const initDb = async () => {
  try {
    await db.getConnection();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};
