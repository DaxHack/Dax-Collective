import React from 'react';
import { Helmet } from 'react-helmet-async';

const DisclosurePage = () => {
  return (
    <>
      <Helmet>
        <title>Affiliate Disclosure — Dax Collective</title>
        <meta
          name="description"
          content="Affiliate and sponsorship disclosure for Dax Collective, Dax the Traveler, Time-Zone Travelers, AniDax, and God's Vessel."
        />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">
              Legal
            </p>
            <h1 className="text-4xl font-bold text-white mb-4">Affiliate Disclosure</h1>
            <p className="text-gray-400 text-sm">Last updated: January 1, 2025</p>
          </div>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">Who We Are</h2>
              <p>
                Dax Collective operates four content brands: Dax the Traveler, Time-Zone Travelers,
                AniDax, and God's Vessel. This disclosure applies to all content published across
                these brands and on DaxCollective.com, including blog posts, resource pages,
                product recommendations, and video descriptions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Affiliate Relationships</h2>
              <p className="mb-4">
                Some links on this site are affiliate links. This means that if you click a link
                and make a purchase, we may earn a small commission at no additional cost to you.
              </p>
              <p className="mb-4">
                Affiliate programs we participate in may include (but are not limited to):
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 pl-2">
                <li>Amazon Associates</li>
                <li>Travel booking affiliate programs (hotels, flights, activities)</li>
                <li>Gear and product affiliate programs</li>
                <li>Digital product and course platforms</li>
              </ul>
              <p className="mt-4">
                Affiliate links will be marked with a disclosure notice near the relevant content,
                or noted in the page footer where applicable.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Sponsored Content</h2>
              <p>
                Occasionally we publish sponsored posts, paid partnerships, or gifted product
                reviews. All sponsored content will be clearly labeled as "Sponsored,"
                "Partnership," or "Ad" at the beginning of the content.
              </p>
              <p className="mt-3">
                Sponsorship does not guarantee a positive review. We only work with brands and
                products we believe provide genuine value. Our editorial opinions remain our own.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Commentary and Fair Use</h2>
              <p>
                Content published under AniDax, including episode notes, arc reviews, character
                analyses, and seasonal recaps, represents original editorial commentary and falls
                under fair use. We do not reproduce copyrighted scripts, artwork, or media. All
                anime titles and franchises referenced remain the intellectual property of their
                respective rights holders.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Our Editorial Standard</h2>
              <p>
                We recommend products and services we have personally used or thoroughly
                researched. Affiliate relationships do not influence which products we feature or
                what we say about them. If a product is not worth your money, we will say so.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">FTC Compliance</h2>
              <p>
                This disclosure is made in accordance with the Federal Trade Commission's
                guidelines on endorsements and testimonials (16 CFR Part 255). We are committed
                to transparency with our audience.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Questions</h2>
              <p>
                If you have any questions about this disclosure or a specific piece of content,
                contact us at{' '}
                <a
                  href="mailto:hello@daxcollective.com"
                  className="text-blue-400 hover:underline"
                >
                  hello@daxcollective.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisclosurePage;
