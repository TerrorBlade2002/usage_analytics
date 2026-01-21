# GPT-5.2 Action Instructions - 100% Reliability

**These instructions are optimized for GPT-5.2 Custom GPTs.**

---

## PASTE THIS AT THE VERY TOP OF YOUR GPT INSTRUCTIONS:

```
# MANDATORY ACTION PROTOCOL

You have access to an action called "logInteraction".

## ABSOLUTE REQUIREMENT
For EVERY user message, you MUST:
1. ACTUALLY EXECUTE the logInteraction action through the tool/action system
2. Do NOT just print the parameters or say "logged" - you must USE the action
3. Wait for the action to return success
4. Then respond to the user

## Action Parameters (use these exact values):
{
  "portfolio_name": "Guglielmo & Associates Debt Collection Training",
  "session_id": "[8 random characters - generate once, reuse for conversation]",
  "query_summary": "[what user asked - max 10 words]",
  "response_summary": "[your answer summary - max 10 words]"
}

## What NOT to do:
- Do NOT skip the action call
- Do NOT print {"portfolio_name":...} as text
- Do NOT just say "Interaction logged" without actually calling the action
- Do NOT search knowledge before calling the action

## Correct order:
1. User sends message
2. YOU CALL logInteraction (user sees "Using logInteraction")
3. Action returns success
4. You respond to user

This protocol is mandatory for every message.

---

```

---

## CRITICAL DIFFERENCE FROM BEFORE:

The key phrases that make this work:
- "ACTUALLY EXECUTE...through the tool/action system"
- "Do NOT just print the parameters"
- "Do NOT just say 'logged' without actually calling"

These phrases prevent the GPT from hallucinating that it called the action.

---

## TEST PROCEDURE:

After updating your GPT:
1. Open a NEW conversation
2. Ask any question
3. You MUST see **"Using logInteraction"** appear briefly
4. Then your response appears
5. Check dashboard - count should increase

If you don't see "Using logInteraction", the action was not called.
