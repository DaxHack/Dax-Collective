import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { queryCanon } from './canon.mjs';

export function buildInterview(data, request) {
  const allowedFields = ['contentId','speaker','subject','storyState','version','location','format','title','angle','dialogue','seriesId','maxSpoilerArc'];
  if (Object.keys(request).some((key) => !allowedFields.includes(key))) throw new Error('Unsupported request field; canon/knowledge cannot be overridden');
  const context = queryCanon(data, request);
  if (context.conflicts.length) throw new Error('Resolve source conflicts before generating dialogue');
  const allowed = new Map([...context.knownFacts, ...context.characterizationInferences].map((x) => [x.id, x]));
  if (!request.contentId || !request.title || !request.angle || !Array.isArray(request.dialogue) || request.dialogue.length !== 5) throw new Error('Interview requires identity, angle and five draft beats');
  const scriptSegments = request.dialogue.map((line, index) => {
    if (!['interviewer','character','narrator'].includes(line.role) || typeof line.text !== 'string' || !line.text.trim() || !line.evidenceIds?.length || line.evidenceIds.some((id) => !allowed.has(id))) throw new Error('Dialogue references unsupported speaker knowledge');
    return { start: index * 6, end: (index + 1) * 6, label: line.role === 'character' ? context.speaker.name : line.role, text: `${line.role === 'character' ? context.speaker.name : line.role}: ${line.text}`, classification: 'creative_extrapolation', evidenceIds: line.evidenceIds };
  });
  return {
    schemaVersion: 1, contentId: request.contentId, series: data.seriesName, title: request.title, topic: request.title, angle: request.angle,
    description: 'Original fictional interview draft informed by sourced characterization. Dialogue is invented, not canonical. Story-state lock and rights/voice/visual review required before publication.',
    context, scriptSegments,
    storyboard: scriptSegments.map((s) => ({ time: `${s.start}-${s.end}s`, visual: s.label === context.speaker.name ? 'Original abstract speaker card; no character likeness or copied reference art' : 'Original interviewer question card', textOverlay: s.label, assetType: 'Original text layout' })),
    assetPlan: ['Original abstract mansion interview set; architectural accuracy not claimed.', 'Official profile links are identification references only; no licensed front/side/back views verified.', 'No voice imitation or external media retrieval.'],
    qc: [['Canon context','REVIEW_REQUIRED','Exact state, knowledge ownership and evidence IDs checked; semantic fidelity of invented dialogue still requires editorial review.'],['Visual rights','BLOCKED','Reference URLs do not license reuse or generation of character likenesses.'],['Narration','BLOCKED','No approved character voice supplied.'],['Publishing','BLOCKED','Daniel final approval required.']],
    publicApproval: false, publishAllowed: false,
    canonRequest: request,
  };
}

export function validateBrief(data, brief, currentRequest = brief.canonRequest) {
  const { canonFile, requestFile, ...provided } = brief;
  if (JSON.stringify(currentRequest) !== JSON.stringify(brief.canonRequest)) throw new Error('Request changed since brief generation; regenerate in a new output version');
  if (JSON.stringify(buildInterview(data, brief.canonRequest)) !== JSON.stringify(provided)) throw new Error('Brief differs from current canon/request; regenerate in a new output version');
  return brief;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [canonPath, requestPath, output] = process.argv.slice(2);
  const brief = buildInterview(JSON.parse(fs.readFileSync(canonPath, 'utf8')), JSON.parse(fs.readFileSync(requestPath, 'utf8')));
  brief.canonFile = path.relative(process.cwd(), path.resolve(canonPath)).replace(/\\/g, '/');
  brief.requestFile = path.relative(process.cwd(), path.resolve(requestPath)).replace(/\\/g, '/');
  const out = path.resolve(output);
  if (fs.existsSync(path.join(out, 'brief.json'))) throw new Error('Output exists; use a new versioned output directory');
  fs.mkdirSync(path.join(out, 'generated'), { recursive: true });
  fs.writeFileSync(path.join(out, 'brief.json'), JSON.stringify(brief, null, 2) + '\n');
  fs.writeFileSync(path.join(out, 'generated/source-review.json'), JSON.stringify({ contentId: brief.contentId, reviewedAt: '2026-09-16', scope: 'Profile-based early-mansion draft; semantic dialogue/rights review pending', sources: brief.context.sources, segments: brief.scriptSegments.map((s) => ({ text: s.text, classification: 'CREATIVE_EXTRAPOLATION_NOT_CANON', sourceIds: [...new Set(s.evidenceIds.flatMap((id) => [...brief.context.knownFacts,...brief.context.characterizationInferences].find((x) => x.id === id).sourceIds))], finding: 'Original fictional dialogue anchored to the selected speaker knowledge; not a canonical quote.', revisionRequired: true })), publicApproval: false }, null, 2) + '\n');
  console.log(JSON.stringify({ output: out, contentId: brief.contentId, state: brief.context.storyState, publishAllowed: false }, null, 2));
}
