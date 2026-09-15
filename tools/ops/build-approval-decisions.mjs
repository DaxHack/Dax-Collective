#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const root = process.cwd();
const now = new Date().toISOString();
const queuePath = path.join(root, 'artifacts', 'approval-queue', 'current-approval-queue.json');
const decisionsPath = path.join(root, 'business-state', 'approval-decisions.json');

if (!fs.existsSync(queuePath)) {
  throw new Error('Missing artifacts/approval-queue/current-approval-queue.json. Run npm run approval:queue first.');
}

const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
const existing = fs.existsSync(decisionsPath)
  ? JSON.parse(fs.readFileSync(decisionsPath, 'utf8'))
  : { decisions: [] };
const existingById = new Map((existing.decisions || []).map((decision) => [decision.contentId, decision]));
const allowedStatuses = ['PENDING_DANIEL_REVIEW', 'APPROVED_FOR_PRIVATE_DRAFT_NEXT_STEP', 'REVISION_REQUESTED', 'BLOCKED_BY_DANIEL', 'REJECTED'];
if (existingById.size !== (existing.decisions || []).length) throw new Error('Duplicate decision content IDs');
if (new Set(queue.items.map((item) => item.contentId)).size !== queue.items.length) throw new Error('Duplicate queue content IDs');
for (const decision of existing.decisions || []) {
  if (!allowedStatuses.includes(decision.decisionStatus)) throw new Error(`Invalid decision status for ${decision.contentId}`);
}

const decisions = {
  generatedAt: now,
  sourceApprovalQueueGeneratedAt: queue.generatedAt || null,
  status: 'PENDING_HUMAN_DECISIONS',
  publicPublishingAllowed: false,
  purchaseOrSpendAllowed: false,
  credentialChangesAllowed: false,
  allowedDecisionStatuses: [
    'PENDING_DANIEL_REVIEW',
    'APPROVED_FOR_PRIVATE_DRAFT_NEXT_STEP',
    'REVISION_REQUESTED',
    'BLOCKED_BY_DANIEL',
    'REJECTED',
  ],
  rule: 'Daniel decisions may move work to the next private/draft step only. Public publishing, purchase/spend, checkout, credential changes, and legal commitments remain separately gated.',
  decisions: queue.items.map((item) => buildDecision(item, existingById.get(item.contentId))),
};

fs.mkdirSync(path.dirname(decisionsPath), { recursive: true });
fs.writeFileSync(decisionsPath, `${JSON.stringify(decisions, null, 2)}\n`);
fs.writeFileSync(path.join(root, 'APPROVAL_DECISIONS.md'), buildMarkdown(decisions));

console.log(
  JSON.stringify(
    {
      ok: true,
      output: 'business-state/approval-decisions.json',
      markdown: 'APPROVAL_DECISIONS.md',
      decisions: decisions.decisions.length,
      pending: decisions.decisions.filter((decision) => decision.decisionStatus === 'PENDING_DANIEL_REVIEW').length,
      publicPublishingAllowed: decisions.publicPublishingAllowed,
      purchaseOrSpendAllowed: decisions.purchaseOrSpendAllowed,
    },
    null,
    2,
  ),
);

