# Character + Canon Slice

The existing producer consumes a deterministic interview brief. No database, API, image scraper or multi-agent framework was added.

## Commands

Query: `node tools/anidax/canon.mjs business-state/canon/re-zero.json ram subaru arc2-first-employment 1 roswaal-mansion`

Create a new versioned package: `node tools/anidax/interview.mjs business-state/canon/re-zero.json business-state/canon/ram-interview-request.json artifacts/anidax/ram-interview-v2`

Render with the existing producer: `node tools/anidax/produce-sample.mjs --brief artifacts/anidax/ram-interview-v2/brief.json --out artifacts/anidax/ram-interview-v2`

Verify: `node tools/anidax/verify-review.mjs artifacts/anidax/ram-interview-v2`. Supply approved audio and measured narration report through existing producer flags when available. Current v1 has silent placeholder audio only. `npm run ops:review` indexes/validates both current candidates; adding a new candidate requires updating the existing queue paths.

## Data Contract

Each series file has its own IDs and provenance. Characters carry canonical names/aliases, identity, visual descriptors, outfit states and reference views. Missing attributes remain explicitly unknown. References may describe front/side/back/outfit views only after observation and provenance checks; URLs do not grant commercial rights. This seed has profile-page links only, no verified turnaround sheets or downloaded images.

Knowledge belongs to exact `(state id, version, continuity)` snapshots. No implicit earlier/later inheritance. A new memory/relationship state must explicitly state known facts, relationship edges, shared events and exclusions again. This avoids carrying remembered relationships through memory-loss events. Arc is a spoiler ceiling aid, not proof of a precise timeline or loop. Separate snapshots are required for divergent loops/adaptations.

State assertions use `field` for identity, personality, speechPatterns, motivations, values, fears, strengths, flaws, affiliations, abilities, appearance or outfits; each has source IDs, kind (`canon_fact` or `supported_inference`) and explicit `knownBy` character IDs. Only speaker-visible assertions enter a query. Relationships are directional, with perspective, source IDs and shared event IDs. Locations require evidence and eligible participants in the same snapshot. Unsupported locations/states reject rather than guessing.

Conflicts block interview generation. Quotes are reserved but ingestion is disabled until precise licensed/source locators and quote checks exist. Creative dialogue lives only in requests/output briefs and is always labeled `creative_extrapolation`; it cannot be inserted as a canon assertion. The five draft beats are authored input, not an autonomous LLM writing engine. The builder resolves evidence/context and assembles the existing production package; it cannot prove the semantic accuracy of arbitrary prose. Editorial QC remains required.

Seed scope: Ram, Rem, Subaru; early mansion employment; Ram-to-Subaru and Ram-to-Rem edges; Roswaal Mansion. Otto, Garfiel, Rem's later sleep/memory states, Sanctuary, Pristella and Watchtower are deliberately unsupported until sourced. Unknown traits/physical measurements are not inferred. The public official profile pages can contain later news; do not import that material into earlier snapshots.

Render briefs are checked against the current data and request before use. Changed source state requires regeneration. Existing source-QC and final review gates remain independent. There is no auto-publication, voice imitation, rights clearance, character-image generation or provider spend.
