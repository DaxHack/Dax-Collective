import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getPostBySlug, BRAND_MAP, BLOG_POSTS } from '../data/blogData';
import { CalendarIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-3">Post not found</h1>
          <p className="text-gray-400 mb-6">
            <code className="text-blue-400 text-sm">/{slug}</code> doesn't match any blog post.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-full transition-colors text-sm"
          >
            <ArrowLeftIcon className="h-4 w-4" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const brandKey = Object.keys(BRAND_MAP).find((k) => k === post.brand);
  const brandData = BRAND_MAP[brandKey] || {};
  const img = post.heroImage || post.heroFallback;

  const related = BLOG_POSTS.filter(
    (p) => p.brand === post.brand && p.slug !== post.slug
  ).slice(0, 2);

  const paragraphs = post.body.split('\n\n');

  return (
    <>
      <Helmet>
        <title>{post.title} — Dax Collective</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        {img && <meta property="og:image" content={img} />}
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        {img && (
          <div className="w-full h-72 sm:h-96 overflow-hidden">
            <img
              src={img}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                if (post.heroFallback && e.target.src !== post.heroFallback) {
                  e.target.src = post.heroFallback;
                }
              }}
            />
          </div>
        )}

        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="mb-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors mb-6"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" /> All Posts
            </Link>

            <div className="flex items-center gap-3 mb-3">
              <Link
                to={brandData.route || '/blog'}
                className={`text-xs font-semibold uppercase tracking-widest ${brandData.accent || 'text-blue-400'} hover:underline`}
              >
                {brandData.label || post.brand}
              </Link>
              <span className="text-gray-700">·</span>
              <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded">
                {post.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black leading-tight text-white mb-4">
              {post.title}
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-4">{post.excerpt}</p>

            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-3.5 w-3.5" />
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span key={tag} className="bg-gray-800 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="prose prose-invert prose-lg max-w-none mb-12">
            {paragraphs.map((para, i) => {
              if (para.startsWith('**') && para.endsWith('**') && !para.includes('\n')) {
                return (
                  <h3 key={i} className="text-white font-bold text-xl mt-8 mb-3">
                    {para.replace(/\*\*/g, '')}
                  </h3>
                );
              }
              const parts = para.split(/(\*\*[^*]+\*\*)/g);
              return (
                <p key={i} className="text-gray-300 leading-relaxed mb-5">
                  {parts.map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return (
                        <strong key={j} className="text-white font-bold">
                          {part.slice(2, -2)}
                        </strong>
                      );
                    }
                    if (part.startsWith('*') && part.endsWith('*')) {
                      return <em key={j}>{part.slice(1, -1)}</em>;
                    }
                    return part;
                  })}
                </p>
              );
            })}
          </div>

          {post.cta && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-10">
              <a
                href={post.cta.href}
                target={post.cta.href.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-full transition-colors ${brandData.bg || 'bg-blue-600'} hover:opacity-90 text-white`}
              >
                {post.cta.label} <ArrowRightIcon className="h-4 w-4" />
              </a>
            </div>
          )}

          {post.relatedResources && post.relatedResources.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-10">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
                Related Resources
              </h3>
              <ul className="space-y-2">
                {post.relatedResources.map((r, i) => (
                  <li key={i}>
                    <a
                      href={r.href}
                      className="text-sm text-blue-400 hover:underline flex items-center gap-1.5"
                    >
                      <ArrowRightIcon className="h-3 w-3" />
                      {r.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-gray-600">
                Some links may be affiliate links.{' '}
                <Link to="/disclosure" className="hover:text-gray-400">Read our disclosure.</Link>
              </p>
            </div>
          )}

          {related.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">More from {brandData.label}</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {related.map((rp) => (
                  <Link
                    key={rp.slug}
                    to={`/blog/${rp.slug}`}
                    className="group block bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-5 transition-all"
                  >
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded mb-2 inline-block">
                      {rp.category}
                    </span>
                    <h4 className="text-white font-semibold text-sm leading-snug group-hover:text-blue-300 transition-colors">
                      {rp.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;
