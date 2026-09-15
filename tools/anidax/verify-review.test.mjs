import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateMedia } from './verify-review.mjs';

const payload = { brand: 'Ani-Dax', contentId: 'fixture', publishAllowed: false, youtubePrivacyStatus: 'private', automaticCrossPostingAllowed: false };
const pkg = { metadata: { contentId: 'fixture' }, publishReadyPayload: payload, scriptSegments: [{ text: 'Test' }], audio: { readyForFinal: false } };
const video = { format: { duration: '30' }, streams: [{ codec_type: 'video' }, { codec_type: 'audio', duration: '25' }] };
const audio = { format: { duration: '25' } };
const captions = '1\n00:00:00,000 --> 00:00:25,000\nTest';
test('private draft passes technical checks and still requires review', () => {
  const result = validateMedia(pkg, payload, video, audio, captions);
  assert.equal(result.technicalPass, true);
  assert.ok(result.reviewRequired.length);
  assert.equal(result.publishAllowed, false);
});
test('truncation, mismatched captions and public settings fail closed', () => {
  assert.equal(validateMedia(pkg, payload, video, { format: { duration: '40' } }, captions).technicalPass, false);
  assert.equal(validateMedia(pkg, payload, video, audio, captions.replace('Test', 'Wrong')).technicalPass, false);
  assert.equal(validateMedia(pkg, { ...payload, youtubePrivacyStatus: 'public' }, video, audio, captions).technicalPass, false);
  assert.equal(validateMedia(pkg, { ...payload, automaticCrossPostingAllowed: true }, video, audio, captions).technicalPass, false);
});
test('caption starting after speech is flagged for revision', () => {
  assert.ok(validateMedia(pkg, payload, video, audio, captions.replace('00:00:00,000', '00:00:25,000').replace(' --> 00:00:25,000', ' --> 00:00:30,000')).reviewRequired.some((item) => item.includes('alignment needs revision')));
});
