# AI Opportunity Map — 2026-11-04

Scored against the systems already running, as verified in [the current-state audit](audits/current-state-2026-11-04.md). The ranks are CRITICAL, HIGH VALUE, MEDIUM, LOW VALUE and IGNORE. Revenue figures are deliberately left out: no product has sales data yet, so any number would be invented.

## Reference videos: what holds up

| Video | Useful, realistic idea | Claim to discount |
|---|---|---|
| Nick Saraev, *31 Ways to Use Claude* | Claude as an operator running a business's own systems: research, drafting, automations, agents | His results come from an agency with large clients and existing distribution |
| Tina Huang, *AI Roadmap* | Choose one track (building systems or building products) instead of learning everything | None. It's learning guidance, not an income claim |
| Joshua Mayo, *4 Ways to Make Money With Claude* | Printable worksheets, wall art, spreadsheet templates and faceless YouTube, with Claude drafting and Canva finishing | The Etsy earnings shown are survivorship examples, and the market is crowded |
| Mark Tilbury, *Laziest Way* (AI influencers) | Using a character for faceless content | A 7-day "challenge" isn't evidence of income, and fake personas carry brand-trust risk. **IGNORE for God's Vessel** |

## Ranked map

| Use case | Area | Time saved | Revenue potential | Cost | Difficulty | Tools | Automation | Risks | Rank / decision |
|---|---|---|---|---|---|---|---|---|---|
| Daily job search → de-duplicated tracker → tailored application packs | Career | 3–5 h/wk | Stable income (priority #2) | $0 | Low | Indeed connector, Claude, ARIA Opportunity | Search and drafting automated; submitting stays manual | Weak-fit roles; must never apply automatically | **CRITICAL: building** |
| Brand creative QA gate (Gemini reviews every draft before Daniel sees it) | Content QA | 2–4 h/wk | Protects brand quality | ~$0 at this volume | Low | n8n DAX-05, Gemini 2.5 Flash, ARIA ContentItem | Review automated; approval manual | Model non-determinism; false positives | **CRITICAL: built** |
| God's Vessel printable digital products (studies, scripture art, journals) | Digital products | n/a | Low–medium per unit, zero inventory | $0 to build; listing fees on sale | Low | Claude, HTML→PDF, ARIA Product | Drafting automated | Demand unproven; crowded market | **HIGH: v1 built** |
| YHWH apparel launch (Printify) | GV revenue | n/a | Medium | Unit cost and samples | Medium | Printify, ARIA approval ledger | Low | Unverified costs and print files | **HIGH: blocked on Printify access** |
| ARIA ↔ n8n bridge (workers write WorkerRun and verdicts back to ARIA) | ARIA delegation | 2 h/wk | Indirect | $0 | Medium | Base44 API, n8n | High | Needs an API key in n8n | **HIGH: needs a credential decision** |
| Daily operations brief into ARIA | ARIA / operations | 1 h/wk | Indirect | $0 | Low | n8n DAX-04 | Scheduled (re-registered 11-04) | Output goes nowhere yet | **MEDIUM** |
| Production deploy pipeline: rules, backend, DNS | Build & integration | n/a | Unblocks the waitlist and lead capture | Blaze plan (free tier) | Low | Firebase, Cloud Run | CI exists | Billing change | **CRITICAL: approval package ready** |
| Analytics digest: GA4 + content metrics → weekly summary | Analytics | 1 h/wk | Better decisions | $0 | Medium | GA4 API, n8n, ARIA ContentItem | High | Needs GA API access | **MEDIUM: after DNS** |
| Grants, creator programs and sponsorship scan | Opportunities | 2 h/wk | Medium, one-off | $0 | Low | Claude research, ARIA Opportunity | Medium | Noise | **MEDIUM** |
| Faceless brand video pipeline (TTS, render) | Content | High once working | Ad revenue is slow to build | API and render cost | High | n8n video workflows, FFmpeg | Medium | 40+ inactive workflows already exist; repair before building more | **MEDIUM: repair, don't rebuild** |
| Spreadsheet and tracker templates | Digital products | n/a | Low | $0 | Low | Claude, Google Sheets | Medium | Saturated market | **LOW VALUE** |
| AI influencer personas | Content | n/a | Unproven | Tool subscriptions | Medium | Higgsfield and similar | Medium | Trust risk, off-brand | **IGNORE** |

## Top 5

1. **Career pipeline.** Daily search, de-duplication and honest fit scoring into ARIA, plus tailored application drafts. Daniel decides and submits.
2. **Creative QA gate (DAX-05).** Every draft is reviewed by Gemini against the brand rules and KJV accuracy before it reaches "NEEDS DANIEL".
3. **God's Vessel digital products.** Zero-inventory printables that match the apparel line. Test one listing before making more.
4. **Production pipeline.** Rules deploy, then the Cloud Run backend, then DNS. This turns on lead capture (the waitlist) for every product launch.
5. **ARIA ↔ n8n bridge.** Lets workers log their own runs and verdicts, so ARIA stops depending on manual updates.

Items 1–3 were implemented on 2026-11-04. Items 4 and 5 need Daniel's approval: billing and DNS for 4, an API credential for 5.
