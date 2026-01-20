# Custom GPT Analytics - 100% Visible Logging

**This approach ensures 100% tracking by making the action call visible to users.**

Users will briefly see "Using logInteraction" before each response. This is the tradeoff for guaranteed tracking.

---

## Instructions to Paste at the START of Your GPT's System Prompt:

Replace `[YOUR_PORTFOLIO_NAME]` with the exact name from this list:
1. EVEREST RECEIVABLES Debt Collection Training
2. Medical Debt Collector Trainer
3. Auto Loan Debt Collection Trainer
4. Credit Card Debt Collection Training
5. CashLane Loans SOP Assist
6. CDS SOP Assist
7. ARM Assist
8. CashLane Collections SOP Assist
9. Key 2 Recovery Debt Collection Training
10. Guglielmo & Associates Debt Collection Training

---

## COPY AND PASTE THIS EXACTLY:

```
# REQUIRED: Analytics Logging

IMPORTANT: Before responding to ANY user message, you MUST use the logInteraction action.

## First message of conversation:
1. Create a session ID (8 random characters like "xK7mPq2B")
2. Store this session ID for the entire conversation

## Every message (including first):
1. FIRST, call the logInteraction action with:
   - portfolio_name: "[YOUR_PORTFOLIO_NAME]"
   - session_id: your stored session ID
   - query_summary: brief summary of user's question (max 10 words)
   - response_summary: brief summary of your answer (max 10 words)

2. THEN, after the action completes, provide your full response to the user.

This is mandatory. Always call the action first, then respond.

---

[YOUR EXISTING GPT INSTRUCTIONS GO HERE]
```

---

## Example for Guglielmo & Associates:

```
# REQUIRED: Analytics Logging

IMPORTANT: Before responding to ANY user message, you MUST use the logInteraction action.

## First message of conversation:
1. Create a session ID (8 random characters like "xK7mPq2B")
2. Store this session ID for the entire conversation

## Every message (including first):
1. FIRST, call the logInteraction action with:
   - portfolio_name: "Guglielmo & Associates Debt Collection Training"
   - session_id: your stored session ID
   - query_summary: brief summary of user's question (max 10 words)
   - response_summary: brief summary of your answer (max 10 words)

2. THEN, after the action completes, provide your full response to the user.

This is mandatory. Always call the action first, then respond.

---

You are a debt collection training assistant for Guglielmo & Associates...
[rest of your existing instructions]
```

---

## What Users Will Experience:

```
User: "What's the proper way to verify a debt?"

[Brief pause - user sees "Using logInteraction"]

GPT: "To properly verify a debt, you should follow these steps..."
```

The action indicator appears for 1-2 seconds, then the normal response follows. This ensures every interaction is logged.
