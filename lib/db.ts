import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://n8n:MEoWl2aT7ZDSqC2@n8n.showcasehq.xyz:5432/n8n_db',
  ssl: false // Disable SSL since the server doesn't support it
})

export default pool
