import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function validateCanon(data) {
  const ids = (rows) => {
    if (!Array.isArray(rows) || new Set(rows.map((x) => x.id)).size !== rows.length || rows.some((x) => !x.id)) throw new Error('Missing/duplicate IDs');
    return new Set(rows.map((x) => x.id));
  };
  if (data.schemaVersion !== 1 || !data.seriesId) throw new Error('Unsupported canon schema');
  const sources = ids(data.sources), characters = ids(data.characters);
  ids(data.states.map((state) => ({ id: `${state.id}@${state.version}` })));
  const evidence = (row) => { if (!row.sourceIds?.length || row.sourceIds.some((id) => !sources.has(id))) throw new Error('Missing source evidence'); };
  for (const character of data.characters) evidence(character);
  for (const state of data.states) {
    if (!Number.isInteger(state.version) || state.version < 1 || state.inherits !== null || !state.continuity || !state.boundary) throw new Error('Explicit versioned snapshot required; no automatic state inheritance');
    const assertions = ids(state.assertions), events = ids(state.events);
    ids(state.locations);
    for (const row of state.assertions) {
      evidence(row);
      if (!['canon_fact', 'supported_inference'].includes(row.kind) || !row.knownBy?.length || row.knownBy.some((id) => !characters.has(id))) throw new Error('Invalid assertion/knowledge owner; creative dialogue is not canon');
    }
    for (const row of [...state.events, ...state.locations]) { evidence(row); if (row.participants.some((id) => !characters.has(id))) throw new Error('Unknown participant'); }
    for (const edge of state.relationships) {
      evidence(edge);
      if (!characters.has(edge.speaker) || !characters.has(edge.subject) || edge.assertionIds.some((id) => !assertions.has(id)) || edge.sharedEventIds.some((id) => !events.has(id))) throw new Error('Invalid relationship reference');
    }
    if (state.quotes.length) throw new Error('Canonical quote ingestion is not enabled in this slice');
  }
  return data;
}

export function queryCanon(data, request) {
  validateCanon(data);
  if (request.maxSpoilerArc !== undefined && (!Number.isInteger(request.maxSpoilerArc) || request.maxSpoilerArc < 0)) throw new Error('Invalid spoiler ceiling');
  if (request.seriesId && request.seriesId !== data.seriesId) throw new Error('Series mismatch');
  const state = data.states.find((x) => x.id === request.storyState && x.version === request.version);
  if (!state) throw new Error('Unsupported story state/version; source a new explicit snapshot');
  if (request.maxSpoilerArc !== undefined && state.arc > request.maxSpoilerArc) throw new Error('Selected state exceeds spoiler boundary');
  const speaker = data.characters.find((x) => x.id === request.speaker);
  const subject = data.characters.find((x) => x.id === request.subject);
  const relationship = state.relationships.find((x) => x.speaker === speaker?.id && x.subject === subject?.id);
  const location = state.locations.find((x) => x.id === request.location);
  if (!speaker || !subject || !relationship || !location || !location.participants.includes(speaker.id) || !location.participants.includes(subject.id)) throw new Error('Unsupported relationship/location at selected state');
  if (request.format !== 'interview') throw new Error('Only interview format is implemented');
  const facts = state.assertions.filter((x) => x.knownBy.includes(speaker.id));
  if (relationship.assertionIds.some((id) => !facts.some((x) => x.id === id))) throw new Error('Relationship requires knowledge unavailable to speaker');
  const events = state.events.filter((x) => relationship.sharedEventIds.includes(x.id) && x.participants.includes(speaker.id));
  const sourceIds = new Set([...facts, ...events, relationship, location].flatMap((x) => x.sourceIds));
  return {
    seriesId: data.seriesId, storyState: { id: state.id, version: state.version, continuity: state.continuity, boundary: state.boundary, spoilerLevel: state.spoilerLevel },
    speaker: { id: speaker.id, name: speaker.canonicalName }, subject: { id: subject.id, name: subject.canonicalName },
    knownFacts: facts.filter((x) => x.kind === 'canon_fact'), characterizationInferences: facts.filter((x) => x.kind === 'supported_inference'),
    relationship, sharedEvents: events, location,
    mustNotKnow: state.knowledgeExclusions.filter((x) => x.speaker === speaker.id),
    uncertainty: state.uncertainty, conflicts: state.conflicts,
    sources: data.sources.filter((x) => sourceIds.has(x.id)),
    visualReferences: [speaker, subject].map((x) => ({ characterId: x.id, references: x.referenceViews, descriptors: x.visualDescriptors, outfitStates: x.outfitStates })),
    publicApproval: false,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [file, speaker, subject, storyState, version, location] = process.argv.slice(2);
  console.log(JSON.stringify(queryCanon(JSON.parse(fs.readFileSync(file, 'utf8')), { speaker, subject, storyState, version: Number(version), location, format: 'interview' }), null, 2));
}
