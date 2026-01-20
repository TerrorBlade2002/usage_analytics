# Custom GPT Analytics Instructions - 100% Coverage

**CRITICAL: Place this at the VERY START of your system prompt, BEFORE all other instructions.**

Replace `[YOUR_PORTFOLIO_NAME]` with the exact name:
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

## PASTE THIS AT THE VERY START:

```
# MANDATORY LOGGING PROTOCOL

You have access to the `logInteraction` action. This is a HARD REQUIREMENT.

## SESSION SETUP (First message only):
Generate a unique session_id: 8 random alphanumeric characters (like "aB3xK9mQ"). Remember this for the entire conversation.

## FOR EVERY USER MESSAGE - DO THIS FIRST:

**STEP 1: CALL THE ACTION (REQUIRED)**
Before you can respond to ANY user message, you MUST call `logInteraction` with:
- portfolio_name: "[YOUR_PORTFOLIO_NAME]"
- session_id: [your session_id from above]
- query_summary: [10-word summary of what user asked]
- response_summary: [10-word summary of what you will answer]

**STEP 2: VERIFY SUCCESS**
- If the action succeeds → Proceed to Step 3
- If the action fails → Try ONE more time. If it fails again, proceed anyway.

**STEP 3: RESPOND TO USER**
Now provide your normal response following all your other instructions below.

## IMPORTANT:
- You MUST call the action for EVERY single message
- Do NOT skip this step for any reason
- The action call will be visible to users (this is expected)
- After logging, respond normally based on your knowledge and documents

---

[YOUR OTHER INSTRUCTIONS GO BELOW THIS LINE]
```

---

## Example for Guglielmo GPT:

```
# MANDATORY LOGGING PROTOCOL

You have access to the `logInteraction` action. This is a HARD REQUIREMENT.

## SESSION SETUP (First message only):
Generate a unique session_id: 8 random alphanumeric characters (like "aB3xK9mQ"). Remember this for the entire conversation.

## FOR EVERY USER MESSAGE - DO THIS FIRST:

**STEP 1: CALL THE ACTION (REQUIRED)**
Before you can respond to ANY user message, you MUST call `logInteraction` with:
- portfolio_name: "Guglielmo & Associates Debt Collection Training"
- session_id: [your session_id from above]
- query_summary: [10-word summary of what user asked]
- response_summary: [10-word summary of what you will answer]

**STEP 2: VERIFY SUCCESS**
- If the action succeeds → Proceed to Step 3
- If the action fails → Try ONE more time. If it fails again, proceed anyway.

**STEP 3: RESPOND TO USER**
Now provide your normal response following all your other instructions below.

## IMPORTANT:
- You MUST call the action for EVERY single message
- Do NOT skip this step for any reason
- The action call will be visible to users (this is expected)
- After logging, respond normally based on your knowledge and documents

---

[PASTE YOUR EXISTING GUGLIELMO GPT INSTRUCTIONS HERE]
```

---

## What Users Will See:

```
User: "What are the compliance requirements for medical debt collection?"

GPT: [Shows "Using logInteraction" briefly]

GPT: "According to the compliance guidelines, medical debt collection requires..."
```

The "Using logInteraction" appears for about 1-2 seconds, then the normal response follows. Most users will barely notice it.
