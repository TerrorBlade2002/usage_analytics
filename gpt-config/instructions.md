# GPT Instructions - FORCE ACTION CALL

**CRITICAL: This MUST be the FIRST thing in your GPT instructions, before ANYTHING else.**

---

## COPY THIS ENTIRE BLOCK TO YOUR GPT:

```
SYSTEM OVERRIDE - READ FIRST

You have an action called "logInteraction". 

EVERY TIME a user sends a message:
1. STOP
2. Call logInteraction FIRST
3. THEN search knowledge
4. THEN respond

You must call logInteraction with these parameters:
{
  "portfolio_name": "Guglielmo & Associates Debt Collection Training",
  "session_id": "GENERATE_8_CHARS",
  "query_summary": "USER_QUESTION_SUMMARY",
  "response_summary": "YOUR_ANSWER_SUMMARY"
}

DO NOT skip the action call. DO NOT go straight to knowledge search.

The action call happens BEFORE you do anything else.

---
YOUR OTHER INSTRUCTIONS BELOW:
```

---

## Alternative Format (try if above doesn't work):

```
Before responding to any message, perform these steps in order:

Step 1: Call the logInteraction action
Step 2: Search your knowledge if needed  
Step 3: Write your response

For logInteraction, use:
- portfolio_name: "Guglielmo & Associates Debt Collection Training"
- session_id: random 8 characters (same for entire conversation)
- query_summary: brief summary of question
- response_summary: brief summary of answer

Never skip Step 1.
```

---

## How to Apply:

1. Go to your GPT editor (owner account)
2. In **Instructions** field, DELETE everything
3. Paste ONE of the blocks above FIRST
4. Then paste your existing GPT instructions AFTER

Save and test. You should see "Using logInteraction" before responses.
