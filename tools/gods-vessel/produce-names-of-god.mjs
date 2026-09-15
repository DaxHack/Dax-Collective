#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outRoot = path.join(root, 'artifacts', 'gods-vessel', 'names-of-god');
const designDir = path.join(outRoot, 'designs');
const mockupDir = path.join(outRoot, 'mockups');
const publicDir = path.join(root, 'dax-main', 'public', 'assets', 'gods-vessel', 'names-of-god');
const listingDir = path.join(outRoot, 'listings');

for (const dir of [outRoot, designDir, mockupDir, publicDir, listingDir]) {
  fs.mkdirSync(dir, { recursive: true });
}

const generatedAt = new Date().toISOString();
const collectionId = 'gods-vessel-names-of-god';
const collectionName = 'Names of God';
const approvalStatus = 'READY_FOR_DANIEL_REVIEW_AND_VENDOR_SETUP';
const artworkMasterStatus = 'PENDING_CLAUDE_CANVA_MASTER_EXPORT';
const publicListingStatus = 'DRAFT_NOT_PUBLISHED';
const storefrontStatus = 'BLOCKED_PENDING_DANIEL_VENDOR_STOREFRONT_APPROVAL';
const trackingBaseUrl = 'https://daxcollective.com/gods-vessel';

const products = [
  {
    slug: 'yhwh-i-am',
    name: 'YHWH',
    pronunciation: 'Yah-weh, commonly represented as LORD in English Bibles',
    definition: 'I AM; the covenant name of God.',
    scripture: 'Exodus 3:14-15',
    garment: 'Heavyweight black tee',
    ink: 'Bone white ink with muted violet accent',
    targetPriceUsd: 32,
    estimatedBaseCostUsd: 14,
  },
  {
    slug: 'elohim-creator',
    name: 'Elohim',
    pronunciation: 'El-oh-heem',
    definition: 'God, the Creator and sovereign one.',
    scripture: 'Genesis 1:1',
    garment: 'Washed charcoal tee',
    ink: 'Warm white ink',
    targetPriceUsd: 30,
    estimatedBaseCostUsd: 13,
  },
  {
    slug: 'adonai-lord',
    name: 'Adonai',
    pronunciation: 'Ah-doh-nai',
    definition: 'Lord and master; the one worthy of surrender.',
    scripture: 'Psalm 8:1',
    garment: 'Black hoodie',
    ink: 'Bone white ink with deep indigo accent',
    targetPriceUsd: 56,
    estimatedBaseCostUsd: 28,
  },
  {
    slug: 'el-shaddai-almighty',
    name: 'El Shaddai',
    pronunciation: 'El Shad-dai',
    definition: 'God Almighty; the all-sufficient one.',
    scripture: 'Genesis 17:1',
    garment: 'Oversized cream tee',
    ink: 'Black ink with violet accent',
    targetPriceUsd: 34,
    estimatedBaseCostUsd: 15,
  },
  {
    slug: 'jireh-provider',
    name: 'YHWH Yireh',
    pronunciation: 'Yah-weh Yee-reh; often rendered Jehovah Jireh',
    definition: 'The LORD will provide.',
    scripture: 'Genesis 22:14',
    garment: 'Vintage black crewneck',
    ink: 'Bone white ink',
    targetPriceUsd: 52,
    estimatedBaseCostUsd: 25,
  },
].map((product, index) => {
  const estimatedMarginUsd = Number((product.targetPriceUsd - product.estimatedBaseCostUsd).toFixed(2));
  const estimatedMarginPct = Number(((estimatedMarginUsd / product.targetPriceUsd) * 100).toFixed(1));
  const offerId = `${collectionId}-${product.slug}`;

  return {
    ...product,
    sku: `GV-NOG-${String(index + 1).padStart(2, '0')}`,
    offerId,
    listingTitle: `God's Vessel ${product.name} ${product.garment}`,
    productDescription:
      `${product.name} from the ${collectionName} collection. Dictionary-style faith apparel featuring "${product.definition}" with reference to ${product.scripture}. Draft listing copy requires Daniel theology, design, vendor, and storefront approval before publication.`,
    tags: ['faith apparel', 'names of god', 'christian streetwear', 'dictionary style', product.name.toLowerCase()],
    artworkMasterStatus,
    artworkDraftPath: `artifacts/gods-vessel/names-of-god/designs/${product.slug}.svg`,
    canvaProductionMasterPath: `pending/canva/gods-vessel/names-of-god/${product.slug}`,
    publicListingStatus,
    purchaseEnabled: false,
    publishAllowed: false,
    trackingUrl: `${trackingBaseUrl}?utm_source=dax_collective&utm_medium=site&utm_campaign=names_of_god_launch&utm_content=${product.slug}`,
    estimatedMarginUsd,
    estimatedMarginPct,
  };
});