function buildDecision(item, existingDecision) {
  const hash = createHash('sha256');
  hash.update(JSON.stringify({ brandId: item.brandId, contentId: item.contentId, title: item.title, status: item.status }));
  let artifactsPresent = true;
  for (const artifact of item.reviewArtifacts || []) {
    const file = path.resolve(root, artifact);
    const relative = path.relative(root, file);
    if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Review artifact must be inside repository');
    hash.update(artifact);
    if (fs.existsSync(file)) hash.update(fs.readFileSync(file));
    else { artifactsPresent = false; hash.update('MISSING'); }
  }
  const reviewFingerprint = hash.digest('hex');
  const changed = existingDecision?.reviewFingerprint !== reviewFingerprint;
  const preservedStatus = changed ? 'PENDING_DANIEL_REVIEW' : (existingDecision?.decisionStatus || 'PENDING_DANIEL_REVIEW');
  const evidenceComplete = existingDecision?.decisionOwner === 'Daniel'
    && Number.isFinite(Date.parse(existingDecision?.decisionRecordedAt))
    && Boolean(existingDecision?.approvedNextPrivateStep?.trim());
  return {
    brandId: item.brandId,
    brand: item.brand,
    contentId: item.contentId,
    title: item.title,
    itemStatus: item.status,
    reviewFingerprint,
    reviewArtifactsPresent: artifactsPresent,
    decisionInvalidatedByArtifactChange: Boolean(existingDecision && changed),
    decisionStatus: preservedStatus,
    decisionOwner: existingDecision?.decisionOwner || 'Daniel',
    decisionRecordedAt: existingDecision?.decisionRecordedAt || null,
    decisionNotes: existingDecision?.decisionNotes || '',
    requestedRevision: existingDecision?.requestedRevision || '',
    approvedNextPrivateStep: existingDecision?.approvedNextPrivateStep || '',
    canProceedToPrivateDraftNextStep: preservedStatus === 'APPROVED_FOR_PRIVATE_DRAFT_NEXT_STEP' && artifactsPresent && evidenceComplete,
    canPublishPublicly: false,
    canEnableCheckoutOrProductPublication: false,
    canSpendOrPurchase: false,
    canChangeCredentials: false,
    blockedActions: item.blockedActions || [],
    reviewArtifacts: item.reviewArtifacts || [],
  };
}

function buildMarkdown(decisions) {
  const rows = decisions.decisions
    .map(
      (decision) =>
        `| ${decision.brand} | ${decision.title} | ${decision.decisionStatus} | ${decision.canProceedToPrivateDraftNextStep ? 'yes' : 'no'} | ${decision.canPublishPublicly ? 'yes' : 'no'} | ${decision.canEnableCheckoutOrProductPublication ? 'yes' : 'no'} | ${decision.decisionOwner} |`,
    )
    .join('\n');

  const details = decisions.decisions
    .map(
      (decision) => `## ${decision.brand}: ${decision.title}

Content ID: \`${decision.contentId}\`

Decision status: ${decision.decisionStatus}

Decision owner: ${decision.decisionOwner}

Decision notes: ${decision.decisionNotes || 'none'}

Requested revision: ${decision.requestedRevision || 'none'}

Approved next private step: ${decision.approvedNextPrivateStep || 'none'}

Can proceed to private/draft next step: ${decision.canProceedToPrivateDraftNextStep ? 'yes' : 'no'}

Can publish publicly: ${decision.canPublishPublicly ? 'yes' : 'no'}

Can enable checkout/product publication: ${decision.canEnableCheckoutOrProductPublication ? 'yes' : 'no'}

Can spend/purchase: ${decision.canSpendOrPurchase ? 'yes' : 'no'}

Review artifacts:
${decision.reviewArtifacts.map((artifact) => `- \`${artifact}\``).join('\n')}
`,
    )
    .join('\n');

  return `# Dax Collective Approval Decisions

Generated: ${decisions.generatedAt}

Source approval queue: ${decisions.sourceApprovalQueueGeneratedAt || 'unknown'}

${decisions.rule}

Public publishing allowed: ${decisions.publicPublishingAllowed ? 'yes' : 'no'}

Purchase/spend allowed: ${decisions.purchaseOrSpendAllowed ? 'yes' : 'no'}

Credential changes allowed: ${decisions.credentialChangesAllowed ? 'yes' : 'no'}

## Decision Table

| Brand | Item | Decision | Private Next Step | Public Publish | Product/Checkout | Owner |
| --- | --- | --- | --- | --- | --- | --- |
${rows}

## Allowed Status Values

${decisions.allowedDecisionStatuses.map((status) => `- ${status}`).join('\n')}

${details}
`;
}
