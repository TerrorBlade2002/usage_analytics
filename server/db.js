const { Pool } = require('pg');
require('dotenv').config();

// Connection pool for concurrent access
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Support 300+ concurrent users
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.DATABASE_URL?.includes('supabase') || process.env.DATABASE_URL?.includes('neon')
    ? { rejectUnauthorized: false }
    : false
});

// Initialize database schema
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    // Create portfolios table
    await client.query(`
      CREATE TABLE IF NOT EXISTS portfolios (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create interactions table with idempotency
    await client.query(`
      CREATE TABLE IF NOT EXISTS interactions (
        id SERIAL PRIMARY KEY,
        portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE CASCADE,
        session_id VARCHAR(100) NOT NULL,
        query_summary VARCHAR(500),
        response_summary VARCHAR(500),
        input_type VARCHAR(20) DEFAULT 'text',
        timestamp TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create index for fast queries
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_interactions_portfolio_date 
      ON interactions(portfolio_id, timestamp)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_interactions_session 
      ON interactions(session_id)
    `);

    // EXACT 10 portfolio names - no more, no less
    const portfolios = [
      'EVEREST RECEIVABLES Debt Collection Training',
      'Medical Debt Collector Trainer',
      'Auto Loan Debt Collection Trainer',
      'Credit Card Debt Collection Training',
      'CashLane Loans SOP Assist',
      'CDS SOP Assist',
      'ARM Assist',
      'CashLane Collections SOP Assist',
      'Key 2 Recovery Debt Collection Training',
      'Guglielmo & Associates Debt Collection Training'
    ];

    // CLEANUP: Delete any portfolios NOT in the exact list
    const placeholders = portfolios.map((_, i) => `$${i + 1}`).join(', ');
    await client.query(
      `DELETE FROM portfolios WHERE name NOT IN (${placeholders})`,
      portfolios
    );
    console.log('🧹 Cleaned up old portfolios');

    // Insert/update the exact 10 portfolios
    for (const name of portfolios) {
      await client.query(
        `INSERT INTO portfolios (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
        [name]
      );
    }

    console.log('✅ Database initialized with exactly 10 portfolios');
  } finally {
    client.release();
  }
}

// Log an interaction (called by GPT)
async function logInteraction({ portfolioId, sessionId, querySummary, responseSummary, inputType }) {
  const result = await pool.query(
    `INSERT INTO interactions (portfolio_id, session_id, query_summary, response_summary, input_type, timestamp)
     VALUES ($1, $2, $3, $4, $5, NOW())
     RETURNING id, timestamp`,
    [portfolioId, sessionId, querySummary, responseSummary, inputType || 'text']
  );
  return result.rows[0];
}

// Get portfolio stats
async function getPortfolioStats(portfolioId) {
  const result = await pool.query(`
    SELECT 
      COUNT(*) as total_interactions,
      COUNT(DISTINCT session_id) as total_sessions,
      COUNT(DISTINCT DATE(timestamp)) as active_days,
      MAX(timestamp) as last_interaction,
      MIN(timestamp) as first_interaction
    FROM interactions
    WHERE portfolio_id = $1
  `, [portfolioId]);
  return result.rows[0];
}

// Get day-wise stats for a portfolio
async function getDaywiseStats(portfolioId, days = 30) {
  const result = await pool.query(`
    SELECT 
      DATE(timestamp) as date,
      COUNT(*) as interactions,
      COUNT(DISTINCT session_id) as sessions
    FROM interactions
    WHERE portfolio_id = $1 
      AND timestamp >= NOW() - INTERVAL '${days} days'
    GROUP BY DATE(timestamp)
    ORDER BY date DESC
  `, [portfolioId]);
  return result.rows;
}

// Get all portfolios with stats
async function getAllPortfoliosWithStats() {
  const result = await pool.query(`
    SELECT 
      p.id,
      p.name,
      COUNT(i.id) as total_interactions,
      COUNT(DISTINCT i.session_id) as total_sessions,
      MAX(i.timestamp) as last_interaction
    FROM portfolios p
    LEFT JOIN interactions i ON p.id = i.portfolio_id
    GROUP BY p.id, p.name
    ORDER BY p.id
  `);
  return result.rows;
}

// Get today's active sessions across all portfolios
async function getTodayStats() {
  const result = await pool.query(`
    SELECT 
      p.id as portfolio_id,
      p.name as portfolio_name,
      COUNT(i.id) as today_interactions,
      COUNT(DISTINCT i.session_id) as today_sessions
    FROM portfolios p
    LEFT JOIN interactions i ON p.id = i.portfolio_id 
      AND DATE(i.timestamp) = CURRENT_DATE
    GROUP BY p.id, p.name
    ORDER BY p.id
  `);
  return result.rows;
}

// Get all portfolios
async function getPortfolios() {
  const result = await pool.query('SELECT * FROM portfolios ORDER BY id');
  return result.rows;
}

// Get recent queries for a portfolio (for drill-down view)
async function getRecentQueries(portfolioId, limit = 50) {
  const result = await pool.query(`
    SELECT 
      query_summary,
      timestamp,
      session_id
    FROM interactions
    WHERE portfolio_id = $1
      AND query_summary IS NOT NULL 
      AND query_summary != ''
    ORDER BY timestamp DESC
    LIMIT $2
  `, [portfolioId, limit]);
  return result.rows;
}

module.exports = {
  pool,
  initializeDatabase,
  logInteraction,
  getPortfolioStats,
  getDaywiseStats,
  getAllPortfoliosWithStats,
  getTodayStats,
  getPortfolios,
  getRecentQueries
};
