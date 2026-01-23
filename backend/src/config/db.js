import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING;

const pool = new Pool(
  connectionString
    ? { connectionString }
    : {
        host: process.env.PGHOST || 'localhost',
        port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
        user: process.env.PGUSER || process.env.USER,
        password: process.env.PGPASSWORD || undefined,
        database: process.env.PGDATABASE || 'taskhub'
      }
);

export async function query(text, params) {
  return pool.query(text, params);
} 


export default pool;
