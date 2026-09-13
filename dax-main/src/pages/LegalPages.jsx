import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const lastUpdated = 'September 13, 2026';

const Section = ({ title, children }) => (
  <section className="space-y-3">
    <h2 className="text-2xl font-bold text-white">{title}</h2>
    <div className="space-y-3 text-sm leading-7 text-slate-300 md:text-base">
      {children}
    </div>
  </section>
);

const LegalShell = ({ title, description, children }) => (
  <div className="min-h-screen bg-[#02000a] text-white">
    <Helmet>
      <title>{title} | Dax Collective</title>
      <meta name="description" content={description} />
    </Helmet>

    <section className="px-6 py-24">
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="space-y-4 border-b border-white/10 pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-300">
            Dax Collective
          </p>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">{title}</h1>
          <p className="max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
            {description}
          </p>
          <p className="text-sm text-slate-500">Last updated: {lastUpdated}</p>
        </div>

        {children}

        <div className="border-t border-white/10 pt-8 text-sm text-slate-400">
          Questions about these terms can be sent to{' '}
          <a className="text-indigo-300 hover:text-indigo-200" href="mailto:contact@daxcollective.com">
            contact@daxcollective.com
          </a>
          .
        </div>
      </div>
    </section>
  </div>
);

export const PrivacyPage = () => (
  <LegalShell
    title="Privacy Policy"
    description="How Dax Collective handles analytics, admin authentication, automation data, and third-party links on this site."
  >
    <Section title="Information Collected">
      <p>
        Dax Collective uses direct Google Analytics gtag scripts to understand basic site usage, such as
        page views, outbound link clicks, and similar engagement events. This may include standard technical
        data such as browser, device, referrer, approximate location, and page URL information provided to
        Google Analytics.
      </p>
      <p>
        Firebase Authentication is used for admin functionality. If an authorized admin signs in, Firebase
        may process account identifiers such as the admin user email, profile name, UID, and authentication
        session details.
      </p>
      <p>
        The codebase includes a comments component, but public comments are not currently rendered as a
        public site feature. The footer email field is not currently connected to subscriber storage or a
        mailing list.
      </p>
    </Section>

    <Section title="Google And YouTube Automation">
      <p>
        Dax Collective may use Google and YouTube API access for owner-authorized automation workflows, such
        as reading channel metadata, syncing video information, preparing content operations, or sending data
        to configured backend or n8n workflows. Public visitors are not asked to grant YouTube permissions
        through the homepage.
      </p>
      <p>
        OAuth credentials and refresh tokens, when used, are for authorized admin or owner workflows and
        should be stored in the relevant backend, hosting, or automation environment. Access can be revoked
        through the connected Google account permissions settings.
      </p>
    </Section>

    <Section title="Third-Party Services">
      <p>
        This site links to third-party platforms including YouTube, Instagram, TikTok, and Buy Me a Coffee.
        Those services have their own privacy practices. Buy Me a Coffee support happens on Buy Me a Coffee,
        not as an on-site transaction handled by Dax Collective.
      </p>
    </Section>

    <Section title="Choices">
      <p>
        You can use browser controls or privacy tools to limit cookies, analytics scripts, and third-party
        tracking. Admin users can sign out of Firebase Authentication from the admin interface where sign-in
        is available.
      </p>
    </Section>
  </LegalShell>
);

export const TermsPage = () => (
  <LegalShell
    title="Terms of Service"
    description="The basic terms for using the Dax Collective website and linked brand pages."
  >
    <Section title="Use Of The Site">
      <p>
        The Dax Collective website is a content and brand hub. You may browse public pages for personal,
        non-abusive use. Do not attempt to interfere with the site, admin functionality, authentication,
        automation workflows, or connected services.
      </p>
    </Section>

    <Section title="Content">
      <p>
        Site text, imagery, brand names, and other materials are owned by Dax Collective or used with a
        stated source or permission where applicable. Do not copy, scrape, repackage, or impersonate Dax
        Collective content or brands without permission.
      </p>
    </Section>

    <Section title="External Platforms">
      <p>
        Some buttons and links take you to external platforms such as YouTube, Instagram, TikTok, and Buy Me
        a Coffee. Dax Collective does not control those services, their availability, or their separate
        terms. Any Buy Me a Coffee support is handled by Buy Me a Coffee off-site.
      </p>
    </Section>

    <Section title="Admin And Automation Areas">
      <p>
        Firebase Authentication and Google or YouTube automation tools are intended for authorized admin or
        owner workflows only. Public access to the website does not grant permission to use admin routes,
        private credentials, backend services, or automation systems.
      </p>
    </Section>

    <Section title="No Warranty">
      <p>
        The site is provided as-is. Content, integrations, and external links may change, be incomplete, or
        become unavailable. Use the site and linked services at your own discretion.
      </p>
    </Section>
  </LegalShell>
);

export const DisclosurePage = () => (
  <LegalShell
    title="Disclosure"
    description="Plain-language notes about external links, support links, analytics, and current site limitations."
  >
    <Section title="Support Links">
      <p>
        Dax Collective links to Buy Me a Coffee for optional support. That link sends visitors to Buy Me a
        Coffee, where any support action is handled by that platform and its terms.
      </p>
    </Section>

    <Section title="External And Sponsored Links">
      <p>
        Unless a page clearly labels a link or placement as sponsored, paid, or affiliate, visitors should
        not assume that Dax Collective receives compensation from that link. Current public pages should not
        be read as a claim that products are sold on-site or that affiliate relationships are active.
      </p>
    </Section>

    <Section title="Automation Transparency">
      <p>
        The site and repository include admin and automation code for content operations, Google APIs, and
        YouTube-related workflows. Those tools depend on configured credentials and authorized workflows.
        Public visitors do not grant YouTube access by browsing the homepage.
      </p>
    </Section>

    <Section title="More Information">
      <p>
        Read the <Link className="text-indigo-300 hover:text-indigo-200" to="/privacy">Privacy Policy</Link>{' '}
        and <Link className="text-indigo-300 hover:text-indigo-200" to="/terms">Terms of Service</Link> for
        more detail.
      </p>
    </Section>
  </LegalShell>
);
