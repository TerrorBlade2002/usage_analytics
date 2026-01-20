const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

// POST /api/log - Log an interaction (called by GPT)
router.post('/log', async (req, res) => {
    try {
        const {
            portfolio_id,
            portfolio_name,
            session_id,
            query_summary,
            response_summary,
            input_type
        } = req.body;

        // Validate required fields
        if (!portfolio_id && !portfolio_name) {
            return res.status(400).json({
                error: 'Either portfolio_id or portfolio_name is required'
            });
        }

        // Resolve portfolio_id from name if needed
        let resolvedPortfolioId = portfolio_id;
        if (!resolvedPortfolioId && portfolio_name) {
            const portfolios = await db.getPortfolios();
            const match = portfolios.find(p =>
                p.name.toLowerCase().includes(portfolio_name.toLowerCase())
            );
            if (match) {
                resolvedPortfolioId = match.id;
            } else {
                return res.status(400).json({
                    error: `Portfolio not found: ${portfolio_name}`
                });
            }
        }

        // Generate session_id if not provided (fallback)
        const finalSessionId = session_id || uuidv4();

        const result = await db.logInteraction({
            portfolioId: resolvedPortfolioId,
            sessionId: finalSessionId,
            querySummary: query_summary || '',
            responseSummary: response_summary || '',
            inputType: input_type || 'text'
        });

        res.json({
            success: true,
            interaction_id: result.id,
            timestamp: result.timestamp,
            session_id: finalSessionId
        });
    } catch (error) {
        console.error('Error logging interaction:', error);
        res.status(500).json({ error: 'Failed to log interaction' });
    }
});

// GET /api/stats/:portfolioId - Get stats for a specific portfolio
router.get('/stats/:portfolioId', async (req, res) => {
    try {
        const portfolioId = parseInt(req.params.portfolioId);

        const [stats, daywise, recentQueries] = await Promise.all([
            db.getPortfolioStats(portfolioId),
            db.getDaywiseStats(portfolioId, 30),
            db.getRecentQueries(portfolioId, 50)
        ]);

        res.json({
            portfolio_id: portfolioId,
            stats: {
                total_interactions: parseInt(stats.total_interactions) || 0,
                total_sessions: parseInt(stats.total_sessions) || 0,
                active_days: parseInt(stats.active_days) || 0,
                first_interaction: stats.first_interaction,
                last_interaction: stats.last_interaction
            },
            daywise,
            recent_queries: recentQueries
        });
    } catch (error) {
        console.error('Error getting portfolio stats:', error);
        res.status(500).json({ error: 'Failed to get portfolio stats' });
    }
});

// GET /api/stats - Get stats for all portfolios
router.get('/stats', async (req, res) => {
    try {
        const [allStats, todayStats] = await Promise.all([
            db.getAllPortfoliosWithStats(),
            db.getTodayStats()
        ]);

        // Merge today stats into all stats
        const combined = allStats.map(portfolio => {
            const today = todayStats.find(t => t.portfolio_id === portfolio.id) || {};
            return {
                ...portfolio,
                total_interactions: parseInt(portfolio.total_interactions) || 0,
                total_sessions: parseInt(portfolio.total_sessions) || 0,
                today_interactions: parseInt(today.today_interactions) || 0,
                today_sessions: parseInt(today.today_sessions) || 0
            };
        });

        // Calculate totals
        const totals = {
            total_interactions: combined.reduce((sum, p) => sum + p.total_interactions, 0),
            total_sessions: combined.reduce((sum, p) => sum + p.total_sessions, 0),
            today_interactions: combined.reduce((sum, p) => sum + p.today_interactions, 0),
            today_sessions: combined.reduce((sum, p) => sum + p.today_sessions, 0)
        };

        res.json({
            portfolios: combined,
            totals
        });
    } catch (error) {
        console.error('Error getting all stats:', error);
        res.status(500).json({ error: 'Failed to get all stats' });
    }
});

// GET /api/portfolios - List all portfolios
router.get('/portfolios', async (req, res) => {
    try {
        const portfolios = await db.getPortfolios();
        res.json({ portfolios });
    } catch (error) {
        console.error('Error getting portfolios:', error);
        res.status(500).json({ error: 'Failed to get portfolios' });
    }
});

module.exports = router;
