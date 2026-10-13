import React from 'react';
import { Helmet } from 'react-helmet-async';

const PrivacyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy — Dax Collective</title>
        <meta
          name="description"
          content="Privacy policy for Dax Collective and all associated brands."
        />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">
              Legal
            </p>
            <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-gray-400 text-sm">Last updated: October 13, 2026</p>
          </div>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">Overview</h2>
              <p>
                Dax Collective ("we," "us," "our") operates this website and associated content
                brands. This policy explains what information we collect, how we use it, and what
                rights you have.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Information We Collect</h2>
              <h3 className="font-semibold text-white mb-2">Information you provide directly:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-400 pl-2 mb-4">
                <li>Email address (when you subscribe to our newsletter or join a waitlist)</li>
                <li>Name (optional, when provided in contact forms)</li>
                <li>Messages and correspondence via contact forms</li>
              </ul>
              <h3 className="font-semibold text-white mb-2">Information collected automatically:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-400 pl-2">
                <li>Page views and navigation (via Google Analytics)</li>
                <li>Browser type, device type, and operating system</li>
                <li>Referring URLs and general geographic location (country/region level)</li>
                <li>Session duration and pages visited</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-400 pl-2">
                <li>To send newsletters and content updates you have opted into</li>
                <li>To notify waitlist subscribers when products or drops are available</li>
                <li>To respond to contact form submissions</li>
                <li>To understand how content is performing and improve the site</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Third-Party Services</h2>
              <p className="mb-3">We use the following third-party services that may process your data:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400 pl-2">
                <li>
                  <span className="text-white font-medium">Google Analytics</span> — website
                  usage analytics. Governed by Google's privacy policy.
                </li>
                <li>
                  <span className="text-white font-medium">Firebase / Google Firestore</span> —
                  used for comment storage on AniDax. Anonymous authentication only.
                </li>
                <li>
                  <span className="text-white font-medium">YouTube</span> — embedded videos may
                  set cookies per YouTube's privacy policy.
                </li>
                <li>
                  <span className="text-white font-medium">Buy Me a Coffee</span> — external
                  payment platform. Subject to their own privacy policy.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Google and YouTube Account Access</h2>
              <p className="mb-3">
                This site does not ask visitors to connect a Google or YouTube account, and no
                public feature requests Google OAuth permissions from you.
              </p>
              <p className="mb-3">
                Dax Collective may connect its own Google accounts (such as Google Drive and
                YouTube) to internal tools, with the owner&apos;s authorization, to manage its own
                files, channel information and publishing workflows. That access is limited to
                accounts Dax Collective owns and is not used to read visitor data.
              </p>
              <p>
                Where this access is in use, the OAuth credentials and refresh tokens are kept in
                server-side configuration and are never included in this website or sent to your
                browser. The account owner can revoke the access at any time from the Google
                Account permissions page at{' '}
                <a
                  href="https://myaccount.google.com/permissions"
                  className="text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  myaccount.google.com/permissions
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Cookies</h2>
              <p>
                This site uses cookies for analytics and functionality. By using this site you
                consent to essential cookies. You may disable cookies in your browser settings,
                though some site features may not function correctly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Data Retention</h2>
              <p>
                Email addresses are retained until you unsubscribe. Analytics data is retained
                per Google Analytics default settings (26 months). Contact form submissions
                are retained for up to 12 months.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Your Rights</h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 pl-2">
                <li>Request access to data we hold about you</li>
                <li>Request correction or deletion of your data</li>
                <li>Unsubscribe from any email list at any time</li>
                <li>Opt out of analytics tracking (via browser settings or a browser extension)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Children's Privacy</h2>
              <p>
                This site is not directed to children under 13. We do not knowingly collect
                personal information from minors. If you believe a minor has submitted information
                to us, please contact us for removal.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Contact</h2>
              <p>
                For privacy-related questions or data requests, contact us at{' '}
                <a
                  href="mailto:privacy@daxcollective.com"
                  className="text-blue-400 hover:underline"
                >
                  privacy@daxcollective.com
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

export default PrivacyPage;
