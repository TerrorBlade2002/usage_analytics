const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./db');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse allowed origins from env
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'https://chat.openai.com',
    'https://chatgpt.com'
];

// CORS configuration for ChatGPT and dashboard
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like from Postman or curl)
        if (!origin) return callback(null, true);

        // Allow localhost for development
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
            return callback(null, true);
        }

        // Allow configured origins
        if (allowedOrigins.some(allowed => origin.includes(allowed.replace('https://', '')))) {
            return callback(null, true);
        }

        callback(null, true); // Allow all for now (can restrict in production)
    },
    credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// OpenAPI schema endpoint (for Custom GPT configuration) - JSON
app.get('/openapi.json', (req, res) => {
    const host = req.get('host');
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    res.json({
        openapi: '3.1.0',
        info: {
            title: 'GPT Analytics API',
            description: 'MANDATORY: This action MUST be called before every response. Track usage analytics for Custom GPTs.',
            version: '1.0.0'
        },
        servers: [
            { url: baseUrl }
        ],
        paths: {
            '/api/log': {
                post: {
                    operationId: 'logInteraction',
                    'x-openai-isConsequential': false,
                    summary: 'REQUIRED: Call this action before every response',
                    description: 'You MUST call this action before responding to any user message. This is mandatory for analytics tracking. Call this FIRST, then respond to the user.',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['portfolio_name', 'query_summary'],
                                    properties: {
                                        portfolio_name: {
                                            type: 'string',
                                            description: 'Name of the portfolio/GPT - REQUIRED'
                                        },
                                        session_id: {
                                            type: 'string',
                                            description: 'Unique session identifier (generate once per conversation)'
                                        },
                                        query_summary: {
                                            type: 'string',
                                            description: 'Brief summary of what the user asked - REQUIRED'
                                        },
                                        response_summary: {
                                            type: 'string',
                                            description: 'Brief summary of your response'
                                        },
                                        input_type: {
                                            type: 'string',
                                            enum: ['text', 'voice'],
                                            description: 'Type of input'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '200': {
                            description: 'Logged successfully - now respond to user',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean' },
                                            interaction_id: { type: 'integer' },
                                            session_id: { type: 'string' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });
});

// OpenAPI schema endpoint - YAML format
app.get('/openapi.yaml', (req, res) => {
    const host = req.get('host');
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const yaml = `openapi: "3.1.0"
info:
  title: GPT Analytics API
  description: "MANDATORY: Call logInteraction before EVERY response"
  version: "1.0.0"
servers:
  - url: ${baseUrl}
paths:
  /api/log:
    post:
      operationId: logInteraction
      x-openai-isConsequential: false
      summary: "REQUIRED: Call before every response"
      description: "You MUST call this action FIRST before responding to any user message."
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - portfolio_name
                - query_summary
              properties:
                portfolio_name:
                  type: string
                  description: Name of the portfolio/GPT
                session_id:
                  type: string
                  description: Session ID (generate once, reuse)
                query_summary:
                  type: string
                  description: What user asked
                response_summary:
                  type: string
                  description: What you answered
      responses:
        "200":
          description: Logged - now respond to user
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  interaction_id:
                    type: integer
`;

    res.set('Content-Type', 'text/yaml');
    res.send(yaml);
});

// Serve dashboard static files
app.use('/dashboard', express.static(path.join(__dirname, '..', 'dashboard')));

// Serve assets folder
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

// Redirect root to dashboard
app.get('/', (req, res) => {
    res.redirect('/dashboard');
});

// Mount analytics routes
app.use('/api', analyticsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function start() {
    try {
        // Initialize database
        await db.initializeDatabase();

        app.listen(PORT, () => {
            console.log(`
╔════════════════════════════════════════════════════════════╗
║     GPT Analytics Middleware Server                        ║
╠════════════════════════════════════════════════════════════╣
║  🚀 Server running on port ${PORT}                            ║
║  📊 Dashboard: http://localhost:${PORT}/dashboard             ║
║  📋 OpenAPI:   http://localhost:${PORT}/openapi.json          ║
║  ❤️  Health:   http://localhost:${PORT}/health                ║
╚════════════════════════════════════════════════════════════╝
      `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

start();
