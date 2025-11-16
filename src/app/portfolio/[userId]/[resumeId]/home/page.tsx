'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import { FaStar, FaCode, FaBriefcase, FaGraduationCap } from 'react-icons/fa';

interface HomeContent {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  highlights: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  featuredSkills: string[];
  photos?: string[];
}

export default function HomePage() {
  const params = useParams();
  const userId = params.userId as string;
  const resumeId = params.resumeId as string;

  const [content, setContent] = useState<HomeContent | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHomeContent();
  }, [userId, resumeId]);

  const fetchHomeContent = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch portfolio page content
      const response = await fetch(`/api/portfolio/public?userId=${userId}&resumeId=${resumeId}&pageType=home`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio content');
      }

      const data = await response.json();
      
      // Parse the content JSON
      const parsedContent = typeof data.content === 'string' 
        ? JSON.parse(data.content) 
        : data.content;
      
      setContent(parsedContent);
      
      // Set photos if available
      if (data.photos && data.photos.length > 0) {
        setPhotos(data.photos);
      }
    } catch (err) {
      console.error('Error fetching home content:', err);
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      star: FaStar,
      code: FaCode,
      briefcase: FaBriefcase,
      graduation: FaGraduationCap,
    };
    return icons[iconName] || FaStar;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">
          {error || 'Portfolio not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Container>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-8">
            {photos.length > 0 ? (
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={photos[0]}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white shadow-2xl flex items-center justify-center">
                <FaStar className="w-12 h-12 text-white" />
              </div>
            )}
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            {content.heroTitle}
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 mb-6">
            {content.heroSubtitle}
          </p>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            {content.heroDescription}
          </p>
        </motion.div>

        {/* Highlights */}
        {content.highlights && content.highlights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            {content.highlights.map((highlight, index) => {
              const IconComponent = getIconComponent(highlight.icon);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all"
                >
                  <IconComponent className="w-10 h-10 text-white mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-white/80">
                    {highlight.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Featured Skills */}
        {content.featuredSkills && content.featuredSkills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Featured Skills
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {content.featuredSkills.map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium border border-white/30"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Photo Gallery */}
        {photos.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.slice(1).map((photo, index) => (
                <motion.img
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  src={photo}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-48 object-cover rounded-xl border-2 border-white/30 shadow-lg hover:scale-105 transition-transform"
                />
              ))}
            </div>
          </motion.div>
        )}
      </Container>
    </div>
  );
}
