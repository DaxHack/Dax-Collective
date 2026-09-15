#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const now = new Date().toISOString();
const outDir = path.join(root, 'artifacts', 'business-state');
fs.mkdirSync(outDir, { recursive: true });

const brandRules = readJson(path.join(root, 'business-state', 'brand-rules.json')) || { brands: [] };
const permissions = readJson(path.join(root, 'business-state', 'permissions.json')) || {};
const n8nInventory = readJson(path.join(root, 'artifacts', 'n8n-inventory.json')) || { rows: [] };
const revenueReadiness = readJson(path.join(root, 'artifacts', 'revenue-readiness', 'current-revenue-readiness.json'));

const queue = collectContentQueue();
const approvalDecisions = readJson(path.join(root, 'business-state', 'approval-decisions.json'));
const state = {
  generatedAt: now,
  stateVersion: 1,
  sourceOfTruth: {
    repository: 'DaxHack/Dax-Collective',
    branch: 'codex/legal-oauth-pages-20260913',
    statusFile: 'EXECUTION_STATUS.md',
    blockersFile: 'BLOCKERS.md',
    n8nInventoryFile: 'N8N_INVENTORY.md',
    nextSessionFile: 'NEXT_SESSION.md',
  },
  permissions,
  brands: brandRules.brands.map((brand) => ({
    ...brand,
    currentQueue: queue.filter((item) => item.brandId === brand.id),
    currentState: summarizeBrandState(brand.id, queue),
  })),
  contentQueue: queue,
  approvalDecisions: approvalDecisions ? {
    source: 'business-state/approval-decisions.json',
    generatedAt: approvalDecisions.generatedAt,
    pending: approvalDecisions.decisions.filter((row) => row.decisionStatus === 'PENDING_DANIEL_REVIEW').length,
    decisions: approvalDecisions.decisions.map(({ contentId, decisionStatus, reviewFingerprint }) => ({ contentId, decisionStatus, reviewFingerprint })),
    executionAuthorized: false,
  } : null,
  workflowHealth: summarizeWorkflowHealth(n8nInventory.rows || []),
  credentialHealth: summarizeCredentialHealth(n8nInventory.rows || []),
  revenueReadiness: revenueReadiness ? summarizeRevenueReadiness(revenueReadiness) : null,
  costs: summarizeCosts(),
  blockers: summarizeBlockers(),
  actions: {
    canListBrands: true,
    canReadBrandRules: true,
    canReadContentQueue: true,
    canReadWorkflowHealth: true,
    canReadCredentialHealthWithoutSecrets: true,
    canCreateDrafts: true,
    canUpdateStatusFiles: true,
    canTriggerPublicPublishing: false,
    canPurchaseOrSpend: false,
    canChangeCredentials: false,
  },
};

writeJson(path.join(outDir, 'current-state.json'), state);
fs.writeFileSync(path.join(root, 'BUSINESS_STATE.md'), buildMarkdown(state));

console.log(
  JSON.stringify(
    {
      ok: true,
      output: path.relative(root, path.join(outDir, 'current-state.json')).replace(/\\/g, '/'),
      brands: state.brands.length,
      queueItems: state.contentQueue.length,
      workflowTemplates: state.workflowHealth.templateCount,
    },
    null,
    2,
  ),
);