function svgForProduct(product) {
  const accent = product.slug.includes('el-shaddai') ? '#1f1f28' : '#B9A8FF';
  const primary = product.slug.includes('el-shaddai') ? '#111111' : '#F6F1E8';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="4500" height="5400" viewBox="0 0 4500 5400">
  <rect width="4500" height="5400" fill="none"/>
  <g font-family="Arial, Helvetica, sans-serif" text-anchor="middle">
    <text x="2250" y="1120" fill="${accent}" font-size="132" letter-spacing="18" font-weight="700">NAMES OF GOD</text>
    <line x1="1080" y1="1320" x2="3420" y2="1320" stroke="${primary}" stroke-width="18"/>
    <text x="2250" y="2130" fill="${primary}" font-size="520" font-weight="900" letter-spacing="12">${escapeXml(product.name)}</text>
    <text x="2250" y="2480" fill="${accent}" font-size="112" letter-spacing="10">${escapeXml(product.pronunciation.toUpperCase())}</text>
    <foreignObject x="850" y="2780" width="2800" height="760">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Arial, Helvetica, sans-serif; color: ${primary}; text-align: center; font-size: 168px; line-height: 1.18; font-weight: 700;">
        ${escapeXml(product.definition)}
      </div>
    </foreignObject>
    <line x1="1420" y1="3770" x2="3080" y2="3770" stroke="${primary}" stroke-width="10"/>
    <text x="2250" y="4150" fill="${primary}" font-size="150" font-weight="800" letter-spacing="8">${escapeXml(product.scripture.toUpperCase())}</text>
    <text x="2250" y="4540" fill="${accent}" font-size="84" letter-spacing="16">GOD'S VESSEL</text>
  </g>
</svg>
`;
}

function mockupSvg(products) {
  const cards = products
    .map((product, index) => {
      const x = 90 + index * 345;
      return `
      <g transform="translate(${x}, 220)">
        <rect x="0" y="0" width="290" height="390" rx="28" fill="#111827" stroke="#312E81"/>
        <path d="M70 90 L110 50 H180 L220 90 L198 132 V330 H92 V132 Z" fill="#050505" stroke="#6D5BD0" stroke-width="4"/>
        <text x="145" y="188" text-anchor="middle" fill="#F6F1E8" font-family="Arial" font-size="34" font-weight="900">${escapeXml(product.name)}</text>
        <text x="145" y="236" text-anchor="middle" fill="#B9A8FF" font-family="Arial" font-size="18">${escapeXml(product.scripture)}</text>
        <text x="145" y="430" text-anchor="middle" fill="#E5E7EB" font-family="Arial" font-size="24">${escapeXml(product.garment)}</text>
      </g>`;
    })
    .join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <rect width="1920" height="1080" fill="#060610"/>
  <text x="90" y="110" fill="#F6F1E8" font-family="Arial" font-size="58" font-weight="900">GOD'S VESSEL - NAMES OF GOD</text>
  <text x="92" y="158" fill="#B9A8FF" font-family="Arial" font-size="28">First collection mockup board - draft for vendor setup, not a live storefront.</text>
  ${cards}
  <text x="90" y="940" fill="#9CA3AF" font-family="Arial" font-size="26">Status: print-ready SVG drafts plus metadata. Requires Daniel approval and Printify/Shopify setup before sale.</text>
</svg>
`;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function csvCell(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function writeCsv(file, rows) {
  fs.writeFileSync(file, `${rows.map((row) => row.map(csvCell).join(',')).join('\n')}\n`);
}

for (const product of products) {
  const svg = svgForProduct(product);
  fs.writeFileSync(path.join(designDir, `${product.slug}.svg`), svg);
  fs.writeFileSync(path.join(publicDir, `${product.slug}.svg`), svg);
}

fs.writeFileSync(path.join(mockupDir, 'collection-board.svg'), mockupSvg(products));
fs.writeFileSync(path.join(publicDir, 'collection-board.svg'), mockupSvg(products));

const collection = {
  generatedAt,
  collectionId,
  collectionName,
  status: approvalStatus,
  collection: collectionName,
  brand: "God's Vessel",
  publicPublishingAllowed: false,
  purchaseEnabled: false,
  storefrontStatus,
  artworkMasterStatus,
  products,
  theologyNotes: [
    'Pronunciations are approximations; final public copy should keep this clear.',
    'YHWH is commonly rendered LORD in English Bibles.',
    'Definitions are concise apparel copy, not exhaustive theological statements.',
    'Final product listings should be reviewed by Daniel before publishing.',
  ],
  commercePath: {
    content: 'Faith content and Names of God collection launch posts',
    cta: 'Interest/setup CTA until storefront is configured',
    product: 'Five draft apparel offers with listing metadata and pricing estimates',
    purchase: 'Blocked until Printify/Shopify setup and Daniel approval',
    conversionTracking: 'gtag interest click event on God\'s Vessel page',
    revenueTracking: 'Product metadata and listing ledger include target price, estimated base cost, margin, and zeroed revenue fields',
  },
  listingPackage: {
    storefrontListingsJson: 'artifacts/gods-vessel/names-of-god/listings/storefront-listings.json',
    shopifyDraftCsv: 'artifacts/gods-vessel/names-of-god/listings/shopify-draft-products.csv',
    printifyHandoffCsv: 'artifacts/gods-vessel/names-of-god/listings/printify-handoff.csv',
    salesTrackingLedgerCsv: 'artifacts/gods-vessel/names-of-god/listings/sales-tracking-ledger.csv',
    approvalChecklist: 'artifacts/gods-vessel/names-of-god/listings/approval-checklist.md',
  },
  pendingApprovals: {
    daniel: [
      'Approve theology and scripture posture.',
      'Approve or revise final product titles and descriptions.',
      'Approve final Canva production artwork exports from Claude.',
      'Approve garment/vendor choices, pricing, taxes, shipping, and launch timing.',
    ],
    providerSetup: [
      'Printify login/OAuth/MFA and product creation.',
      'Shopify/storefront login/OAuth/MFA, checkout, payment, tax, and shipping settings.',
      'Final order test only after Daniel approval; no paid order was placed here.',
    ],
  },
};

fs.writeFileSync(path.join(outRoot, 'collection.json'), `${JSON.stringify(collection, null, 2)}\n`);

const csvRows = [
  [
    'slug',
    'sku',
    'offer_id',
    'name',
    'listing_title',
    'pronunciation',
    'definition',
    'scripture',
    'garment',
    'ink',
    'target_price_usd',
    'estimated_base_cost_usd',
    'estimated_margin_usd',
    'estimated_margin_pct',
    'artwork_master_status',
    'public_listing_status',
    'purchase_enabled',
    'tracking_url',
  ],
  ...products.map((product) => [
    product.slug,
    product.sku,
    product.offerId,
    product.name,
    product.listingTitle,
    product.pronunciation,
    product.definition,
    product.scripture,
    product.garment,
    product.ink,
    product.targetPriceUsd,
    product.estimatedBaseCostUsd,
    product.estimatedMarginUsd,
    product.estimatedMarginPct,
    product.artworkMasterStatus,
    product.publicListingStatus,
    product.purchaseEnabled,
    product.trackingUrl,
  ]),
];
writeCsv(path.join(outRoot, 'product-metadata.csv'), csvRows);

const storefrontListings = {
  generatedAt,
  collectionId,
  brand: "God's Vessel",
  status: 'LISTINGS_PREPARED_NOT_PUBLISHED',
  publicPublishingAllowed: false,
  purchaseEnabled: false,
  noPaidActionTaken: true,
  note: 'Prepared around existing draft collection data. Replace draft SVG references with Claude/Canva production masters before vendor publication.',
  listings: products.map((product) => ({
    offerId: product.offerId,
    sku: product.sku,
    slug: product.slug,
    title: product.listingTitle,
    description: product.productDescription,
    tags: product.tags,
    targetPriceUsd: product.targetPriceUsd,
    estimatedBaseCostUsd: product.estimatedBaseCostUsd,
    estimatedGrossMarginUsd: product.estimatedMarginUsd,
    estimatedGrossMarginPct: product.estimatedMarginPct,
    artworkDraftPath: product.artworkDraftPath,
    canvaProductionMasterPath: product.canvaProductionMasterPath,
    artworkMasterStatus: product.artworkMasterStatus,
    publicListingStatus: product.publicListingStatus,
    purchaseEnabled: product.purchaseEnabled,
    publishAllowed: product.publishAllowed,
    trackingUrl: product.trackingUrl,
    requiredBeforePublish: [
      'Daniel theology approval',
      'Daniel product copy approval',
      'Claude/Canva production master export attached',
      'Printify product configured',
      'Shopify/storefront checkout configured',
      'Test order/payment/tax/shipping approved by Daniel',
    ],
  })),
};

fs.writeFileSync(path.join(listingDir, 'storefront-listings.json'), `${JSON.stringify(storefrontListings, null, 2)}\n`);

writeCsv(path.join(listingDir, 'shopify-draft-products.csv'), [
  [
    'Handle',
    'Title',
    'Body (HTML)',
    'Vendor',
    'Product Category',
    'Type',
    'Tags',
    'Published',
    'Option1 Name',
    'Option1 Value',
    'Variant SKU',
    'Variant Price',
    'Variant Inventory Policy',
    'Variant Fulfillment Service',
    'Variant Requires Shipping',
    'Variant Taxable',
    'Image Src',
    'Image Alt Text',
    'SEO Title',
    'SEO Description',
    'Status',
  ],
  ...products.map((product) => [
    product.slug,
    product.listingTitle,
    `<p>${product.productDescription}</p><p><strong>Scripture:</strong> ${product.scripture}</p><p>Status: Draft only. Final artwork, vendor setup, and checkout require approval.</p>`,
    "God's Vessel",
    'Apparel & Accessories > Clothing',
    product.garment,
    product.tags.join(', '),
    'FALSE',
    'Garment',
    product.garment,
    product.sku,
    product.targetPriceUsd,
    'deny',
    'manual',
    'TRUE',
    'TRUE',
    '',
    `${product.name} ${collectionName} apparel draft`,
    product.listingTitle,
    product.productDescription,
    'draft',
  ]),
]);

writeCsv(path.join(listingDir, 'printify-handoff.csv'), [
  [
    'offer_id',
    'sku',
    'title',
    'garment',
    'target_price_usd',
    'estimated_base_cost_usd',
    'artwork_draft_path',
    'canva_production_master_path',
    'artwork_master_status',
    'print_provider_status',
    'publish_allowed',
  ],
  ...products.map((product) => [
    product.offerId,
    product.sku,
    product.listingTitle,
    product.garment,
    product.targetPriceUsd,
    product.estimatedBaseCostUsd,
    product.artworkDraftPath,
    product.canvaProductionMasterPath,
    product.artworkMasterStatus,
    'NOT_CONFIGURED_NO_PRINTIFY_ACTION_TAKEN',
    product.publishAllowed,
  ]),
]);

writeCsv(path.join(listingDir, 'sales-tracking-ledger.csv'), [
  [
    'generated_at',
    'brand',
    'collection_id',
    'offer_id',
    'sku',
    'slug',
    'target_price_usd',
    'estimated_base_cost_usd',
    'clicks',
    'leads',
    'orders',
    'gross_revenue_usd',
    'fees_usd',
    'ad_spend_usd',
    'production_cost_usd',
    'estimated_profit_usd',
    'public_listing_status',
    'purchase_enabled',
  ],
  ...products.map((product) => [
    generatedAt,
    "God's Vessel",
    collectionId,
    product.offerId,
    product.sku,
    product.slug,
    product.targetPriceUsd,
    product.estimatedBaseCostUsd,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    product.publicListingStatus,
    product.purchaseEnabled,
  ]),
]);

fs.writeFileSync(
  path.join(listingDir, 'approval-checklist.md'),
  `# God's Vessel Listing Approval Checklist

Generated: ${generatedAt}

Status: LISTINGS PREPARED, NOT PUBLISHED.

## Ready For Review

- Five draft product offers have listing titles, descriptions, SKU values, draft pricing, gross margin estimates, and tracking URLs.
- Shopify draft CSV, Printify handoff CSV, storefront listing JSON, and zeroed sales ledger are generated.
- No product was created in Printify or Shopify.
- No checkout, payment, tax, shipping, purchase, or paid order action was taken.
- Claude/Canva production artwork masters are still expected before vendor publication.

## Daniel Approval Required

${collection.pendingApprovals.daniel.map((item) => `- ${item}`).join('\n')}

## Provider Setup Required

${collection.pendingApprovals.providerSetup.map((item) => `- ${item}`).join('\n')}

## Launch Gate

Do not publish products or enable checkout until every item above is approved and a human-reviewed storefront test confirms pricing, shipping, taxes, product images, and fulfillment route.
`,
);

fs.writeFileSync(
  path.join(outRoot, 'theology-review.md'),
  `# Names of God Theology Review

Generated: ${generatedAt}

Status: READY FOR DANIEL REVIEW, not published.

## Verified Draft Items

${products
  .map(
    (product) => `- ${product.name}: ${product.definition} Reference: ${product.scripture}. Pronunciation note: ${product.pronunciation}.`,
  )
  .join('\n')}

## Review Rules

- Do not present pronunciations as certain where traditions differ.
- Do not imply the short apparel definition is a full doctrine.
- Do not use scripture references without final check in Daniel's preferred translation.
- Do not publish product listings until Daniel approves theology, design, vendor, and price.
`,
);

fs.writeFileSync(
  path.join(outRoot, 'commerce-readiness.md'),
  `# God's Vessel Commerce Readiness

Generated: ${generatedAt}

## Current State

- Five cohesive Names of God draft designs exist as SVG.
- Product metadata includes target pricing and estimated base costs.
- Storefront listing JSON, Shopify draft CSV, Printify handoff CSV, and a zeroed sales ledger are generated in \`listings/\`.
- Claude/Canva production artwork masters are still pending before vendor publication.
- No Printify product has been created in this session.
- No Shopify/storefront checkout has been configured in this session.
- No paid order or purchase action was taken.

## Purchase Path State

CONTENT -> CTA -> PRODUCT is partially working on the website as an interest/setup CTA.

PRODUCT -> PURCHASE is blocked until Daniel approves vendor setup and completes any required account/OAuth/payment actions.

CONVERSION TRACKING is implemented as a gtag interest click event in the God\'s Vessel page code.

REVENUE/MARGIN TRACKING is represented in product metadata and must be connected to real order data after storefront setup.

## Generated Handoff Files

- \`listings/storefront-listings.json\`: draft offer payload with publish/purchase flags set false.
- \`listings/shopify-draft-products.csv\`: draft import aid, not published products.
- \`listings/printify-handoff.csv\`: vendor setup aid; no Printify API action was taken.
- \`listings/sales-tracking-ledger.csv\`: zeroed clicks/leads/orders/revenue/profit tracking rows.
- \`listings/approval-checklist.md\`: Daniel/provider approval gate.
`,
);

console.log(
  JSON.stringify(
    {
      ok: true,
      output: path.relative(root, outRoot).replace(/\\/g, '/'),
      publicAssets: path.relative(root, publicDir).replace(/\\/g, '/'),
      listings: path.relative(root, listingDir).replace(/\\/g, '/'),
      products: products.length,
    },
    null,
    2,
  ),
);
