// src/pages/GodsVesselPage.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import BrandGallery from '../components/BrandGallery';
import GodsVesselQuotesSection from '../components/GodsVesselQuotes';
import {
  godsVesselInterestHref,
  namesOfGodCollection,
} from '../data/godsVesselNamesOfGod';
import { trackCustomEvent } from '../utils/analytics';

const faithContent = [
  {
    id: 1,
    title: 'Walking in Purpose',
    verse: 'Jeremiah 29:11',
    content:
      'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.',
    category: 'Purpose',
    status: 'Draft devotional seed',
  },
  {
    id: 2,
    title: 'Strength in Trials',
    verse: 'Romans 8:28',
    content:
      'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
    category: 'Encouragement',
    status: 'Draft devotional seed',
  },
  {
    id: 3,
    title: 'Faith Over Fear',
    verse: 'Isaiah 41:10',
    content:
      'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.',
    category: 'Courage',
    status: 'Draft devotional seed',
  },
];

const readinessItems = [
  {
    label: 'Content',
    state: 'Working draft',
    detail:
      'Faith content seeds and collection launch copy can be drafted without publishing.',
  },
  {
    label: 'CTA',
    state: 'Measurable',
    detail:
      'The collection interest link records a direct gtag event when Google Analytics is available.',
  },
  {
    label: 'Product',
    state: 'Draft ready',
    detail:
      'Five SVG apparel designs and product metadata exist for Daniel review and vendor setup.',
  },
  {
    label: 'Purchase',
    state: 'Blocked',
    detail:
      'No Printify product, Shopify checkout, or paid order is active from this session.',
  },
  {
    label: 'Revenue',
    state: 'Prepared',
    detail:
      'Target prices, estimated base costs, and margins are tracked in generated metadata.',
  },
  {
    label: 'Approval',
    state: 'Required',
    detail:
      'Daniel must approve theology, design, vendor, pricing, and any public launch.',
  },
];

const tabs = [
  { id: 'collection', label: 'Names of God' },
  { id: 'faith', label: 'Faith Content' },
  { id: 'readiness', label: 'Commerce Readiness' },
];

