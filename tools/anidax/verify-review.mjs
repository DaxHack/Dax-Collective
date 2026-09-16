import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { validateBrief } from './interview.mjs';

export function validateSourceReview(pkg, sourceReview) {
  if (!sourceReview) return { current: false, reason: 'Source review missing' };
  const sources = new Set((sourceReview.sources || []).map((source) => source.id));
  const segments = sourceReview.segments;
  const current = sourceReview.contentId === pkg.metadata.contentId
    && Array.isArray(segments) && segments.length === pkg.scriptSegments.length
    && segments.every((row, index) => row.text === pkg.scriptSegments[index].text
      && typeof row.revisionRequired === 'boolean' && row.finding
      && Array.isArray(row.sourceIds) && row.sourceIds.length > 0
      && row.sourceIds.every((id) => sources.has(id)));
  if (!current) return { current: false, reason: 'Source review is stale or incomplete; review the current script' };
  return { current: true, decision: segments.some((row) => row.revisionRequired) ? 'EDITORIAL_REVISION_REQUIRED' : 'SOURCE_REVIEW_RECORDED_PUBLIC_APPROVAL_PENDING', revisionSegments: segments.flatMap((row, index) => row.revisionRequired ? [index + 1] : []), publicApproval: false };
}

export function validateMedia(pkg, payload, video, audio, captions) {
  const errors = [];
  const review = [];
  if (!pkg.metadata?.contentId || pkg.metadata.contentId !== payload.contentId || payload.brand !== 'Ani-Dax') errors.push('Package/payload identity mismatch');
  for (const value of [payload, pkg.publishReadyPayload]) {
    if (!value || value.publishAllowed !== false || value.youtubePrivacyStatus !== 'private' || value.automaticCrossPostingAllowed !== false) errors.push('Private-only publishing gate mismatch');
  }
  const duration = Number(video.format?.duration);
  const audioDuration = Number(audio.format?.duration);
  if (!Number.isFinite(duration) || duration <= 0 || !Number.isFinite(audioDuration) || audioDuration <= 0) errors.push('Invalid media duration');
  const videoStream = video.streams?.find((stream) => stream.codec_type === 'video');
  const audioStream = video.streams?.find((stream) => stream.codec_type === 'audio');
  if (!videoStream || !audioStream) errors.push('Rendered video must contain video and audio streams');
  if (duration + 0.1 < audioDuration || Number(audioStream?.duration || 0) + 0.1 < audioDuration) errors.push('Narration is cut off in render');
  const time = (value) => {
    const [h, m, s, ms] = value.split(/[:,]/).map(Number);
    return h * 3600 + m * 60 + s + ms / 1000;
  };
  const cues = captions.trim().split(/\r?\n\s*\r?\n/).map((block) => {
    const lines = block.split(/\r?\n/);
    const match = lines[1]?.match(/^(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})$/);
    if (!match) { errors.push('Invalid SRT cue'); return null; }
    return { start: time(match[1]), end: time(match[2]), text: lines.slice(2).join(' ') };
  }).filter(Boolean);
  if (!cues.length || cues.length !== pkg.scriptSegments?.length) errors.push('Caption/script cue count mismatch');
  for (const [index, cue] of cues.entries()) {
    if (cue.end <= cue.start || cue.end > duration + 0.1 || (index && cue.start < cues[index - 1].end)) errors.push('Caption timing outside render or overlapping');
    if (cue.text.trim() !== pkg.scriptSegments?.[index]?.text?.trim()) errors.push('Caption text differs from script');
    if (cue.start >= audioDuration - 0.25) review.push(`Cue ${index + 1} starts at/after narration end; narration alignment needs revision`);
  }
  if (pkg.audio?.supplied !== false) {
    if (!pkg.audio?.readyForFinal) review.push('Narration is draft audio; Daniel must approve or replace it');
    review.push('Caption speech alignment needs listening review; media duration is not alignment proof');
  }
  for (const [gate, status, note] of pkg.qc || []) if (status !== 'PASS') review.push(`${gate}: ${note}`);
  return { technicalPass: errors.length === 0, errors: [...new Set(errors)], reviewRequired: [...new Set(review)], durationSeconds: duration, narrationDurationSeconds: audioDuration, captionCount: cues.length, publishAllowed: false, youtubePrivacyStatus: 'private', automaticCrossPostingAllowed: false };
}

