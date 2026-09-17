import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateCanon } from './canon.mjs';

const weights = { viewerInterest: 25, analyzability: 20, originality: 15, canonSupport: 20, feasibility: 10 };
const day = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Expected ISO date');
  const result = Date.parse(value);
  if (!Number.isFinite(result) || new Date(result).toISOString().slice(0, 10) !== value) throw new Error('Invalid date');
  return result;
};
const requiredText = (value) => { if (typeof value !== 'string' || !value.trim()) throw new Error('Missing required text'); };

export function discover(input, registry, canon, asOf) {
  validateCanon(canon);
  const today = day(asOf);
  if (input.schemaVersion !== 1 || registry.schemaVersion !== 1 || !Array.isArray(input.candidates)) throw new Error('Unsupported discovery schema');
  const formats = new Map(registry.formats.map((format) => [format.id, format]));
  if (formats.size !== registry.formats.length || !Number.isInteger(registry.defaultAudience.maxArc)) throw new Error('Invalid format registry');
  const ids = new Set();
  const candidates = input.candidates.map((candidate) => {
    if (!/^[a-z0-9-]+$/.test(candidate.id) || ids.has(candidate.id)) throw new Error('Invalid/duplicate candidate ID');
    ids.add(candidate.id);
    const format = formats.get(candidate.formatId);
    if (!format) throw new Error('Unknown format');
    for (const key of ['claim','angle','originalityOpportunity','spoilerRisk','copyrightAssetDifficulty','productionComplexity','audienceRelevance','monetizationRelevance']) requiredText(candidate[key]);
    if (!['canon-testable','interpretive','speculative','subjective'].includes(candidate.claimType)) throw new Error('Invalid claim type');
    for (const key of ['characters','topics','canonSourcesRequired']) if (!Array.isArray(candidate[key]) || !candidate[key].length || candidate[key].some((x) => typeof x !== 'string' || !x.trim())) throw new Error('Missing research requirements');
    const source = candidate.source;
    const url = new URL(source.url);
    if (url.protocol !== 'https:' || url.username || url.password || url.search) throw new Error('Use public, credential-free source URL');
    requiredText(source.locator);
    if (!['search_excerpt','page_verified'].includes(source.access)) throw new Error('Unknown access evidence');
    const observed = day(source.observedAt);
    const published = source.publishedAt === null ? null : day(source.publishedAt);
    if (observed > today || (published !== null && published > observed)) throw new Error('Future/inconsistent source date');
    for (const key of ['displayedVotes','comments']) if (source.activity[key] !== null && (!Number.isInteger(source.activity[key]) || source.activity[key] < 0)) throw new Error('Invalid observed activity');
    requiredText(source.activity.scope);
    if (candidate.trending === true) throw new Error('V1 does not establish trends from a post snapshot');
    const scope = candidate.scope;
    if (!['anime-safe','novel-spoilers','mixed-spoilers','unknown'].includes(scope.classification) || (scope.maxArc !== null && (!Number.isInteger(scope.maxArc) || scope.maxArc < 1))) throw new Error('Invalid spoiler scope');
    requiredText(scope.reason);
    const scores = {};
    for (const [key, weight] of Object.entries(weights)) {
      const item = candidate.assessment[key];
      if (!Number.isInteger(item?.score) || item.score < 0 || item.score > 5) throw new Error('Invalid editorial score');
      requiredText(item.reason);
      scores[key] = item.score * weight / 5;
    }
    const ageDays = published === null ? null : Math.floor((today - published) / 86400000);
    scores.timeliness = ageDays === null ? 0 : ageDays <= 7 ? 10 : ageDays <= 30 ? 7 : ageDays <= 90 ? 3 : 0;
    const holds = [];
    if (source.access !== 'page_verified') holds.push('VERIFY_SOURCE_CONTEXT');
    if ((today - observed) / 86400000 > 30) holds.push('REFRESH_OBSERVATION');
    if (scope.classification !== 'anime-safe' || scope.maxArc === null || scope.maxArc > registry.defaultAudience.maxArc) holds.push('SPOILER_SCOPE_REVIEW');
    const requirements = [...registry.sharedRequired, ...format.requires];
    return {
      ...candidate,
      source: { ...source, popularityConclusion: 'ONE_OBSERVED_DISCUSSION_NOT_A_TREND' },
      ranking: { score: Object.values(scores).reduce((a, b) => a + b, 0), components: scores, label: 'EDITORIAL_PRIORITIZATION_NOT_PREDICTED_PERFORMANCE', ageDays, engagementWeight: 0 },
      route: holds.length ? 'HELD_FOR_SOURCE_OR_SPOILERS' : 'RESEARCH_REQUIRED', holds,
      evidenceLadder: { fandomClaim: candidate.claim, sourcedCanonEvidence: [], directlyEstablishes: null, reasonableInterpretation: null, doesNotEstablish: null, aniDaxConclusion: null, preferenceConflict: 'NOT_ASSESSED_CANON_OVERRIDES_PREFERENCE' },
      productionHandoff: {
        formatId: format.id, requiredFields: requirements, missingFields: requirements,
        storyStateLock: null,
        canonStore: 'business-state/canon/re-zero.json',
        availableSnapshotIds: canon.states.filter((x) => x.arc <= registry.defaultAudience.maxArc).map((x) => ({ id: x.id, version: x.version })),
        evidenceBinding: 'Select an exact snapshot or source a new one; existing snapshots do not automatically support this topic',
        adapter: format.rendererAdapter, adapterStatus: format.rendererAdapter ? 'EXISTING_REQUIRES_VALIDATED_BRIEF' : 'CONTRACT_PREPARED_RENDER_ADAPTER_NOT_IMPLEMENTED',
        qcRequired: format.qc, renderAllowed: false, publishAllowed: false, automaticCrossPostingAllowed: false,
      },
    };
  }).sort((a, b) => b.ranking.score - a.ranking.score || a.id.localeCompare(b.id));
  return {
    schemaVersion: 1, asOf, audience: registry.defaultAudience,
    collectionMode: 'MANUAL_BOUNDED_PUBLIC_EVIDENCE_INTAKE_NO_SCRAPING',
    candidates,
    safeQueue: candidates.filter((x) => !x.holds.length).map((x) => ({ id: x.id, claim: x.claim, formatId: x.formatId, route: x.route, score: x.ranking.score })),
    held: candidates.filter((x) => x.holds.length).map((x) => ({ id: x.id, route: x.route, holds: x.holds })),
    renderAllowed: false, publishAllowed: false, automaticCrossPostingAllowed: false,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
  const asOf = process.argv[2] || new Date().toISOString().slice(0, 10);
  const result = discover(read('business-state/anidax-discovery.json'), read('business-state/anidax-formats.json'), read('business-state/canon/re-zero.json'), asOf);
  const folder = 'artifacts/anidax/discovery';
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(`${folder}/private-research-queue.json`, JSON.stringify(result, null, 2) + '\n');
  const { candidates, ...safe } = result;
  fs.writeFileSync(`${folder}/anime-safe-queue.json`, JSON.stringify(safe, null, 2) + '\n');
  console.log(JSON.stringify({ candidates: candidates.length, safe: result.safeQueue.length, held: result.held.length, output: folder, publishAllowed: false }));
}
