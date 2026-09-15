import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const script = fileURLToPath(new URL('./build-approval-decisions.mjs', import.meta.url));
test('decisions persist, invalidate on changed material, and never authorize consequential actions', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dax-approval-test-'));
  const ledger = path.join(root, 'business-state/approval-decisions.json');
  const read = () => JSON.parse(fs.readFileSync(ledger, 'utf8'));
  const write = (value) => fs.writeFileSync(ledger, JSON.stringify(value));
  const run = () => spawnSync(process.execPath, [script], { cwd: root, encoding: 'utf8' });
  try {
    fs.mkdirSync(path.join(root, 'artifacts/approval-queue'), { recursive: true });
    fs.writeFileSync(path.join(root, 'review.txt'), 'draft one');
    fs.writeFileSync(path.join(root, 'artifacts/approval-queue/current-approval-queue.json'), JSON.stringify({ items: [{ brandId: 'ani-dax', brand: 'Ani-Dax', contentId: 'test', title: 'Test', reviewArtifacts: ['review.txt'] }] }));
    assert.equal(run().status, 0);
    let data = read();
    assert.equal(data.decisions[0].canProceedToPrivateDraftNextStep, false);
    Object.assign(data.decisions[0], { decisionStatus: 'APPROVED_FOR_PRIVATE_DRAFT_NEXT_STEP', decisionNotes: 'fixture only' });
    write(data);
    assert.equal(run().status, 0);
    assert.equal(read().decisions[0].canProceedToPrivateDraftNextStep, false);
    data = read();
    Object.assign(data.decisions[0], { decisionRecordedAt: '2026-09-15T12:00:00Z', approvedNextPrivateStep: 'Review local draft' });
    write(data);
    assert.equal(run().status, 0);
    data = read();
    assert.equal(data.decisions[0].canProceedToPrivateDraftNextStep, true);
    for (const key of ['canPublishPublicly', 'canEnableCheckoutOrProductPublication', 'canSpendOrPurchase', 'canChangeCredentials']) assert.equal(data.decisions[0][key], false);
    fs.writeFileSync(path.join(root, 'review.txt'), 'changed draft');
    assert.equal(run().status, 0);
    data = read();
    assert.equal(data.decisions[0].decisionStatus, 'PENDING_DANIEL_REVIEW');
    assert.equal(data.decisions[0].canProceedToPrivateDraftNextStep, false);
    assert.equal(data.decisions[0].decisionNotes, 'fixture only');
    data.decisions[0].decisionStatus = 'TYPO';
    write(data);
    const before = fs.readFileSync(ledger, 'utf8');
    assert.notEqual(run().status, 0);
    assert.equal(fs.readFileSync(ledger, 'utf8'), before);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
