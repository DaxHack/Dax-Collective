#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const statePath = path.join(root, 'artifacts', 'business-state', 'current-state.json');

if (!fs.existsSync(statePath)) {
  fail('State file not found. Run: npm run business-state:build');
}

const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
const [command, arg] = process.argv.slice(2);

switch (command) {
  case 'list-brands':
    print(state.brands.map(({ id, name, type, currentState }) => ({ id, name, type, currentState })));
    break;
  case 'read-brand':
    if (!arg) fail('Usage: npm run business-state:query -- read-brand <brand-id>');
    print(state.brands.find((brand) => brand.id === arg) || null);
    break;
  case 'content-queue':
    print(state.contentQueue);
    break;
  case 'approval-decisions':
    print(state.approvalDecisions);
    break;
  case 'workflow-health':
    print(state.workflowHealth);
    break;
  case 'credential-health':
    print(state.credentialHealth);
    break;
  case 'permissions':
    print(state.permissions);
    break;
  case 'costs':
    print(state.costs);
    break;
  case 'measurements':
    print(state.measurements);
    break;
  case 'revenue-readiness':
    print(state.revenueReadiness);
    break;
  case 'blockers':
    print(state.blockers);
    break;
  case 'summary':
  case undefined:
    print({
      generatedAt: state.generatedAt,
      brands: state.brands.length,
      queueItems: state.contentQueue.length,
      workflowTemplates: state.workflowHealth.templateCount,
      publicPublishingAllowed: false,
      next: 'Read EXECUTION_STATUS.md and NEXT_SESSION.md before acting.',
    });
    break;
  default:
    fail(`Unknown command: ${command}`);
}

function print(value) {
  console.log(JSON.stringify(value, null, 2));
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
