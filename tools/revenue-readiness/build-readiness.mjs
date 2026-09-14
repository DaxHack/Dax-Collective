#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const now = new Date().toISOString();
const outDir = path.join(root, 'artifacts', 'revenue-readiness');
fs.mkdirSync(outDir, { recursive: true });

const aniDaxPackage = readJson('artifacts/anidax/sprint-1-sample/generated/content-package.json');
const godsCollection = readJson('artifacts/gods-vessel/names-of-god/collection.json');
const timeZoneCost = readJson('artifacts/timezone-travelers/sprint-3-sample/generated/cost-record.json');
const timeZoneMonetization = readJson('artifacts/timezone-travelers/sprint-3-sample/generated/monetization-path.json');
const daxCost = readJson('artifacts/dax-the-traveler/sprint-4-support/generated/cost-record.json');
const daxRevenue = readJson('artifacts/dax-the-traveler/sprint-4-support/generated/revenue-tracking-record.json');

const godsSummary = summarizeGodsVesselProducts(godsCollection?.products || []);

const readiness = {
  generatedAt: now,
  status: 'REVENUE_READY_FOR_APPROVAL_NOT_EARNING',
  verifiedRevenueUsd: 0,
  verifiedCostUsd: 0,
  verifiedProfitUsd: 0,
  adSpendUsd: 0,
  publicPublishingAllowed: false,
  purchaseOrEnrollmentAllowed: false,
  brands: [
    {
      brand: 'Ani-Dax',
      content: 'AI-assisted anime analysis/interview Shorts and later long-form commentary.',
      audience: 'Anime viewers who want character-driven analysis, lore framing, and theories without clip-rip spam.',
      offer: 'Near term: subscription/community CTA after approval. Later: original merchandise, memberships, sponsorships, YouTube monetization when eligible.',
      cta: 'Comment/subscribe CTA only until Daniel approves a specific monetized offer.',
      clickOrLead: 'Track YouTube/video description clicks and site clicks with UTM fields after public approval.',
      conversion: 'No conversion path is live. Future conversions depend on approved merch/membership/sponsor/product links.',
      revenue: 0,
      cost: sumCost(aniDaxPackage?.costEstimate?.localProofRunUsd),
      profit: 0,
      currentStatus: aniDaxPackage?.concept?.productionStatus || 'READY_FOR_APPROVAL_PACKAGE',
      blockers: [
        'Daniel content approval',
        'Approved narration/final visual style',
        'Verified platform account mapping',
        'Approved monetized link or offer',
      ],
      nextAutonomousAction: 'Prepare UTM/link schema for approved Ani-Dax public descriptions without inserting monetized links.',
    },
    {
      brand: "God's Vessel",
      content: 'Faith content leading to the Names of God dictionary-style apparel collection.',
      audience: 'Faith-based apparel buyers who want wearable, scripture-rooted design.',
      offer: 'Five draft Names of God apparel products pending Daniel theology/design/vendor/storefront approval.',
      cta: 'Interest CTA only until Printify/Shopify purchase path is approved and configured.',
      clickOrLead: "Direct gtag interest click event on the God's Vessel page.",
      conversion: 'Blocked until storefront, checkout, tax/shipping, vendor, and launch approval are complete.',
      revenue: 0,
      cost: 0,
      profit: 0,
      productEconomics: godsSummary,
      currentStatus: godsCollection?.status || 'READY_FOR_DANIEL_REVIEW_AND_VENDOR_SETUP',
      blockers: [
        'Daniel theology and design approval',
        'Printify/Shopify login/OAuth/payment/tax/shipping setup',
        'Approved product listings and public launch timing',
      ],
      nextAutonomousAction: 'Do not duplicate Canva design work; prepare listing/tracking fields around the approved collection once Daniel/Claude provide final assets.',
    },
    {
      brand: 'Time-Zone Travelers',
      content: 'Source-backed destination comparison and decision-guide media.',
      audience: 'Travel planners who want distinctive, practical comparison rather than generic destination lists.',
      offer: 'Near term: official-source trust links and future approved travel affiliate/product/guide paths.',
      cta: 'Save/share/subscribe CTA and official source links only until Daniel approves monetized links.',
      clickOrLead: 'UTM-tagged official-source links already exist in the sample package.',
      conversion: 'No affiliate enrollment or paid guide path is live; conversions are future/blocked.',
      revenue: 0,
      cost: sumCost(timeZoneCost?.localProofRunUsd),
      profit: 0,
      currentStatus: timeZoneMonetization?.status || 'AFFILIATE_READY_TRACKING_ONLY',
      trackedLinks: timeZoneMonetization?.trackedLinks || [],
      blockers: [
        'Daniel content/narration approval',
        'Final source check for time-sensitive claims',
        'Approved affiliate/program enrollment before monetized links',
      ],
      nextAutonomousAction: 'Reuse the existing UTM pattern for future official-source or approved affiliate links.',
    },
    {
      brand: 'Dax the Traveler',
      content: 'Repurposed Daniel travel material with AI-assisted support only.',
      audience: 'Existing Dax the Traveler viewers and travel followers who trust Daniel as the face/voice.',
      offer: 'Near term: traffic back to Daniel channels. Later: approved gear/activity affiliates, sponsorships, guides.',
      cta: 'Profile/channel CTA only until Daniel approves monetized links or public publishing.',
      clickOrLead: 'UTM-tagged YouTube and Instagram profile links exist in the support package.',
      conversion: 'No monetized conversion path is live; personal-brand approval remains required.',
      revenue: 0,
      cost: sumCost(daxCost?.localProofRunUsd),
      profit: 0,
      currentStatus: daxRevenue?.status || 'TRACKING_READY_NO_ACTIVE_MONETIZED_LINKS',
      trackedLinks: daxRevenue?.links || [],
      blockers: [
        'Daniel asset/angle approval',
        'Daniel narration or approved narrator',
        'Verified platform account mapping',
        'Approved affiliate/sponsor/product CTA',
      ],
      nextAutonomousAction: 'Inventory more approved Daniel footage/analytics when available; do not fabricate experiences.',
    },
  ],
  firstDollarSequence: [
    {
      rank: 1,
      path: "God's Vessel approved apparel launch",
      why: 'Closest direct offer once theology/design/vendor/storefront approvals are complete.',
      blockedByDaniel: true,
    },
    {
      rank: 2,
      path: 'Dax the Traveler approved support content to channel/profile CTA',
      why: 'Uses an existing personal brand without inventing experiences; monetization comes later after approved links.',
      blockedByDaniel: true,
    },
    {
      rank: 3,
      path: 'Time-Zone Travelers official-source trust content then approved travel affiliates/guides',
      why: 'Clear link attribution exists, but affiliate enrollment and offer approval are not done.',
      blockedByDaniel: true,
    },
    {
      rank: 4,
      path: 'Ani-Dax audience building, then merch/membership/sponsors',
      why: 'Needs consistent content proof and channel eligibility before meaningful revenue.',
      blockedByDaniel: true,
    },
  ],
  measurementSchema: {
    requiredFields: [
      'brand',
      'contentId',
      'offerId',
      'ctaType',
      'destinationUrl',
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'clicks',
      'leads',
      'conversions',
      'grossRevenueUsd',
      'feesUsd',
      'productionCostUsd',
      'adSpendUsd',
      'profitUsd',
      'approvalStatus',
    ],
    rule: 'Record zero until provider/store/platform data verifies a nonzero value.',
  },
};

