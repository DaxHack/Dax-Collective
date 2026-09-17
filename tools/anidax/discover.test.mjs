import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { discover } from './discover.mjs';
const read = (file) => JSON.parse(fs.readFileSync(new URL(`../../business-state/${file}`, import.meta.url)));
const input = read('anidax-discovery.json'), formats = read('anidax-formats.json'), canon = read('canon/re-zero.json');
const run = (data = input, asOf = '2026-09-17') => discover(data, formats, canon, asOf);

test('real indexed leads retain evidence but never pretend to be trends or production-ready', () => {
  const before = JSON.stringify(canon);
  const queue = run();
  assert.equal(queue.candidates.length, 3);
  assert.equal(queue.safeQueue.length, 0);
  assert.equal(queue.held.length, 3);
  assert.equal(queue.publishAllowed, false);
  for (const row of queue.candidates) {
    assert.equal(row.source.popularityConclusion, 'ONE_OBSERVED_DISCUSSION_NOT_A_TREND');
    assert.equal(row.evidenceLadder.aniDaxConclusion, null);
    assert.equal(row.productionHandoff.renderAllowed, false);
    assert.ok(row.productionHandoff.missingFields.includes('counterEvidence') || row.productionHandoff.missingFields.includes('comparisonCriteria'));
  }
  assert.equal(JSON.stringify(canon), before);
  assert.ok(!JSON.stringify(queue.held).includes('source'));
  assert.ok(!JSON.stringify(queue.held).includes('claim'));
});

test('engagement alone cannot reorder editorial priorities', () => {
  const data = structuredClone(input);
  data.candidates[2].source.activity.displayedVotes = 999999999;
  assert.deepEqual(run(data).candidates.map((x) => x.id), run().candidates.map((x) => x.id));
});

test('future dates, missing evidence, duplicates and fabricated trending reject', () => {
  for (const edit of [
    (row) => row.source.observedAt = '2099-01-01',
    (row) => row.source.publishedAt = '2026-02-30',
    (row) => row.source.url = 'https://secret@example.com/private',
    (row) => row.trending = true,
    (row) => row.assessment.originality.reason = '',
    (row) => row.formatId = 'unknown',
    (row) => row.source.activity.displayedVotes = 'popular',
  ]) {
    const data = structuredClone(input); edit(data.candidates[0]); assert.throws(() => run(data));
  }
  const data = structuredClone(input); data.candidates.push(data.candidates[0]); assert.throws(() => run(data));
});

test('verified scoped fixture reaches research only, later arc and stale sources remain held', () => {
  const data = structuredClone(input);
  const row = data.candidates[0];
  row.source.access = 'page_verified';
  row.scope = { classification: 'anime-safe', maxArc: 3, reason: 'Synthetic unit fixture, not a real source review' };
  assert.equal(run(data).safeQueue.length, 1);
  assert.equal(run(data).safeQueue[0].route, 'RESEARCH_REQUIRED');
  row.scope.maxArc = 5;
  assert.equal(run(data).safeQueue.length, 0);
  row.scope.maxArc = 3;
  assert.equal(run(data, '2026-11-01').safeQueue.length, 0);
});

test('all eight formats share evidence hierarchy without claiming unimplemented rendering', () => {
  assert.equal(formats.formats.length, 8);
  for (const field of ['canonEvidence','directlyEstablishes','interpretation','doesNotEstablish','conclusion','preferenceConflict','spoilerReview']) assert.ok(formats.sharedRequired.includes(field));
  assert.equal(formats.formats.filter((x) => x.rendererAdapter).length, 1);
});
