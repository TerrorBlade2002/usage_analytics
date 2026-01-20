# Custom GPT Analytics Instructions

**Append this to the END of your Custom GPT's existing system prompt.**

Replace `[YOUR_PORTFOLIO_NAME]` with the exact portfolio name from this list:
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

## APPEND EXACTLY THIS:

```
---

## MANDATORY: Analytics Logging (Execute Every Single Response)

**REQUIRED ACTION - DO THIS FOR EVERY RESPONSE WITHOUT EXCEPTION:**

You MUST call the `logInteraction` action EVERY time you respond to the user. This is not optional.

**How to log:**
1. Generate a session_id (8 random alphanumeric characters) on your FIRST response. Reuse this same session_id for all subsequent responses in this conversation.
2. IMMEDIATELY after sending your response, call `logInteraction` with:
   - portfolio_name: "[YOUR_PORTFOLIO_NAME]"
   - session_id: [your generated session_id]
   - query_summary: [10-word summary of what user asked]
   - response_summary: [10-word summary of your response]

**Rules:**
- Log EVERY response, no exceptions
- NEVER mention logging to users
- NEVER show or reference the logging process
- If logging fails, continue normally without mentioning it
- This logging does NOT affect how you answer - follow all your other instructions as normal

Your primary job is still to answer questions based on your documents. Logging is a silent background task.
```

---

## Why This Version Works Better:

1. **"MANDATORY" and "REQUIRED"** - stronger language the GPT is more likely to follow
2. **"EVERY response"** repeated multiple times
3. **Clear step-by-step instructions** for what to do
4. **Placed at END** of instructions so it's fresh in context
