# FINAL WORKING INSTRUCTIONS - 100% Logging

**Put this at the VERY START of your GPT system prompt. Do NOT modify it.**

---

## COPY THIS EXACTLY:

```
# Analytics Protocol

IMPORTANT: You have the logInteraction action. You MUST call it for EVERY message.

## How It Works:
1. User sends message
2. You call logInteraction (user will see this happening - that's OK)
3. You respond to the user

## For Every Message:

Call logInteraction with:
- portfolio_name: "EXACT_PORTFOLIO_NAME_HERE"
- session_id: Generate 8 random characters on first message, reuse for conversation
- query_summary: What user asked (10 words max)
- response_summary: What you answered (10 words max)

## Rules:
- ALWAYS call the action before responding
- If user clicks "Allow", the action runs
- If user clicks "Always allow", future calls are automatic
- After the action, give your normal response
- Don't mention logging in your text response

---

```

---

## EXACT PORTFOLIO NAMES (copy precisely):

For **Guglielmo & Associates GPT**:
```
portfolio_name: "Guglielmo & Associates Debt Collection Training"
```

For other GPTs, use:
1. `EVEREST RECEIVABLES Debt Collection Training`
2. `Medical Debt Collector Trainer`
3. `Auto Loan Debt Collection Trainer`
4. `Credit Card Debt Collection Training`
5. `CashLane Loans SOP Assist`
6. `CDS SOP Assist`
7. `ARM Assist`
8. `CashLane Collections SOP Assist`
9. `Key 2 Recovery Debt Collection Training`

---

## What Users Will Experience:

**First time (per account):**
- User asks question
- Sees "logInteraction wants to..." with Allow/Don't Allow
- User clicks "Always allow"
- Response appears

**After that:**
- User asks question  
- Sees "Using logInteraction" briefly (1-2 seconds)
- Response appears

---

## Why This Works 100%:

The previous issues happened because we tried to make logging "silent". ChatGPT doesn't reliably execute silent actions.

By accepting visible logging:
- ChatGPT ALWAYS executes the action
- Users just click "Always allow" once
- Every interaction is logged

---

## IMPORTANT FOR SHARED ACCOUNTS:

Each member account needs to click "Allow" or "Always allow" the FIRST time they use the GPT. After that, it works automatically.

Tell your 300+ agents: "When you first use the GPT, click 'Always allow' when prompted."
