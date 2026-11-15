import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

declare global {
  var _neonPgPool: Pool | undefined;
}

export function getPool(): Pool {
  if (!global._neonPgPool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not configured.');
    }

    global._neonPgPool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 15000,
    });

    global._neonPgPool.on('error', (err) => {
      console.error('Unexpected idle PostgreSQL client error:', err);
    });
  }

  return global._neonPgPool;
}
