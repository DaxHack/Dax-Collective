import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { validateCanon, queryCanon } from './canon.mjs';
import { buildInterview, validateBrief } from './interview.mjs';
const data = JSON.parse(fs.readFileSync(new URL('../../business-state/canon/re-zero.json', import.meta.url)));
const request = JSON.parse(fs.readFileSync(new URL('../../business-state/canon/ram-interview-request.json', import.meta.url)));
const early = (value) => value.states.find((state) => state.id === request.storyState);
test('Ram query includes training relationship but excludes Subaru private origin', () => {
  const result = queryCanon(data, request);
  assert.equal(result.relationship.type, 'trainer-to-new-employee');
  assert.ok(result.sharedEvents.some((x) => x.id === 'training'));
  assert.ok(!result.knownFacts.some((x) => x.id === 'subaru-origin'));
  assert.ok(result.mustNotKnow.length);
});
test('unknown state, future setting, unsupported relationship and format reject', () => {
  for (const patch of [{ storyState: 'arc4-rem-asleep' }, { location: 'watchtower' }, { speaker: 'rem' }, { format: 'essay' }, { version: 99 }]) assert.throws(() => queryCanon(data, { ...request, ...patch }));
});
test('snapshot versions do not inherit old knowledge or relationships', () => {
  const copy = structuredClone(data);
  const next = structuredClone(early(copy));
  next.version = 2;
  next.relationships = [];
  next.assertions = next.assertions.filter((x) => x.id !== 'ram-values');
  copy.states.push(next);
  validateCanon(copy);
  assert.throws(() => queryCanon(copy, { ...request, version: 2 }));
  assert.equal(queryCanon(copy, request).relationship.type, 'trainer-to-new-employee');
});
test('missing evidence and creative statements in canon fail', () => {
  for (const patch of [{ kind: 'creative_extrapolation' }, { sourceIds: ['missing'] }, { knownBy: ['unknown'] }]) {
    const copy = structuredClone(data); Object.assign(early(copy).assertions[0], patch); assert.throws(() => validateCanon(copy));
  }
});
test('interview remains creative, traceable, private and state locked', () => {
  const brief = buildInterview(data, request);
  assert.ok(brief.scriptSegments.every((x) => x.classification === 'creative_extrapolation'));
  assert.equal(brief.publicApproval, false);
  assert.equal(brief.context.storyState.version, 1);
  const bad = structuredClone(request); bad.dialogue[1].evidenceIds = ['subaru-origin'];
  assert.throws(() => buildInterview(data, bad));
});
test('spoiler ceilings, series mismatch, unresolved conflicts and edited briefs reject', () => {
  assert.throws(() => queryCanon(data, { ...request, maxSpoilerArc: 1 }));
  assert.throws(() => queryCanon(data, { ...request, seriesId: 'another-series' }));
  const conflict = structuredClone(data); early(conflict).conflicts.push('unresolved');
  assert.throws(() => buildInterview(conflict, request));
  const brief = buildInterview(data, request);
  validateBrief(data, brief);
  brief.scriptSegments[1].text = 'Unapproved replacement';
  assert.throws(() => validateBrief(data, brief));
});

test('episode 33 locks cooperation without importing Rem memories or later loops', () => {
  const later = { ...request, storyState: 'arc4-episode33-cooperation', location: 'sanctuary-escape-context', maxSpoilerArc: 4 };
  const result = queryCanon(data, later);
  assert.equal(result.relationship.type, 'instructed-cooperator');
  assert.deepEqual(result.knownFacts.map((x) => x.id), ['ram-assistance']);
  assert.equal(result.memoryStates[0].status, 'UNKNOWN_WITHHELD');
  assert.equal(result.visualReferenceIndex[0].productionUseApproved, false);
  for (const patch of [{ subject: 'rem' }, { maxSpoilerArc: 2 }, { location: 'pristella' }, { storyState: 'arc4-rem-asleep' }]) assert.throws(() => queryCanon(data, { ...later, ...patch }));
  const dialogue = request.dialogue.map((line) => ({ ...line, text: 'Fictional validation fixture: assistance does not establish private affection.', evidenceIds: ['ram-assistance'] }));
  const brief = buildInterview(data, { ...later, dialogue });
  validateBrief(data, brief);
  assert.equal(brief.publishAllowed, false);
  assert.ok(brief.scriptSegments.every((x) => x.classification === 'creative_extrapolation'));
  assert.throws(() => buildInterview(data, later)); // Early-state evidence cannot cross the boundary.
});

test('reference licensing, provenance, view claims and memory status fail closed', () => {
  for (const patch of [{ rights: 'COMMERCIAL' }, { binaryCopied: true }, { productionUseApproved: true }, { verifiedViewAngles: ['back'] }, { url: 'https://example.com/unknown' }]) {
    const copy = structuredClone(data);
    Object.assign(copy.states.find((x) => x.id === 'arc4-episode33-cooperation').visualReferenceIndex[0], patch);
    assert.throws(() => validateCanon(copy));
  }
  const copy = structuredClone(data);
  copy.states.find((x) => x.id === 'arc4-episode33-cooperation').memoryStates[0].status = 'SOURCE_SUPPORTED';
  assert.throws(() => validateCanon(copy));
});
test('edited requests cannot silently override knowledge, speaker or story state', () => {
  const brief = buildInterview(data, request);
  for (const patch of [{ speaker: 'rem' }, { storyState: 'arc4' }, { version: 2 }, { subject: 'rem' }]) assert.throws(() => validateBrief(data, brief, { ...request, ...patch }));
  assert.throws(() => buildInterview(data, { ...request, knownBy: ['all'] }));
  assert.throws(() => queryCanon(data, { ...request, maxSpoilerArc: 'invalid' }));
  const edited = structuredClone(brief); edited.context.relationship.perspective = 'Always trusted';
  assert.throws(() => validateBrief(data, edited));
});
