import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About */}
        <div>
          <h4 className="text-white text-lg font-bold mb-4">About News Flash</h4>
          <p className="text-sm">
            Your go-to source for the latest headlines and in-depth analysis from around the world.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white text-lg font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {['Home', 'About', 'Contact', 'Privacy Policy'].map((link) => (
              <li key={link}>
                <a href={`/${link.toLowerCase().replace(/ /g, '-')}`} className="hover:text-white transition-colors">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-white text-lg font-bold mb-4">Newsletter</h4>
          <p className="text-sm mb-4">Sign up for a daily digest of top stories.</p>
          <form className="flex">
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-2 rounded-l-lg focus:outline-none text-gray-900"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-white text-lg font-bold mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            {[faFacebookF, faTwitter, faInstagram, faLinkedinIn].map((icon, idx) => (
              <a
                key={idx}
                href="#"
                className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors"
              >
                <FontAwesomeIcon icon={icon} className="text-white text-lg" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
        &copy; {new Date().getFullYear()} News Flash. All rights reserved.
      </div>
    </footer>
  );
}