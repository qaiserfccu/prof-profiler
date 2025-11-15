'use client';

import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import { motion } from 'framer-motion';

export default function FamilyGallery() {
  // Note: Replace these with actual image paths once you have the family photos
  const photos = [
    {
      src: '/images/family/placeholder1.jpg',
      title: 'Family Gathering',
      description: 'Annual family reunion, 2023',
      category: 'Family Events'
    },
    {
      src: '/images/family/placeholder2.jpg',
      title: 'Graduation Day',
      description: "Dr. Hira's Pharmacy Graduation",
      category: 'Academic Achievements'
    },
    {
      src: '/images/family/placeholder3.jpg',
      title: 'Professional Life',
      description: 'Dr. Faisal at the hospital',
      category: 'Professional'
    },
    {
      src: '/images/family/placeholder4.jpg',
      title: 'Recognition Ceremony',
      description: 'Service awards ceremony',
      category: 'Achievements'
    },
    {
      src: '/images/family/placeholder5.jpg',
      title: 'Family Celebration',
      description: 'Eid celebration with family',
      category: 'Celebrations'
    },
    {
      src: '/images/family/placeholder6.jpg',
      title: 'Professional Milestone',
      description: 'Dr. Memoona at medical conference',
      category: 'Professional'
    }
  ];

  const categories = ['All', 'Family Events', 'Academic Achievements', 'Professional', 'Achievements', 'Celebrations'];

  return (
    <Section className="bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950 dark:via-indigo-950/30 dark:to-purple-950/50">
      <Container>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
              Family Gallery
            </h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              Capturing our moments of joy, success, and togetherness
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="px-6 py-2 rounded-full bg-white/80 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white transition-all"
              >
                {category}
              </motion.button>
            ))}
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-xl shadow-lg"
              >
                <div className="aspect-w-4 aspect-h-3 relative">
                  {/* Replace this div with Image component once you have actual images */}
                  <div className="w-full h-64 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900"></div>
                  {/* Uncomment this when you have actual images */}
                  {/* <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    className="object-cover"
                  /> */}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {photo.title}
                    </h3>
                    <p className="text-gray-200 text-sm">
                      {photo.description}
                    </p>
                    <span className="inline-block mt-3 px-3 py-1 bg-white/20 rounded-full text-xs text-white">
                      {photo.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white/80 dark:bg-gray-800/50 p-8 rounded-xl shadow-lg backdrop-blur-sm"
            >
              <p className="text-gray-700 dark:text-gray-300">
                This gallery showcases our family's journey through the years, capturing precious moments 
                of celebration, achievement, and togetherness. Each photo tells a story of our shared 
                experiences and the bonds that unite us.
              </p>
            </motion.div>
          </div>
        </div>
      </Container>
    </Section>
  );
}