export function verify(root, packageRelative = 'artifacts/anidax/sprint-1-sample') {
  const inside = (relative) => {
    const full = path.resolve(root, relative);
    const rel = path.relative(root, full);
    if (rel.startsWith('..') || path.isAbsolute(rel)) throw new Error('Package artifact outside repository');
    return full;
  };
  const folder = inside(packageRelative);
  const read = (relative) => JSON.parse(fs.readFileSync(path.join(folder, relative), 'utf8'));
  const pkg = read('generated/content-package.json');
  if (fs.existsSync(path.join(folder, 'brief.json'))) {
    const brief = read('brief.json');
    validateBrief(JSON.parse(fs.readFileSync(inside(brief.canonFile), 'utf8')), brief, JSON.parse(fs.readFileSync(inside(brief.requestFile), 'utf8')));
    if (JSON.stringify(pkg.canonContext) !== JSON.stringify(brief.context) || JSON.stringify(pkg.scriptSegments.map((s) => s.text)) !== JSON.stringify(brief.scriptSegments.map((s) => s.text))) throw new Error('Rendered package context/script differs from validated brief');
  }
  const payload = read('generated/publish-ready-payload.json');
  const report = read('render/render-report.json');
  for (const file of ['approval-package.md', 'thumbnail/thumbnail.svg', 'generated/storyboard.svg', 'generated/analytics-record.json', 'generated/cost-record.json', 'generated/monetization-path.json']) {
    if (!fs.statSync(path.join(folder, file)).size) throw new Error(`Empty artifact: ${file}`);
  }
  const probe = (relative) => {
    const result = spawnSync('ffprobe', ['-v', 'error', '-show_format', '-show_streams', '-of', 'json', inside(relative)], { encoding: 'utf8', timeout: 30000 });
    if (result.status !== 0) throw new Error('ffprobe failed; media not verified');
    return JSON.parse(result.stdout);
  };
  const video = probe(report.videoPath);
  const audio = pkg.audio.supplied === false ? video : probe(pkg.audio.source);
  const result = { contentId: pkg.metadata.contentId, ...validateMedia(pkg, payload, video, audio, fs.readFileSync(path.join(folder, 'generated/captions.srt'), 'utf8')) };
  if (pkg.audio.supplied === false) {
    result.narrationDurationSeconds = null;
    result.reviewRequired.push('Silent placeholder audio only; no character narration has been produced or approved');
  }
  const sourceFile = path.join(folder, 'generated/source-review.json');
  result.sourceReview = validateSourceReview(pkg, fs.existsSync(sourceFile) ? read('generated/source-review.json') : null);
  if (fs.existsSync(sourceFile) && !result.sourceReview.current) {
    result.technicalPass = false;
    result.errors.push(result.sourceReview.reason);
  }
  if (result.sourceReview.current) {
    result.reviewRequired = result.reviewRequired.filter((note) => !note.startsWith('Canon/fact handling:'));
    result.reviewRequired.push(`Source QC: ${result.sourceReview.decision}; revision segments: ${result.sourceReview.revisionSegments.join(', ') || 'none'}. Final editorial/rights approval remains pending.`);
  }
  result.status = result.technicalPass ? 'READY_FOR_DANIEL_REVIEW_WITH_OPEN_QC' : 'TECHNICAL_VALIDATION_FAILED';
  fs.writeFileSync(path.join(folder, 'generated/review-validation.json'), `${JSON.stringify(result, null, 2)}\n`);
  return result;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = verify(process.cwd(), process.argv[2]);
  console.log(JSON.stringify(result, null, 2));
  if (!result.technicalPass) process.exitCode = 1;
}
