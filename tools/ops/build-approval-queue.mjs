#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const now = new Date().toISOString();
const outDir = path.join(root, 'artifacts', 'approval-queue');
const statePath = path.join(root, 'artifacts', 'business-state', 'current-state.json');

if (!fs.existsSync(statePath)) {
  throw new Error('Missing artifacts/business-state/current-state.json. Run npm run business-state:build first.');
}

fs.mkdirSync(outDir, { recursive: true });

const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
const queueItems = Array.isArray(state.contentQueue) ? state.contentQueue : [];

const approvalQueue = {
  generatedAt: now,
  sourceStateGeneratedAt: state.generatedAt || null,
  status: 'READY_ITEMS_REQUIRE_HUMAN_APPROVAL',
  publicPublishingAllowed: false,
  purchaseOrSpendAllowed: false,
  credentialChangesAllowed: false,
  rule: 'This queue prepares review decisions only. It does not publish, spend, change credentials, enable checkout, or create products.',
  items: queueItems.map(buildApprovalItem),
};

writeJson(path.join(outDir, 'current-approval-queue.json'), approvalQueue);
fs.writeFileSync(path.join(root, 'APPROVAL_QUEUE.md'), buildMarkdown(approvalQueue));

console.log(
  JSON.stringify(
    {
      ok: true,
      output: 'artifacts/approval-queue/current-approval-queue.json',
      markdown: 'APPROVAL_QUEUE.md',
      items: approvalQueue.items.length,
      publicPublishingAllowed: approvalQueue.publicPublishingAllowed,
      purchaseOrSpendAllowed: approvalQueue.purchaseOrSpendAllowed,
    },
    null,
    2,
  ),
);

function buildApprovalItem(item, index) {
  const review = reviewArtifactsFor(item);
  return {
    order: index + 1,
    brandId: item.brandId,
    brand: item.brand,
    contentId: item.contentId,
    title: item.title,
    status: item.status,
    publishAllowed: Boolean(item.publishAllowed),
    purchaseEnabled: Boolean(item.commerceArtifacts?.purchaseEnabled),
    owner: item.owner || 'Daniel',
    nextAction: item.nextAction,
    artifactPath: item.artifactPath,
    materialSeparation: item.materialSeparation,
    reviewArtifacts: review.artifacts,
    humanApprovalNeeded: review.humanApprovalNeeded,
    blockedActions: review.blockedActions,
  };
}

function reviewArtifactsFor(item) {
  const artifacts = [];
  const blockedActions = ['public publishing'];
  const humanApprovalNeeded = [];

  if (item.brandId === 'ani-dax') {
    artifacts.push(
      'artifacts/anidax/sprint-1-sample/approval-package.md',
      'artifacts/anidax/sprint-1-sample/render/ani-dax-proof-render.mp4',
      'artifacts/anidax/sprint-1-sample/audio/draft-review-narration.wav',
      'artifacts/anidax/sprint-1-sample/generated/publish-ready-payload.json',
    );
    humanApprovalNeeded.push('script/canon posture', 'draft narration or replacement voice', 'visual style', 'platform/account target');
  } else if (item.brandId === 'gods-vessel') {
    artifacts.push(
      'artifacts/gods-vessel/names-of-god/commerce-readiness.md',
      'artifacts/gods-vessel/names-of-god/listings/approval-checklist.md',
      'artifacts/gods-vessel/names-of-god/listings/storefront-listings.json',
      'artifacts/gods-vessel/names-of-god/listings/shopify-draft-products.csv',
      'artifacts/gods-vessel/names-of-god/listings/printify-handoff.csv',
    );
    humanApprovalNeeded.push('theology', 'final Canva artwork masters', 'product copy', 'vendor/storefront setup', 'pricing/tax/shipping');
    blockedActions.push('product publication', 'checkout enablement', 'paid order');
  } else if (item.brandId === 'time-zone-travelers') {
    artifacts.push(
      'artifacts/timezone-travelers/sprint-3-sample/approval-package.md',
      'artifacts/timezone-travelers/sprint-3-sample/render/timezone-proof-render.mp4',
      'artifacts/timezone-travelers/sprint-3-sample/generated/publish-ready-payload.json',
      'artifacts/timezone-travelers/sprint-3-sample/generated/monetization-path.json',
    );
    humanApprovalNeeded.push('final source check', 'script/angle', 'narration', 'account target', 'approved links');
    blockedActions.push('affiliate enrollment', 'monetized link insertion');
  } else if (item.brandId === 'dax-the-traveler') {
    artifacts.push(
      'artifacts/dax-the-traveler/sprint-4-support/approval-package.md',
      'artifacts/dax-the-traveler/sprint-4-support/render/dax-traveler-proof-render.mp4',
      'artifacts/dax-the-traveler/sprint-4-support/generated/content-inventory.json',
      'artifacts/dax-the-traveler/sprint-4-support/generated/content-queue.json',
    );
    humanApprovalNeeded.push('source material/angle', 'Daniel narration or approved voice', 'account target', 'personal-brand monetized CTA');
    blockedActions.push('voice replacement', 'fabricated experience', 'public publishing');
  } else {
    humanApprovalNeeded.push('Daniel review');
  }

  return { artifacts, humanApprovalNeeded, blockedActions: [...new Set(blockedActions)] };
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function buildMarkdown(queue) {
  const rows = queue.items
    .map(
      (item) =>
        `| ${item.order} | ${item.brand} | ${item.title} | ${item.status} | ${item.publishAllowed ? 'yes' : 'no'} | ${item.purchaseEnabled ? 'yes' : 'no'} | ${item.owner} | ${item.nextAction} |`,
    )
    .join('\n');

  const details = queue.items
    .map(
      (item) => `## ${item.order}. ${item.brand}: ${item.title}

Content ID: \`${item.contentId}\`

Status: ${item.status}

Publish allowed: ${item.publishAllowed ? 'yes' : 'no'}

Purchase enabled: ${item.purchaseEnabled ? 'yes' : 'no'}

Human approval needed:
${item.humanApprovalNeeded.map((approval) => `- ${approval}`).join('\n')}

Blocked actions:
${item.blockedActions.map((action) => `- ${action}`).join('\n')}

Review artifacts:
${item.reviewArtifacts.map((artifact) => `- \`${artifact}\``).join('\n')}
`,
    )
    .join('\n');

  return `# Dax Collective Approval Queue

Generated: ${queue.generatedAt}

Source business state: ${queue.sourceStateGeneratedAt || 'unknown'}

${queue.rule}

Public publishing allowed: ${queue.publicPublishingAllowed ? 'yes' : 'no'}

Purchase/spend allowed: ${queue.purchaseOrSpendAllowed ? 'yes' : 'no'}

Credential changes allowed: ${queue.credentialChangesAllowed ? 'yes' : 'no'}

## Queue

| # | Brand | Item | Status | Publish Allowed | Purchase Enabled | Owner | Next Action |
| ---: | --- | --- | --- | --- | --- | --- | --- |
${rows}

${details}
`;
}
