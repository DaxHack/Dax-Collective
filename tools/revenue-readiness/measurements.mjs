import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const categories = ['llm', 'image', 'video', 'tts', 'music', 'storage', 'api', 'other', 'product', 'platformFee', 'adSpend'];
const metrics = ['views', 'impressions', 'watchTimeSeconds', 'retention', 'likes', 'comments', 'shares', 'subscribersGained', 'clicks', 'conversions'];
const fields = ['id', 'brandId', 'contentId', 'provider', 'sourceReference', 'observedAt', 'kind', 'amountUsd', 'category', 'platform', 'metrics'];

function validate(row, queue) {
  if (!row || typeof row !== 'object' || Array.isArray(row)) throw new Error('Expected observation object');
  for (const key of Object.keys(row)) if (!fields.includes(key)) throw new Error(`Unsupported field: ${key}; import aggregate non-secret data only`);
  for (const key of ['id', 'brandId', 'contentId', 'provider', 'sourceReference', 'observedAt']) {
    if (typeof row[key] !== 'string' || !row[key].trim()) throw new Error(`Missing ${key}`);
  }
  if (!queue.some((item) => item.contentId === row.contentId && item.brandId === row.brandId)) throw new Error('Unknown content or brand mismatch');
  if (!/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(row.observedAt) || !Number.isFinite(Date.parse(row.observedAt))) throw new Error('Invalid observedAt');
  if (!['revenue', 'refund', 'cost', 'analytics'].includes(row.kind)) throw new Error('Invalid observation kind');
  if (row.kind === 'analytics') {
    if (typeof row.platform !== 'string' || !row.platform.trim() || !row.metrics || !Object.keys(row.metrics).length) throw new Error('Analytics requires platform and metrics');
    if ('amountUsd' in row || 'category' in row) throw new Error('Analytics cannot contain money');
    for (const [key, value] of Object.entries(row.metrics)) {
      if (!metrics.includes(key) || typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw new Error(`Invalid metric ${key}`);
      if (key === 'retention' && value > 1) throw new Error('Retention must be a fraction from 0 to 1');
      if (!['retention', 'watchTimeSeconds'].includes(key) && !Number.isInteger(value)) throw new Error('Counts must be integers');
    }
  } else {
    if (typeof row.amountUsd !== 'number' || !Number.isFinite(row.amountUsd) || row.amountUsd < 0 || Math.abs(row.amountUsd * 100 - Math.round(row.amountUsd * 100)) > 0.000001) throw new Error('Money must be nonnegative USD with at most two decimals');
    if ('metrics' in row || 'platform' in row) throw new Error('Money observations cannot contain analytics');
    if (row.kind === 'cost' && !categories.includes(row.category)) throw new Error('Invalid cost category');
    if (row.kind !== 'cost' && 'category' in row) throw new Error('Only cost observations have categories');
  }
}

function canonical(row) {
  return JSON.stringify(row, Object.keys(row).concat(metrics).sort());
}

export function mergeObservations(existing, incoming, queue) {
  if (!Array.isArray(existing) || !Array.isArray(incoming)) throw new Error('Observations must be arrays');
  const rows = new Map();
  for (const row of [...existing, ...incoming]) {
    validate(row, queue);
    const key = JSON.stringify([row.provider, row.id]);
    if (rows.has(key) && canonical(rows.get(key)) !== canonical(row)) throw new Error('Conflicting provider observation ID');
    rows.set(key, row);
  }
  return [...rows.values()];
}

export function summarize(observations, queue) {
  return queue.map((item) => {
    const rows = observations.filter((row) => row.contentId === item.contentId && row.brandId === item.brandId);
    const money = (kind) => rows.filter((row) => row.kind === kind);
    const sum = (values) => values.reduce((total, row) => total + Math.round(row.amountUsd * 100), 0);
    const revenue = money('revenue');
    const refunds = money('refund');
    const costs = money('cost');
    const snapshots = new Map();
    for (const row of rows.filter((entry) => entry.kind === 'analytics')) {
      const key = JSON.stringify([row.provider, row.platform]);
      const prior = snapshots.get(key);
      if (!prior || Date.parse(row.observedAt) > Date.parse(prior.observedAt)) snapshots.set(key, row);
      else if (row.observedAt === prior.observedAt && canonical(row.metrics) !== canonical(prior.metrics)) throw new Error('Conflicting analytics snapshots at same time');
    }
    const net = revenue.length ? (sum(revenue) - sum(refunds)) / 100 : null;
    const cost = costs.length ? sum(costs) / 100 : null;
    return {
      brandId: item.brandId, contentId: item.contentId, observationCount: rows.length,
      netRevenueUsd: net, recordedCostUsd: cost,
      recordedContributionUsd: net === null || cost === null ? null : Math.round((net - cost) * 100) / 100,
      totalProfitUsd: null,
      costByCategoryUsd: Object.fromEntries(categories.map((category) => [category, costs.some((row) => row.category === category) ? sum(costs.filter((row) => row.category === category)) / 100 : null])),
      latestAnalytics: [...snapshots.values()].map(({ provider, platform, observedAt, metrics, sourceReference }) => ({ provider, platform, observedAt, metrics, sourceReference })),
      learningStatus: snapshots.size ? 'OBSERVATIONS_AVAILABLE_REVIEW_COVERAGE' : 'INSUFFICIENT_MEASURED_DATA',
      nextAction: snapshots.size ? 'Compare complete observation windows before changing content strategy.' : 'Import a verified provider aggregate export after approved distribution.',
    };
  });
}

export function run(root, inputFile) {
  const state = JSON.parse(fs.readFileSync(path.join(root, 'artifacts/business-state/current-state.json'), 'utf8'));
  const ledgerPath = path.join(root, 'business-state/measurement-observations.json');
  const existing = fs.existsSync(ledgerPath) ? JSON.parse(fs.readFileSync(ledgerPath, 'utf8')).observations : [];
  const incoming = inputFile ? JSON.parse(fs.readFileSync(path.resolve(root, inputFile), 'utf8')).observations : [];
  const observations = mergeObservations(existing, incoming, state.contentQueue);
  const report = {
    generatedAt: new Date().toISOString(), source: 'business-state/measurement-observations.json',
    status: observations.length ? 'IMPORTED_OBSERVATIONS_NOT_PROVIDER_AUTHENTICATED' : 'NO_PROVIDER_OBSERVATIONS',
    rule: 'USD transaction events are additive; analytics are latest cumulative snapshots per provider/platform. No inferred zero, complete profit, live connection, or causal learning claims.',
    publicPublishingAllowed: false,
    items: summarize(observations, state.contentQueue),
  };
  fs.mkdirSync(path.dirname(ledgerPath), { recursive: true });
  fs.mkdirSync(path.join(root, 'artifacts/revenue-readiness'), { recursive: true });
  fs.writeFileSync(ledgerPath, `${JSON.stringify({ schemaVersion: 1, observations }, null, 2)}\n`);
  fs.writeFileSync(path.join(root, 'artifacts/revenue-readiness/measurements.json'), `${JSON.stringify(report, null, 2)}\n`);
  return { observations: observations.length, added: observations.length - existing.length, items: report.items.length, status: report.status };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.length && (args[0] !== '--import' || args.length !== 2)) throw new Error('Usage: node tools/revenue-readiness/measurements.mjs [--import aggregate-observations.json]');
  console.log(JSON.stringify(run(process.cwd(), args[1]), null, 2));
}