writeJson('artifacts/revenue-readiness/current-revenue-readiness.json', readiness);
fs.writeFileSync(path.join(root, 'REVENUE_READINESS.md'), buildMarkdown(readiness));

console.log(JSON.stringify({
  ok: true,
  output: 'artifacts/revenue-readiness/current-revenue-readiness.json',
  brands: readiness.brands.length,
  verifiedRevenueUsd: readiness.verifiedRevenueUsd,
  verifiedProfitUsd: readiness.verifiedProfitUsd,
}, null, 2));

function readJson(relPath) {
  const fullPath = path.join(root, relPath);
  if (!fs.existsSync(fullPath)) return null;
  return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

function writeJson(relPath, value) {
  const fullPath = path.join(root, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, `${JSON.stringify(value, null, 2)}\n`);
}

function sumCost(cost = {}) {
  return Object.entries(cost)
    .filter(([, value]) => typeof value === 'number')
    .reduce((sum, [, value]) => sum + value, 0);
}

function summarizeGodsVesselProducts(products) {
  if (!products.length) {
    return {
      productCount: 0,
      verifiedLiveProducts: 0,
      averageTargetPriceUsd: 0,
      averageEstimatedBaseCostUsd: 0,
      averageEstimatedMarginUsd: 0,
      note: 'No product metadata found.',
    };
  }

  const totalPrice = products.reduce((sum, product) => sum + Number(product.targetPriceUsd || 0), 0);
  const totalBase = products.reduce((sum, product) => sum + Number(product.estimatedBaseCostUsd || 0), 0);
  const totalMargin = products.reduce((sum, product) => sum + Number(product.estimatedMarginUsd || 0), 0);

  return {
    productCount: products.length,
    verifiedLiveProducts: 0,
    averageTargetPriceUsd: round(totalPrice / products.length),
    averageEstimatedBaseCostUsd: round(totalBase / products.length),
    averageEstimatedMarginUsd: round(totalMargin / products.length),
    note: 'Planning economics only. Vendor costs, shipping, taxes, platform fees, and checkout are not verified live.',
  };
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function buildMarkdown(state) {
  const rows = state.brands
    .map((brand) => `| ${brand.brand} | ${brand.content} | ${brand.offer} | ${brand.cta} | ${brand.revenue} | ${brand.cost} | ${brand.profit} | ${brand.currentStatus} |`)
    .join('\n');

  const sequence = state.firstDollarSequence
    .map((item) => `${item.rank}. ${item.path}: ${item.why}`)
    .join('\n');

  return `# Revenue Readiness

Generated: ${state.generatedAt}

Verified revenue: $${state.verifiedRevenueUsd}
Verified cost: $${state.verifiedCostUsd}
Verified profit: $${state.verifiedProfitUsd}
Ad spend: $${state.adSpendUsd}

No public publishing, purchase, affiliate enrollment, sponsorship claim, or paid action is authorized by this file.

## Brand Paths

| Brand | Content | Offer | CTA | Revenue | Cost | Profit | Status |
| --- | --- | --- | --- | ---: | ---: | ---: | --- |
${rows}

## First-Dollar Sequence

${sequence}

## Measurement Schema

Required fields:

${state.measurementSchema.requiredFields.map((field) => `- ${field}`).join('\n')}

Rule: ${state.measurementSchema.rule}
`;
}
