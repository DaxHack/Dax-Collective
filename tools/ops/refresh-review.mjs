import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const steps = [
  ['tools/anidax/verify-review.mjs', 'artifacts/anidax/timed-review'],
  ['tools/business-state/build-state.mjs'],
  ['tools/revenue-readiness/measurements.mjs'],
  ['tools/business-state/build-state.mjs'],
  ['tools/ops/build-approval-queue.mjs'],
  ['tools/ops/build-approval-decisions.mjs'],
  ['tools/business-state/build-state.mjs'],
];

export function runSteps(execute) {
  const completed = [];
  for (const args of steps) {
    const result = execute(args);
    if (result.status !== 0) return { ok: false, completed, failedStep: args[0] };
    completed.push(args[0]);
  }
  return { ok: true, completed, failedStep: null };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = process.cwd();
  const result = runSteps((args) => spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit', timeout: 60000 }));
  const report = { ...result, publicPublishingAllowed: false, providerCallsMade: false, purchasesAllowed: false, next: result.ok ? 'Review current approval package and open editorial QC. No publishing authorized.' : 'Repair failed step, then rerun npm run ops:review.' };
  const output = path.join(root, 'artifacts/approval-queue/last-review-refresh.json');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  if (!result.ok) process.exitCode = 1;
}
