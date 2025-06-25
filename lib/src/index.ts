import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: {
    rejectUnauthorized: false // This tells the client to trust self-signed certificates
  }
});

const db = drizzle(pool);

export async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Test the connection when this module is imported
testConnection().catch(console.error);
export default db;