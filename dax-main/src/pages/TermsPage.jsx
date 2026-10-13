import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const TermsPage = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service — Dax Collective</title>
        <meta
          name="description"
          content="The basic terms for using the Dax Collective website and its brand pages."
        />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">
              Legal
            </p>
            <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-gray-400 text-sm">Last updated: October 12, 2026</p>
          </div>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">Use of the Site</h2>
              <p>
                The Dax Collective website is a content and brand hub for Dax the Traveler,
                Time-Zone Travelers, AniDax, and God&rsquo;s Vessel. You may browse the public
                pages for personal, non-abusive use. Do not attempt to interfere with the site,
                its sign-in or admin areas, its automation workflows, or the services it connects
                to.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Content</h2>
              <p>
                Site text, imagery, brand names, and other materials are owned by Dax Collective
                or used with a stated source or permission where applicable. Do not copy, scrape,
                repackage, or impersonate Dax Collective content or brands without permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Products and Waitlists</h2>
              <p>
                Product pages may describe items that are planned or in development. A product
                shown on this site is not an offer to sell unless the page provides a way to
                purchase it. Joining a waitlist is a request to be notified; it is not an order,
                a reservation, or a commitment by either side.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">External Platforms and Links</h2>
              <p>
                Some buttons and links take you to external platforms and retailers. Dax
                Collective does not control those services, their availability, or their separate
                terms. Where a link may earn us a commission, that is covered in our{' '}
                <Link to="/disclosure" className="text-blue-400 hover:underline">
                  Affiliate Disclosure
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Admin and Automation Areas</h2>
              <p>
                Sign-in, dashboard, and automation tools on this site are intended for authorized
                owner and admin use only. Public access to the website does not grant permission
                to use admin routes, backend services, or automation systems.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">No Warranty</h2>
              <p>
                The site is provided as-is. Content, integrations, and external links may change,
                be incomplete, or become unavailable. Travel, faith, and other content is shared
                for general information and inspiration, not as professional advice. Use the site
                and linked services at your own discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Privacy</h2>
              <p>
                How we handle information you share with us is described in our{' '}
                <Link to="/privacy" className="text-blue-400 hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Questions</h2>
              <p>
                If you have any questions about these terms, contact us at{' '}
                <a href="mailto:hello@daxcollective.com" className="text-blue-400 hover:underline">
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

export default TermsPage;
