import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    brands: [
      { name: 'Dax the Traveler', to: '/dax-the-traveler' },
      { name: 'Ani-Dax', to: '/ani-dax' },
      { name: 'Timezone Travelers', to: '/timezone-travelers' },
      { name: "God's Vessel", to: '/gods-vessel' }
    ],
    resources: [
      { name: 'About', to: '/about' },
      { name: 'Contact', to: '/contact' },
      { name: 'Privacy Policy', to: '/privacy' },
      { name: 'Terms of Service', to: '/terms' }
    ],
    social: [
      { name: 'YouTube', url: 'https://youtube.com/@daxcollective' },
      { name: 'Instagram', url: 'https://instagram.com/daxcollective' },
      { name: 'TikTok', url: 'https://tiktok.com/@daxcollective' },
      { name: 'Twitter', url: 'https://twitter.com/daxcollective' }
    ]
  };

  return (
    <footer className="bg-gradient-to-r from-black via-zinc-900 to-black text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold tracking-wide mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Dax Collective
            </h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              Building a content empire across multiple brands. From travel adventures to anime reviews, 
              faith-based content to travel hacks - we create content that inspires and entertains.
            </p>
            <div className="flex space-x-4">
              {footerLinks.social.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  <span className="sr-only">{social.name}</span>
                  <div className="w-6 h-6 bg-gray-600 hover:bg-blue-500 rounded transition-colors duration-300"></div>
                </a>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Our Brands</h4>
            <ul className="space-y-2">
              {footerLinks.brands.map((brand, index) => (
                <li key={index}>
                  <Link
                    to={brand.to}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 block py-1"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((resource, index) => (
                <li key={index}>
                  <Link
                    to={resource.to}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 block py-1"
                  >
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Stay Connected</h4>
            <p className="text-gray-400 mb-4">
              Get the latest updates from all our brands delivered to your inbox.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
              />
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-lg font-semibold transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Dax Collective. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-300">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-300">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

