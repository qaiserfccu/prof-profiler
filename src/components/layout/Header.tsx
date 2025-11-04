'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/' },
    { name: 'Family', href: '/family' },
    { name: 'Gallery', href: '/family/gallery' },
    { name: 'Timeline', href: '/family/timeline' },
    { name: 'Tree', href: '/family/tree' },
  ];

  return (
    <header className="fixed w-full bg-gradient-to-r from-indigo-500/90 via-purple-500/90 to-pink-500/90 backdrop-blur-sm shadow-lg z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white hover:text-purple-100 transition-colors">
            Rao's Family
          </Link>

          {/* Qaiser's Profile Link */}
          <div className="hidden md:block relative group">
            <button className="text-white/90 hover:text-white font-medium transition-all hover:scale-105 px-4 py-2 rounded-lg hover:bg-white/10">
              Rao Muhammad Qaiser Nadeem
              <div className="absolute top-full left-0 mt-2 w-48 bg-white/95 dark:bg-gray-800/95 rounded-lg shadow-xl backdrop-blur-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link href="/personal/about" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700/50 rounded-t-lg">
                  About Me
                </Link>
                <Link href="/personal/portfolio" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700/50">
                  Portfolio
                </Link>
                <Link href="/personal/contact" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700/50 rounded-b-lg">
                  Contact
                </Link>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white/90 hover:text-white font-medium transition-all hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-white after:transition-all"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-4 ml-4 border-l border-white/20 pl-4">
              <a
                href="https://www.github.com/qaiserfcc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white transition-all hover:scale-110"
                aria-label="GitHub Profile"
              >
                <FaGithub className="w-6 h-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/qaiserfcc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white transition-all hover:scale-110"
                aria-label="LinkedIn Profile"
              >
                <FaLinkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <HiX className="w-6 h-6 text-white" />
            ) : (
              <HiMenu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-4"
          >
            <div className="py-2 space-y-1 bg-white/10 backdrop-blur-md rounded-lg">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/20 transition-colors rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex items-center space-x-6 px-4 py-3 border-t border-white/10 mt-2">
                <a
                  href="https://www.github.com/qaiserfcc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 hover:text-white transition-all hover:scale-110"
                  aria-label="GitHub Profile"
                >
                  <FaGithub className="w-6 h-6" />
                </a>
                <a
                  href="https://www.linkedin.com/in/qaiserfcc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 hover:text-white transition-all hover:scale-110"
                  aria-label="LinkedIn Profile"
                >
                  <FaLinkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
};

export default Header;