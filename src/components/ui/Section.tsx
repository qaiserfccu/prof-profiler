'use client';

import { motion } from 'framer-motion';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const Section = ({ children, className = '', delay = 0 }: SectionProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`py-16 ${className}`}
    >
      {children}
    </motion.section>
  );
};

export default Section;