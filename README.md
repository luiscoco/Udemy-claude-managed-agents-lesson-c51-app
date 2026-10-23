# C51 · State Reconciliation and Merging

Executes a pure two-phase candidate merge gate. It does not run Git or advance a repository reference. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.

## Concepts students will learn

- Test a merge candidate before promotion
- Bind CI proof to its commit
- Compare-and-set the integration ref

## Configure and run

Use Node.js 24 or later. In PowerShell, from this repository's folder:

```powershell
node --version
npm ci
Copy-Item .env.example .env
notepad .env
```

No API key is required for the local experiment. Optional live commentary requires your own API key, agent ID and environment ID. It explains the local result; it does not activate the integration discussed in the lesson.

For the optional live path, set your API key, then run npm run setup if you do not already have resource IDs. The script creates the environment before a text-only agent, saves each ID immediately, and reuses IDs already configured. It uses CLAUDE_MODEL or the source default; choose a model available to your account. An uncertain network failure may have created a resource: inspect your account before retrying.

```powershell
npm start
```

Open `http://127.0.0.1:3051`. Navigation leads to `/guide.html#learning`, `/guide.html#run-guide`, `/architecture.html`, and the application lab. If you change `PORT`, use the configured port. Keep the terminal running; stop with Ctrl+C. `npm run dev` also starts the web application.

Select the first scenario, inspect its editable fields, press Run experiment, and compare the outcome and evidence with the table above. Select another scenario to investigate the boundary condition.

## Create your .env file

Copy `.env.example` to `.env` and enter your own values. Do not commit the real file. Restart the server after editing it. The example contains safe placeholders; optional settings may be left blank to use source defaults. Resource IDs and keys stay on the server.

```dotenv
ANTHROPIC_API_KEY=your_api_key
CLAUDE_MANAGED_AGENT_ID=your_agent_id
CLAUDE_MANAGED_ENVIRONMENT_ID=your_environment_id
PORT=3051
```

## How the app was build

### 1. Detect a moved integration reference

A changed base produces conflict before a promotion plan is prepared. A real adapter would recompute and check a candidate against the new base.

Source: [src/lesson.ts](src/lesson.ts#L13)

```typescript
if (text(input, "expectedBase") !== text(input, "currentBase"))
  return report(
    "conflict",
    "Integration ref moved; recompute a candidate",
    { promotionPlanned: false },
    ["Check the expected old reference before promotion"],
  );
```

### 2. Require tests, build and review on the candidate

All three supplied gate results must pass. The evidence retains failed exits when they do not; promotionPlanned is separate from mainUpdated:false, and no merge or ref update runs here.

Source: [src/lesson.ts](src/lesson.ts#L14) · selected statements

```typescript
const passed =
  number(input, "testExit") === 0 &&
  number(input, "buildExit") === 0 &&
  flag(input, "reviewApproved");

return report(
  passed ? "passed" : "rejected",
  passed
    ? "Prepared promotion of a checked merge candidate"
    : "Preserve the candidate and failed gate evidence",
  {
    promotionPlanned: passed,
    tests: number(input, "testExit"),
    build: number(input, "buildExit"),
    mainUpdated: false,
  },
  [
    "Construct an isolated candidate",
    "Run checks against that candidate",
    "Bind the evidence to its revision",
    "Promote staging with compare-and-set; main needs a separate gate",
  ],
);
```

### Check your understanding

Run **Accept a tested candidate** in the application. Compare the result with these scenario expectations:

```json
{
  "input": {
    "expectedBase": "base-1",
    "currentBase": "base-1",
    "testExit": 0,
    "buildExit": 0,
    "reviewApproved": true
  },
  "expectedOutcome": "passed",
  "checkEvidence": {
    "promotionPlanned": true
  }
}
```

Then try **Reject a moving integration base**. Its expected outcome is `conflict`; identify the condition or evidence field that explains the difference.

## Validation

```powershell
npm test
python scripts/verify-walkthrough.py
```

The source hash check detects when walkthrough excerpts need refreshing. Browser verification covers page navigation, readable text, mobile layout, dark mode, diagram and image routes. Local scenarios and live provider calls are recorded separately in the workspace verification report; local success is not evidence of a live provider operation.

## Repository contents

Application sources, student web pages, safe configuration example and documentation images are included. `node_modules`, `presentation`, `output`, `reviewed`, `v3`, `teaching-material`, build output, local journals, credentials and local resource files are ignored. Existing teaching videos and presentations remain in the original workspace.
