import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BLOG_POSTS, BLOG_CATEGORIES, BRAND_MAP } from '../data/blogData';
import { CalendarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const ALL = 'All';

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [activeBrand, setActiveBrand] = useState(ALL);

  const filtered = BLOG_POSTS.filter((p) => {
    const catMatch = activeCategory === ALL || p.category === activeCategory;
    const brandMatch = activeBrand === ALL || p.brand === activeBrand;
    return catMatch && brandMatch;
  }).sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  // Nothing is listed until a post has been verified and published.
  const hasPosts = BLOG_POSTS.length > 0;

  const brandLabels = [ALL, ...Object.keys(BRAND_MAP).map((k) => BRAND_MAP[k].label)];

  const visibleCategories =
    activeBrand === ALL
      ? [ALL, ...BLOG_CATEGORIES]
      : [ALL, ...(BRAND_MAP[Object.keys(BRAND_MAP).find((k) => BRAND_MAP[k].label === activeBrand)]?.categories || [])];

  return (
    <>
      <Helmet>
        <title>Blog — Dax Collective</title>
        <meta
          name="description"
          content="Travel stories, anime analysis, faith content, and practical guides from all four Dax Collective brands."
        />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">
              The Blog
            </p>
            <h1 className="text-4xl font-bold text-white mb-4">
              {hasPosts ? 'All Posts' : 'Stories in the edit'}
            </h1>
            <p className="text-gray-400">
              Travel guides, anime analysis, faith content, and practical notes — all brands, one feed.
            </p>
          </div>

          {!hasPosts && (
            <div className="rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-900/70 to-black px-8 py-16 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400 mb-4">
                Coming soon
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                The first pieces are being finished.
              </h2>
              <p className="mx-auto max-w-xl text-gray-400 leading-relaxed">
                We publish a story only once it has been written, checked and approved. Travel
                dispatches, anime essays and notes from the God&rsquo;s Vessel archive will appear
                here as each one is ready.
              </p>
              <Link
                to="/brands"
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-gray-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-gray-500"
              >
                Explore the brands <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          )}

          {hasPosts && (
            <>
            <div className="mb-6">
              <p className="text-xs uppercase tracking-widest text-gray-600 mb-2">Brand</p>
              <div className="flex flex-wrap gap-2">
                {brandLabels.map((label) => (
                  <button
                    key={label}
                    onClick={() => { setActiveBrand(label); setActiveCategory(ALL); }}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      activeBrand === label
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-gray-600 mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                {visibleCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      activeCategory === cat
                        ? 'bg-gray-200 text-black'
                        : 'bg-gray-900 text-gray-500 hover:text-gray-300 border border-gray-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            </>
          )}
          {hasPosts && (filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-500">
              No posts match that filter.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {filtered.map((post) => {
                const brand = Object.keys(BRAND_MAP).find((k) => k === post.brand);
                const brandData = BRAND_MAP[brand] || {};
                const img = post.heroImage || post.heroFallback;

                return (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group block bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-2xl overflow-hidden transition-all"
                  >
                    {img && (
                      <div className="h-44 overflow-hidden">
                        <img
                          src={img}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            if (post.heroFallback && e.target.src !== post.heroFallback) {
                              e.target.src = post.heroFallback;
                            }
                          }}
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-semibold uppercase tracking-wider ${brandData.accent || 'text-blue-400'}`}>
                          {brandData.label || post.brand}
                        </span>
                        <span className="text-xs text-gray-600 flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <span className="inline-block text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded mb-3">
                        {post.category}
                      </span>
                      <h2 className="text-white font-bold text-lg leading-snug mb-2 group-hover:text-blue-300 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] text-gray-600 bg-gray-800/50 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 group-hover:text-white transition-colors">
                        Read <ArrowRightIcon className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BlogPage;