function readJson(file) {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function collectContentQueue() {
  const items = [];

  const aniDax = readJson(path.join(root, 'artifacts', 'anidax', 'sprint-1-sample', 'generated', 'content-package.json'));
  if (aniDax) {
    items.push({
      brandId: 'ani-dax',
      brand: 'Ani-Dax',
      contentId: aniDax.metadata?.contentId || 'anidax-sprint-1-sample',
      title: aniDax.metadata?.title || aniDax.concept?.topic || 'Ani-Dax Sprint 1 sample',
      status: aniDax.concept?.productionStatus || 'READY_FOR_APPROVAL_PACKAGE',
      publishAllowed: false,
      owner: 'Daniel',
      nextAction: 'Approve concept/script and final voice/visual style before publishing.',
      artifactPath: 'artifacts/anidax/sprint-1-sample/',
      materialSeparation: 'AI-assisted support package; no public publishing.',
    });
  }

  const godsVessel = readJson(path.join(root, 'artifacts', 'gods-vessel', 'names-of-god', 'collection.json'));
  if (godsVessel) {
    const godsListings = readJson(path.join(root, 'artifacts', 'gods-vessel', 'names-of-god', 'listings', 'storefront-listings.json'));
    items.push({
      brandId: 'gods-vessel',
      brand: "God's Vessel",
      contentId: godsVessel.collectionId || 'gods-vessel-names-of-god',
      title: godsVessel.collectionName || 'Names of God collection',
      status: godsVessel.status || 'READY_FOR_DANIEL_REVIEW_AND_VENDOR_SETUP',
      publishAllowed: false,
      owner: 'Daniel',
      nextAction: godsListings
        ? 'Review prepared storefront/Printify/Shopify draft listing package, then approve theology, product copy, final Canva masters, vendor setup, and storefront path.'
        : 'Approve theology, product choices, pricing, vendor setup, and storefront path.',
      artifactPath: 'artifacts/gods-vessel/names-of-god/',
      materialSeparation: godsListings
        ? 'Draft product/design/listing assets only; no live commerce, checkout, purchase, or public product publishing.'
        : 'Draft product/design assets, not live commerce.',
      commerceArtifacts: godsListings
        ? {
            listingStatus: godsListings.status,
            preparedListingCount: godsListings.listings?.length || 0,
            publicPublishingAllowed: Boolean(godsListings.publicPublishingAllowed),
            purchaseEnabled: Boolean(godsListings.purchaseEnabled),
            listingPackage: godsVessel.listingPackage || {},
          }
        : null,
    });
  }

  const timeZonePayload = readJson(
    path.join(root, 'artifacts', 'timezone-travelers', 'sprint-3-sample', 'generated', 'publish-ready-payload.json'),
  );
  if (timeZonePayload) {
    items.push({
      brandId: 'time-zone-travelers',
      brand: 'Time-Zone Travelers',
      contentId: timeZonePayload.contentId,
      title: timeZonePayload.title,
      status: timeZonePayload.approvalStatus || 'READY_FOR_DANIEL_REVIEW',
      publishAllowed: Boolean(timeZonePayload.publishAllowed),
      owner: 'Daniel',
      nextAction: 'Approve concept/script, final source check, narration, account mapping, and links.',
      artifactPath: 'artifacts/timezone-travelers/sprint-3-sample/',
      materialSeparation: 'Source-backed draft with approved repo assets and no active affiliate claim.',
    });
  }

  const daxQueue = readJson(path.join(root, 'artifacts', 'dax-the-traveler', 'sprint-4-support', 'generated', 'content-queue.json'));
  if (Array.isArray(daxQueue)) {
    for (const item of daxQueue) {
      items.push({
        brandId: 'dax-the-traveler',
        brand: 'Dax the Traveler',
        contentId: item.contentId,
        title: item.title,
        status: item.status,
        publishAllowed: Boolean(item.publishAllowed),
        owner: item.nextOwner || 'Daniel',
        nextAction: item.nextAction,
        artifactPath: 'artifacts/dax-the-traveler/sprint-4-support/',
        materialSeparation: item.materialType || 'Original Daniel material with AI-generated support.',
      });
    }
  }

  return items;
}

function summarizeBrandState(brandId, queue) {
  const brandItems = queue.filter((item) => item.brandId === brandId);
  const readyForReview = brandItems.filter((item) => /READY_FOR|READY FOR/i.test(item.status || '')).length;
  return {
    queueItems: brandItems.length,
    readyForReview,
    publishBlockedItems: brandItems.filter((item) => item.publishAllowed === false).length,
    publicPublishingAllowed: false,
  };
}

function summarizeWorkflowHealth(rows) {
  const counts = rows.reduce((acc, row) => {
    const bucket = String(row.status || 'UNKNOWN').split(' - ')[0];
    acc[bucket] = (acc[bucket] || 0) + 1;
    return acc;
  }, {});

  const relevant = rows
    .filter((row) => /ani|traveler|timezone|gods|publish|youtube|tiktok|instagram|analytics|revenue/i.test(`${row.file} ${row.name}`))
    .map((row) => ({
      file: row.file,
      name: row.name,
      active: row.active,
      status: row.status,
      integrations: row.nodeTypes,
      credentialReferenceCount: (row.credentials || []).length,
    }));

  return {
    generatedAt: n8nInventory.generatedAt || null,
    templateCount: rows.length,
    activeTemplatesInExport: rows.filter((row) => row.active).length,
    statusCounts: counts,
    relevantWorkflows: relevant,
  };
}

function summarizeCredentialHealth(rows) {
  const credentialNames = [
    ...new Set(rows.flatMap((row) => row.credentials || [])),
  ].sort();

  return {
    policy: 'Credential names/integration references only; no secret values included.',
    firebaseHostingServiceAccount: 'WORKING_FOR_PR_PREVIEW',
    firebaseClientConfig: 'NEEDS_DANIEL_GITHUB_SECRET_OR_VARIABLE_VALUES_FOR_FULL_AUTH_RUNTIME',
    n8nRuntimeCredentials: 'UNVERIFIED_FROM_REPOSITORY_ONLY',
    referencedCredentialCount: credentialNames.length,
    referencedCredentialNames: credentialNames,
  };
}

function summarizeRevenueReadiness(readiness) {
  return {
    generatedAt: readiness.generatedAt,
    status: readiness.status,
    verifiedRevenueUsd: readiness.verifiedRevenueUsd,
    verifiedCostUsd: readiness.verifiedCostUsd,
    verifiedProfitUsd: readiness.verifiedProfitUsd,
    adSpendUsd: readiness.adSpendUsd,
    publicPublishingAllowed: readiness.publicPublishingAllowed,
    purchaseOrEnrollmentAllowed: readiness.purchaseOrEnrollmentAllowed,
    brandCount: readiness.brands?.length || 0,
    firstDollarSequence: readiness.firstDollarSequence || [],
    measurementFields: readiness.measurementSchema?.requiredFields || [],
  };
}

function summarizeCosts() {
  const costFiles = [
    ['ani-dax', 'artifacts/anidax/sprint-1-sample/generated/cost-record.json'],
    ['time-zone-travelers', 'artifacts/timezone-travelers/sprint-3-sample/generated/cost-record.json'],
    ['dax-the-traveler', 'artifacts/dax-the-traveler/sprint-4-support/generated/cost-record.json'],
  ];

  const costs = costFiles.map(([brandId, relPath]) => {
    const data = readJson(path.join(root, relPath));
    return {
      brandId,
      artifactPath: relPath,
      localProofRunUsd: data?.localProofRunUsd || null,
    };
  });

  const godsVessel = readJson(path.join(root, 'artifacts', 'gods-vessel', 'names-of-god', 'collection.json'));
  if (godsVessel?.costSummary) {
    costs.push({
      brandId: 'gods-vessel',
      artifactPath: 'artifacts/gods-vessel/names-of-god/collection.json',
      localProofRunUsd: godsVessel.costSummary,
    });
  }

  return costs;
}

function summarizeBlockers() {
  return {
    file: 'BLOCKERS.md',
    durableStatusFile: 'EXECUTION_STATUS.md',
    topHumanApprovals: [
      'Merge PR #3 and approve public deployment.',
      'Add/confirm Firebase browser config values in GitHub Secrets or Variables.',
      'Approve any public publishing item by item.',
      'Approve any final narration, TTS, affiliate, product, purchase, or ad-spend decision.',
    ],
  };
}

function buildMarkdown(state) {
  const brandRows = state.brands
    .map(
      (brand) =>
        `| ${brand.name} | ${brand.currentState.queueItems} | ${brand.currentState.readyForReview} | ${brand.currentState.publicPublishingAllowed ? 'yes' : 'no'} |`,
    )
    .join('\n');

  const queueRows = state.contentQueue
    .map((item) => `| ${item.brand} | ${item.contentId} | ${item.status} | ${item.publishAllowed ? 'yes' : 'no'} | ${item.nextAction} |`)
    .join('\n');

  return `# Dax Business State

Generated: ${state.generatedAt}

This is a non-secret shared operating state for Codex, Claude, ChatGPT, and future agents. It is generated from repository files and local artifacts, not from private credential values.

## Permissions

- Read: ${state.permissions.permissions?.read?.status || 'unknown'}
- Draft: ${state.permissions.permissions?.draft?.status || 'unknown'}
- Workflow edit: ${state.permissions.permissions?.workflow_edit?.status || 'unknown'}
- Public publish: ${state.permissions.permissions?.public_publish?.status || 'approval_required'}
- Purchase/ad spend/credential changes: Daniel approval required

## Brands

| Brand | Queue Items | Ready For Review | Public Publishing Allowed |
| --- | ---: | ---: | --- |
${brandRows}

## Content Queue

| Brand | Content ID | Status | Publish Allowed | Next Action |
| --- | --- | --- | --- | --- |
${queueRows}

## Workflow Health

- Templates inventoried: ${state.workflowHealth.templateCount}
- Active templates in repo export: ${state.workflowHealth.activeTemplatesInExport}
- n8n runtime credentials: ${state.credentialHealth.n8nRuntimeCredentials}
- Firebase PR preview service account: ${state.credentialHealth.firebaseHostingServiceAccount}
- Firebase browser config: ${state.credentialHealth.firebaseClientConfig}

## Revenue Readiness

- Status: ${state.revenueReadiness?.status || 'not generated'}
- Verified revenue: $${state.revenueReadiness?.verifiedRevenueUsd || 0}
- Verified profit: $${state.revenueReadiness?.verifiedProfitUsd || 0}
- Public publishing allowed: ${state.revenueReadiness?.publicPublishingAllowed ? 'yes' : 'no'}
- Purchase/enrollment allowed: ${state.revenueReadiness?.purchaseOrEnrollmentAllowed ? 'yes' : 'no'}

## Tool Access

- Build state: \`npm run business-state:build\`
- Build revenue readiness: \`npm run revenue:readiness\`
- Query brands: \`npm run business-state:query -- list-brands\`
- Query queue: \`npm run business-state:query -- content-queue\`
- Query workflow health: \`npm run business-state:query -- workflow-health\`
- Query credential health: \`npm run business-state:query -- credential-health\`

## Hard Rule

This state layer does not grant permission to publish, purchase, delete, spend, or change credentials. Those actions still require Daniel approval.
`;
}
