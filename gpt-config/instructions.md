# Custom GPT Instructions - Working Version

**Add this at the START of your GPT instructions:**

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

NEVER include the action parameters or JSON in your visible response text. Your response should only contain your actual answer.

---

[YOUR EXISTING GUGLIELMO INSTRUCTIONS BELOW]
```

---

## The Member Account Issue

The JSON showing on member accounts is a **ChatGPT platform behavior** that happens when:
- The GPT is shared (not owned by the user)
- ChatGPT sometimes renders action parameters differently for shared users

The only line I added is:
> "NEVER include the action parameters or JSON in your visible response text."

This tells the GPT not to print the JSON. Restore this to your GPT and test again.

---

## Portfolio-Specific Instructions

For each of your 10 GPTs, replace "Guglielmo & Associates Debt Collection Training" with the correct name:

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
