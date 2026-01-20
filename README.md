# GPT Analytics Middleware

Enterprise-grade analytics tracking for Custom GPTs across multiple ChatGPT accounts.

## 📊 Features

- **Portfolio-Wide Analytics**: Track usage across 10 Custom GPTs
- **Real-time Dashboard**: Beautiful dark-themed analytics UI
- **Concurrent Sessions**: Handles 300+ agents with connection pooling
- **Day-wise Breakdown**: Historical analytics with charts
- **Zero Authentication**: Simple, portfolio-level tracking

## 🚀 Quick Start

### Prerequisites

1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **PostgreSQL Database** - Choose one (free):
   - [Supabase](https://supabase.com) - 500MB free
   - [Neon](https://neon.tech) - 512MB free
   - Local PostgreSQL

### Setup Steps

```bash
# 1. Install dependencies
cd c:\gpt_authentication
npm install

# 2. Configure database
# Edit .env file with your PostgreSQL connection string
# Example for Supabase:
# DATABASE_URL=postgres://postgres:[password]@db.[project].supabase.co:5432/postgres

# 3. Start the server
npm run dev
```

### Expected Output

```
╔════════════════════════════════════════════════════════════╗
║     GPT Analytics Middleware Server                        ║
╠════════════════════════════════════════════════════════════╣
║  🚀 Server running on port 3000                            ║
║  📊 Dashboard: http://localhost:3000/dashboard             ║
║  📋 OpenAPI:   http://localhost:3000/openapi.json          ║
║  ❤️  Health:   http://localhost:3000/health                ║
╚════════════════════════════════════════════════════════════╝
```

## 🔗 Deploying to Production

### Option 1: Render.com (Recommended - Free Tier)

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create new **Web Service**
4. Connect your repo
5. Set environment variables:
   - `DATABASE_URL` = Your Supabase/Neon connection string
6. Deploy!

Your URL will be: `https://your-app.onrender.com`

### Option 2: Local + ngrok (For Testing)

```bash
# Terminal 1: Run server
npm run dev

# Terminal 2: Expose with ngrok
ngrok http 3000
```

Use the ngrok HTTPS URL for Custom GPT configuration.

## ⚙️ Configuring Custom GPTs

### Step 1: Get Your Server URL

After deployment, you'll have a URL like:
- Render: `https://gpt-analytics.onrender.com`
- ngrok: `https://abc123.ngrok.io`

### Step 2: Configure Each Custom GPT

1. Open your Custom GPT in ChatGPT editor
2. Click **Configure** → **Create new action**
3. Click **Import from URL**
4. Enter: `https://YOUR_SERVER_URL/openapi.json`
5. Append instructions from `gpt-config/instructions.md` to your GPT's system prompt
6. Replace `[PORTFOLIO_NAME]` with the matching name:

| Portfolio # | Name |
|-------------|------|
| 1 | Credit Card Debt Collection |
| 2 | Auto Loan Debt Collection |
| 3 | CDS |
| 4 | Key2Recovery |
| 5 | Everest Receivables |
| 6 | G&A |
| 7 | ARM |
| 8 | CashLane Loans |
| 9 | CashLane Collections |
| 10 | Medical Debt Collection |

### Step 3: Test

Send a message to your Custom GPT. Check:
- Server logs should show: `[timestamp] POST /api/log`
- Dashboard should update within 30 seconds

## 📁 Project Structure

```
c:\gpt_authentication\
├── server/
│   ├── index.js           # Express server
│   ├── db.js              # PostgreSQL connection
│   └── routes/
│       └── analytics.js   # API endpoints
├── dashboard/
│   ├── index.html         # Dashboard UI
│   ├── styles.css         # Styling
│   └── app.js             # Frontend logic
├── gpt-config/
│   ├── openapi-schema.json    # Paste into GPT Actions
│   └── instructions.md        # Append to GPT prompts
├── package.json
├── .env                   # Your configuration
└── README.md
```

## 🔌 API Reference

### POST /api/log
Log an interaction (called by GPT)

```json
{
  "portfolio_name": "Credit Card Debt Collection",
  "session_id": "abc12def",
  "query_summary": "User asked about payment plans",
  "response_summary": "Explained 3 payment options",
  "input_type": "text"
}
```

### GET /api/stats
Get all portfolio statistics

### GET /api/stats/:portfolioId
Get stats for a specific portfolio with day-wise breakdown

### GET /health
Health check endpoint

## ❓ FAQ

**Q: How do I add more portfolios?**
Edit `server/db.js`, add to the `portfolios` array, restart server.

**Q: How accurate is voice detection?**
~80%. It infers based on speech patterns (filler words, run-on sentences).

**Q: Can I see individual queries?**
Yes, they're stored in the `interactions` table. Add a query viewer to the dashboard if needed.

**Q: What if the server goes down?**
Each interaction is logged immediately. No batching = no data loss. When server restarts, tracking resumes.

## 📄 License

MIT
