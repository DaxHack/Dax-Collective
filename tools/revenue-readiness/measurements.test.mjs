import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeObservations, summarize, run } from './measurements.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const queue = [{ brandId: 'ani-dax', contentId: 'fixture-only' }];
const base = { id: 'one', brandId: 'ani-dax', contentId: 'fixture-only', provider: 'fixture', sourceReference: 'fixture-only-export', observedAt: '2026-09-15T12:00:00Z' };
const sale = { ...base, kind: 'revenue', amountUsd: 10 };
test('retries deduplicate and conflicting observations fail', () => {
  assert.equal(mergeObservations([sale], [sale], queue).length, 1);
  assert.throws(() => mergeObservations([sale], [{ ...sale, amountUsd: 20 }], queue), /Conflicting/);
});
test('reject brand mismatch, invalid currency, missing evidence, and extra private fields', () => {
  for (const row of [{ ...sale, brandId: 'gods-vessel' }, { ...sale, amountUsd: -1 }, { ...sale, amountUsd: '10' }, { ...sale, amountUsd: 1.234 }, { ...sale, sourceReference: '' }, { ...sale, accessToken: 'fixture' }]) {
    assert.throws(() => mergeObservations([], [row], queue));
  }
});
test('unknowns stay null; refunds and category costs produce contribution, not total profit', () => {
  assert.equal(summarize([], queue)[0].netRevenueUsd, null);
  const rows = mergeObservations([], [sale, { ...base, id: 'refund', kind: 'refund', amountUsd: 2 }, { ...base, id: 'cost', kind: 'cost', amountUsd: 1.25, category: 'tts' }], queue);
  const item = summarize(rows, queue)[0];
  assert.equal(item.netRevenueUsd, 8);
  assert.equal(item.recordedContributionUsd, 6.75);
  assert.equal(item.costByCategoryUsd.tts, 1.25);
  assert.equal(item.costByCategoryUsd.llm, null);
  assert.equal(item.totalProfitUsd, null);
});
test('cumulative snapshots use latest values without adding repeated views', () => {
  const older = { ...base, kind: 'analytics', platform: 'youtube', metrics: { views: 10, retention: 0.6 } };
  const newer = { ...older, id: 'two', observedAt: '2026-09-16T12:00:00Z', metrics: { views: 15 } };
  const rows = mergeObservations([], [newer, older], queue);
  assert.equal(summarize(rows, queue)[0].latestAnalytics[0].metrics.views, 15);
  assert.throws(() => summarize([...rows, { ...newer, id: 'three', metrics: { views: 16 } }], queue), /Conflicting/);
});
test('actual importer persists idempotently and failed batches leave ledger intact', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dax-measurements-test-'));
  try {
    fs.mkdirSync(path.join(root, 'artifacts/business-state'), { recursive: true });
    fs.writeFileSync(path.join(root, 'artifacts/business-state/current-state.json'), JSON.stringify({ contentQueue: queue }));
    fs.writeFileSync(path.join(root, 'input.json'), JSON.stringify({ observations: [sale] }));
    assert.equal(run(root, 'input.json').added, 1);
    assert.equal(run(root, 'input.json').added, 0);
    const ledger = path.join(root, 'business-state/measurement-observations.json');
    const before = fs.readFileSync(ledger, 'utf8');
    fs.writeFileSync(path.join(root, 'input.json'), JSON.stringify({ observations: [{ ...sale, amountUsd: 20 }] }));
    assert.throws(() => run(root, 'input.json'));
    assert.equal(fs.readFileSync(ledger, 'utf8'), before);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
