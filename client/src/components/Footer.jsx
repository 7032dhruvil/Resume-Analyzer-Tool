import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope, FaHeart } from 'react-icons/fa';
import Logo from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'API', href: '#api' },
      { name: 'Documentation', href: '#docs' }
    ],
    company: [
      { name: 'About', href: '#about' },
      { name: 'Blog', href: '#blog' },
      { name: 'Careers', href: '#careers' },
      { name: 'Press', href: '#press' }
    ],
    support: [
      { name: 'Help Center', href: '#help' },
      { name: 'Contact', href: '#contact' },
      { name: 'Status', href: '#status' },
      { name: 'Community', href: '#community' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'GDPR', href: '#gdpr' }
    ]
  };

  const socialLinks = [
    { icon: <FaLinkedin className="w-5 h-5" />, href: 'https://www.linkedin.com/in/solanki-dhruvil-819168296/', label: 'LinkedIn' },
    { icon: <FaEnvelope className="w-5 h-5" />, href: 'mailto:xyzdeveloper10@gmail.com', label: 'Email' }
  ];

  return (
    <footer className="bg-secondary-900 dark:bg-secondary-950 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="mb-12">
          {/* Brand Section - full width */}
          <div className="w-full mb-10">
            <div
              className="flex items-center space-x-4 mb-6"
            >
              <Logo />
              <div>
                <h3 className="text-2xl font-bold text-white">Resume Analyzer</h3>
                <p className="text-secondary-400 text-base">AI-Powered Analysis</p>
              </div>
            </div>
            <p className="text-secondary-400 mb-6 leading-relaxed">
              Transform your career with AI-powered resume analysis. Get instant feedback, 
              optimization suggestions, and stand out in today's competitive job market.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-secondary-800 dark:bg-secondary-700 rounded-lg flex items-center justify-center text-secondary-400 hover:text-white hover:bg-primary-600 transition-all duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Product Links */}
            <div
              className="initial:opacity-0 initial:y-20 whileInView:opacity-1 whileInView:y-0 transition-all duration-0.6"
            >
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-secondary-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Company Links */}
            <div
              className="initial:opacity-0 initial:y-20 whileInView:opacity-1 whileInView:y-0 transition-all duration-0.6"
            >
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-secondary-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Support Links */}
            <div
              className="initial:opacity-0 initial:y-20 whileInView:opacity-1 whileInView:y-0 transition-all duration-0.6"
            >
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-secondary-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Legal Links */}
            <div
              className="initial:opacity-0 initial:y-20 whileInView:opacity-1 whileInView:y-0 transition-all duration-0.6"
            >
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-secondary-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 mb-12"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Get the latest updates on new features, AI improvements, and career tips delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50 text-secondary-900"
              />
              <button
                className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors duration-200"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="border-t border-secondary-800 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-secondary-400 text-sm">
              <span>© {currentYear} Resume Analyzer. All rights reserved.</span>
              <span>•</span>
              <span>Made with</span>
              <FaHeart className="w-4 h-4 text-error-500 fill-current" />
              <span>for job seekers</span>
            </div>
            <div className="flex items-center space-x-6 text-secondary-400 text-sm">
              <span>Version 1.0.0</span>
              <span>•</span>
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
          <div className="mt-4 text-center text-secondary-400 text-sm">
            Developed by <span className="font-semibold text-white">Dhruvil Solanki</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 