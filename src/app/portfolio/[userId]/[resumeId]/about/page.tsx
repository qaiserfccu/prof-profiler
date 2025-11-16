'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import { FaPrint, FaBriefcase, FaGraduationCap, FaAward, FaCode } from 'react-icons/fa';

interface AboutContent {
  title: string;
  summary: string;
  sections: Array<{
    type: 'experience' | 'education' | 'skills' | 'achievements' | 'custom';
    title: string;
    items: Array<{
      title: string;
      subtitle?: string;
      description?: string;
      date?: string;
      points?: string[];
    }>;
  }>;
  photos?: string[];
}

export default function AboutPage() {
  const params = useParams();
  const userId = params.userId as string;
  const resumeId = params.resumeId as string;

  const [content, setContent] = useState<AboutContent | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAboutContent();
  }, [userId, resumeId]);

  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/portfolio/public?userId=${userId}&resumeId=${resumeId}&pageType=about`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio content');
      }

      const data = await response.json();
      
      const parsedContent = typeof data.content === 'string' 
        ? JSON.parse(data.content) 
        : data.content;
      
      setContent(parsedContent);
      
      if (data.photos && data.photos.length > 0) {
        setPhotos(data.photos);
      }
    } catch (err) {
      console.error('Error fetching about content:', err);
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getSectionIcon = (type: string) => {
    const icons: { [key: string]: any } = {
      experience: FaBriefcase,
      education: FaGraduationCap,
      skills: FaCode,
      achievements: FaAward,
    };
    return icons[type] || FaBriefcase;
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
          {error || 'Content not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Container>
        {/* Header with Print Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            {content.title}
          </h1>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg transition-all border border-white/30 print:hidden"
          >
            <FaPrint className="w-5 h-5" />
            Print as PDF
          </button>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8"
        >
          <p className="text-lg text-white/90 leading-relaxed">
            {content.summary}
          </p>
        </motion.div>

        {/* Photo Grid */}
        {photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
          >
            {photos.map((photo, index) => (
              <motion.img
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                src={photo}
                alt={`Photo ${index + 1}`}
                className="w-full h-48 object-cover rounded-xl border-2 border-white/30 shadow-lg print:hidden"
              />
            ))}
          </motion.div>
        )}

        {/* Sections */}
        {content.sections && content.sections.map((section, sectionIndex) => {
          const IconComponent = getSectionIcon(section.type);
          
          return (
            <motion.div
              key={sectionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + sectionIndex * 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <IconComponent className="w-8 h-8 text-white" />
                <h2 className="text-3xl font-bold text-white">
                  {section.title}
                </h2>
              </div>

              <div className="space-y-6">
                {section.items.map((item, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + itemIndex * 0.05 }}
                    className="bg-white/5 rounded-lg p-6 border border-white/10"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-white">
                        {item.title}
                      </h3>
                      {item.date && (
                        <span className="text-white/70 text-sm">
                          {item.date}
                        </span>
                      )}
                    </div>

                    {item.subtitle && (
                      <p className="text-white/80 mb-3">
                        {item.subtitle}
                      </p>
                    )}

                    {item.description && (
                      <p className="text-white/70 mb-3">
                        {item.description}
                      </p>
                    )}

                    {item.points && item.points.length > 0 && (
                      <ul className="list-disc list-inside space-y-1">
                        {item.points.map((point, pointIndex) => (
                          <li key={pointIndex} className="text-white/70">
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </Container>
    </div>
  );
}
