'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const PersonalHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/personal' },
    { name: 'About', href: '/personal/about' },
    { name: 'Portfolio', href: '/personal/portfolio' },
    { name: 'Skills', href: '/personal/about#skills' },
    { name: 'Experience', href: '/personal/about#experience' },
    { name: 'Contact', href: '/personal/contact' },
  ];

  return (
    <header className="fixed w-full bg-gradient-to-r from-indigo-600/90 via-purple-600/90 to-blue-600/90 backdrop-blur-sm shadow-lg z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white hover:text-purple-100 transition-colors">
            Back to Family
          </Link>

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

export default PersonalHeader;