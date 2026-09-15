import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runSteps, steps } from './refresh-review.mjs';
test('review refresh stops at first failed validation', () => {
  let calls = 0;
  const result = runSteps(() => { calls++; return { status: 1 }; });
  assert.equal(calls, 1);
  assert.equal(result.ok, false);
  assert.equal(result.failedStep, 'tools/anidax/verify-review.mjs');
});
test('successful refresh executes existing steps in order', () => {
  const calls = [];
  const result = runSteps((args) => { calls.push(args); return { status: 0 }; });
  assert.equal(result.ok, true);
  assert.deepEqual(calls, steps);
});
