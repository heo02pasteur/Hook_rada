# Hook_rada Agent Instructions

## Project goal
This is a React/Vite market-intelligence portal. The in-app AI Agent ("Rada Agent") is a UI controller for the portal.

## Agent capabilities
- Navigate between the three main tabs.
- Populate the market-intelligence intake form from natural-language instructions.
- Save a draft or submit the form through the existing Make webhook flow.
- Trigger the Auto Radar rescan control.
- Never expose API keys in frontend code or commit secrets.

## Safety
- Do not submit data to Make automatically unless the user explicitly asks the agent to submit/send/update.
- Keep API keys server-side in environment variables.
- Prefer small, reviewable changes and preserve the existing 8-field webhook contract.

## Important existing integration
The Make webhook is implemented in `src/services/webhookService.ts`. Do not duplicate or hard-code a second webhook implementation in the UI.
