import React from 'react';
import { Link } from 'react-router-dom';
import { daxCollectiveSocialLinks, publicSocialLinks } from '../config/socialLinks';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    brands: [
      { name: 'Dax the Traveler', to: '/dax-the-traveler' },
      { name: 'Ani-Dax', to: '/ani-dax' },
      { name: 'Timezone Travelers', to: '/timezone-travelers' },
      { name: "God's Vessel", to: '/gods-vessel' },
    ],
    explore: [
      { name: 'Blog', to: '/blog' },
      { name: 'Resources', to: '/resources' },
      { name: 'About', to: '/about' },
      { name: 'All Brands', to: '/brands' },
      { name: 'Contact', to: '/contact' },
    ],
    legal: [
      { name: 'Privacy Policy', to: '/privacy' },
      { name: 'Terms of Service', to: '/terms' },
      { name: 'Affiliate Disclosure', to: '/disclosure' },
    ],
    // Verified links only; unconfirmed handles and placeholders are omitted.
    social: publicSocialLinks(daxCollectiveSocialLinks),
  };

  return (
    <footer className="bg-gradient-to-r from-black via-zinc-900 to-black text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold tracking-wide mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Dax Collective
            </h3>
            <p className="text-gray-400 leading-relaxed mb-4 text-sm">
              Building a multi-brand content platform across travel, anime, faith, and lifestyle.
              Honest stories, real guides, purpose-driven content.
            </p>
            {footerLinks.social.length > 0 && (
              <div className="flex flex-wrap gap-x-3 gap-y-2">
                {footerLinks.social.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:text-blue-400 transition-colors duration-300"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Brands */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white uppercase tracking-wider">Brands</h4>
            <ul className="space-y-2">
              {footerLinks.brands.map((brand) => (
                <li key={brand.to}>
                  <Link
                    to={brand.to}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 block py-0.5 text-sm"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 block py-0.5 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="min-w-0">
            <h4 className="text-sm font-semibold mb-4 text-white uppercase tracking-wider">Stay Connected</h4>
            <p className="text-gray-400 mb-4 text-sm">
              Get new posts and drops from all brands.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                aria-label="Email address"
                disabled
                className="min-w-0 flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {/* No email-updates service is connected yet, so this stays disabled
                  rather than accepting an address that would go nowhere. */}
              <button
                type="button"
                disabled
                className="px-4 py-2 bg-blue-600 rounded-r-lg font-semibold text-sm opacity-50 cursor-not-allowed"
              >
                Soon
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Email updates aren&rsquo;t open yet.{' '}
              <Link to="/privacy" className="hover:text-gray-400">Privacy Policy.</Link>
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © {currentYear} Dax Collective. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-500 hover:text-gray-400 text-xs transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://buymeacoffee.com/DaxCollective"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-yellow-400 text-xs transition-colors duration-300"
            >
              💡 Keep the Lights On
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
