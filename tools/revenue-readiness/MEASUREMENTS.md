# Content Measurement Import

Use existing business-state content IDs. This local importer accepts non-secret aggregate exports from a provider or an n8n export step; it makes no API calls. It does not authenticate the evidence or establish a live integration.

Run `npm run revenue:measurements -- --import path/to/export.json`, then `npm run business-state:build`. Read results with `npm run business-state:query -- measurements`.

Input is `{ "observations": [...] }`. Every observation requires `id` (stable provider event ID), `provider`, `sourceReference` (non-secret export/report reference), `brandId`, `contentId`, `observedAt` (ISO timestamp with timezone) and `kind`.

- `revenue` or `refund`: add `amountUsd`, nonnegative USD with at most two decimals.
- `cost`: add `amountUsd` and `category`: llm, image, video, tts, music, storage, api, other, product, platformFee or adSpend.
- `analytics`: add `platform` and `metrics`, a cumulative snapshot for that content item. Supported metrics: views, impressions, watchTimeSeconds, retention (0-1), likes, comments, shares, subscribersGained, clicks, conversions. Omit unavailable metrics. Do not mix period-only snapshots with cumulative snapshots.

Provider + event ID identifies a record. Identical retries do nothing; conflicts fail before writing. Corrections need a distinct, traceable refund/cost event, not a changed amount under an existing ID. No foreign-currency conversion is performed. Cross-brand/content mismatches fail. Do not include customer information, raw provider payloads, passwords, signed URLs or tokens.

Revenue minus recorded refunds and costs is recorded contribution only. Complete profit stays unknown until overhead/fee/tax coverage is established. No-data values stay null. Existing sample zero metrics are never imported automatically. Test fixtures never enter the real ledger.

Persistent input: `business-state/measurement-observations.json`. Derived output: `artifacts/revenue-readiness/measurements.json`. These are local files, not concurrent multi-writer storage; serialize imports. Current real ledger has no provider observations. An n8n provider-export adapter and verified account mapping remain required for automatic collection.