const GodsVesselPage = () => {
  const [activeSection, setActiveSection] = useState('collection');

  const trackInterest = (product) => {
    trackCustomEvent('gods_vessel_interest_click', {
      product_slug: product.slug,
      product_name: product.name,
      source: 'names_of_god_collection',
    });
  };

  return (
    <>
      <Helmet>
        <title>God&apos;s Vessel - Names of God Collection</title>
        <meta
          name="description"
          content="God's Vessel is preparing a faith-based Names of God apparel collection with draft designs, scripture references, and review-ready product metadata."
        />
        <meta property="og:title" content="God's Vessel - Names of God Collection" />
        <meta
          property="og:description"
          content="Draft faith apparel and content from The Dax Collective. Storefront setup and public launch require approval."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-black/40"></div>
          <div
            className="h-96 bg-cover bg-center bg-no-repeat flex items-center justify-center"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('/assets/gods-vessel/names-of-god/collection-board.svg')",
            }}
          >
            <div className="text-center max-w-4xl px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  GOD&apos;S VESSEL
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-6">
                  First collection in production: Names of God
                </p>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Modern faith-based apparel drafts with scripture references,
                  theology review notes, and vendor-ready metadata. No live
                  checkout is active yet.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2 mb-8 bg-gray-800/30 backdrop-blur-sm rounded-2xl sm:rounded-full p-2 border border-gray-700">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    activeSection === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeSection === 'collection' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="text-center max-w-3xl mx-auto">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Names of God Draft Collection
                  </h2>
                  <p className="text-gray-300">
                    Five cohesive dictionary-style concepts are ready for Daniel
                    review. These are not live products and cannot be purchased
                    from this site yet.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {namesOfGodCollection.map((item) => (
                    <div
                      key={item.slug}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300"
                    >
                      <img
                        src={item.image}
                        alt={`${item.name} apparel draft`}
                        className="w-full h-72 object-contain bg-black"
                      />

                      <div className="p-6">
                        <div className="flex justify-between items-start gap-4 mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-white">{item.name}</h3>
                            <p className="text-purple-300 text-sm mt-1">
                              {item.pronunciation}
                            </p>
                          </div>
                          <span className="shrink-0 bg-purple-600/30 text-purple-200 px-3 py-1 rounded-full text-xs font-semibold">
                            Draft
                          </span>
                        </div>

                        <p className="text-gray-300 mb-4 leading-relaxed">
                          {item.definition}
                        </p>

                        <div className="space-y-2 text-sm text-gray-300 mb-5">
                          <p>
                            <span className="text-purple-300 font-semibold">Scripture:</span>{' '}
                            {item.scripture}
                          </p>
                          <p>
                            <span className="text-purple-300 font-semibold">Garment:</span>{' '}
                            {item.garment}
                          </p>
                          <p>
                            <span className="text-purple-300 font-semibold">Draft price:</span>{' '}
                            {item.targetPrice}
                          </p>
                          <p className="text-gray-400">{item.marginNote}</p>
                        </div>

                        <a
                          href={godsVesselInterestHref}
                          onClick={() => trackInterest(item)}
                          className="block w-full text-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 rounded-lg font-semibold transition-all duration-300"
                        >
                          Request Setup Info
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSection === 'faith' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <GodsVesselQuotesSection maxQuotes={5} showTitle={true} />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {faithContent.map((content) => (
                    <div
                      key={content.id}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
                    >
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <span className="bg-purple-600/30 text-purple-300 px-3 py-1 rounded-full text-sm font-semibold">
                          {content.category}
                        </span>
                        <span className="text-gray-400 text-sm">{content.status}</span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2">{content.title}</h3>
                      <p className="text-purple-300 font-semibold mb-3">{content.verse}</p>
                      <p className="text-gray-300 leading-relaxed italic">
                        &quot;{content.content}&quot;
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSection === 'readiness' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="text-center max-w-3xl mx-auto">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Commerce Path State
                  </h2>
                  <p className="text-gray-300">
                    Current work supports content, CTA, product review, and
                    margin planning. Public sales still require vendor setup,
                    account approval, and Daniel&apos;s final launch decision.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {readinessItems.map((item) => (
                    <div
                      key={item.label}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
                    >
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <h3 className="text-xl font-bold text-white">{item.label}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.state === 'Blocked'
                              ? 'bg-red-600/30 text-red-200'
                              : item.state === 'Required'
                                ? 'bg-yellow-600/30 text-yellow-100'
                                : 'bg-green-600/30 text-green-100'
                          }`}
                        >
                          {item.state}
                        </span>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{item.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-3">
                    Current Business Path
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    CONTENT -&gt; CTA -&gt; PRODUCT is partially working as a
                    review and interest path. PRODUCT -&gt; PURCHASE -&gt;
                    REVENUE is prepared in metadata but blocked until Printify
                    and Shopify setup are verified and approved.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="text-3xl font-bold text-white mb-6 text-center"
            >
              God&apos;s Vessel Gallery
            </motion.h2>

            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
              <BrandGallery
                brand="gods-vessel"
                category="faith"
                maxImages={12}
                layout="grid"
                showControls={true}
                enableUpload={false}
                className="faith-gallery"
              />
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-black/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready for Daniel Review
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              The first collection now has draft designs, scripture references,
              commerce metadata, and a measurable interest path. Public selling
              is intentionally paused until approval and storefront setup.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">5</div>
                <div className="text-gray-400">Draft Designs</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">0</div>
                <div className="text-gray-400">Live Products</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">1</div>
                <div className="text-gray-400">Approval Gate</div>
              </div>
            </div>

            <a
              href={godsVesselInterestHref}
              onClick={() =>
                trackCustomEvent('gods_vessel_collection_review_click', {
                  source: 'gods_vessel_footer_cta',
                })
              }
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Request Collection Setup
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default GodsVesselPage;
