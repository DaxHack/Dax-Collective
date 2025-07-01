// src/components/Navbar.jsx
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
<<<<<<< HEAD
import { analytics } from '../utils/analytics'; // Import your analytics utility
=======
>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c

const navLinks = [
  { name: 'Home', to: '/' },
  { name: 'Dax the Traveler', to: '/dax-the-traveler' },
  { name: 'Ani-Dax', to: '/ani-dax' },
  { name: 'Timezone Travelers', to: '/timezone-travelers' },
  { name: "God's Vessel", to: '/gods-vessel' }
]

export default function Navbar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (to) => location.pathname === to

<<<<<<< HEAD
  // Function to handle Buy Me a Coffee button click with analytics tracking
  const handleDonationClick = () => {
    // Use the analytics utility to track the donation click
    // The 'navbar' parameter indicates the source of the click
    // 'Keep the Lights On Button' is the button text for event labeling
    analytics.trackDonation('navbar', 'Keep the Lights On Button');

    // Open Buy Me a Coffee page
    window.open('https://buymeacoffee.com/DaxCollective', '_blank', 'noopener,noreferrer');
  };

=======
>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c
  return (
    <nav className="bg-gradient-to-r from-black via-zinc-900 to-black text-white sticky top-0 z-50 shadow-md backdrop-blur-sm bg-opacity-70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* LOGO / TITLE */}
          <div className="text-2xl font-bold tracking-wide">Dax Collective</div>

          {/* DESKTOP NAV LINKS + CTA */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className={`relative group transition-all font-medium ${
                  isActive(link.to) ? 'text-blue-400' : 'text-white hover:text-blue-400'
                }`}
              >
                {link.name}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-blue-500 transition-all duration-300 ${
                    isActive(link.to)
                      ? 'w-full'
                      : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}

<<<<<<< HEAD
            {/* CALL TO ACTION BUTTON - Updated with correct link and analytics */}
            <button
              onClick={handleDonationClick}
              className="ml-4 px-4 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-lg animate-pulse focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Support Dax Collective on Buy Me a Coffee"
            >
              💡 Keep the Lights On
            </button>
=======
            {/* CALL TO ACTION BUTTON */}
            <a
              href="https://www.buymeacoffee.com/dax"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 px-4 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-lg animate-pulse"
            >
              💡 Keep the Lights On
            </a>
>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c
          </div>

          {/* MOBILE TOGGLE BUTTON */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <Transition
          show={isOpen}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="md:hidden flex flex-col space-y-4 pb-4">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`block text-lg font-medium transition-all px-4 ${
                  isActive(link.to) ? 'text-blue-400' : 'text-white hover:text-blue-400'
                }`}
              >
                {link.name}
              </Link>
            ))}

<<<<<<< HEAD
            {/* CTA on Mobile - Updated with correct link and analytics */}
            <button
              onClick={() => {
                handleDonationClick();
                setIsOpen(false); // Close mobile menu
              }}
              className="block text-center mt-2 mx-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Support Dax Collective on Buy Me a Coffee"
            >
              💡Help Me Keep the Lights On
            </button>
=======
            {/* CTA on Mobile */}
            <a
              href="https://www.buymeacoffee.com/dax"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center mt-2 mx-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all shadow"
            >
              💡Help Me Keep the Lights On
            </a>
>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c
          </div>
        </Transition>
      </div>
    </nav>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c
