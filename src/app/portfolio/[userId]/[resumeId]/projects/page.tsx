'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import { FaGithub, FaExternalLinkAlt, FaCalendar, FaTag } from 'react-icons/fa';

interface Project {
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  date?: string;
  githubUrl?: string;
  liveUrl?: string;
  highlights?: string[];
}

interface ProjectsContent {
  title: string;
  subtitle: string;
  projects: Project[];
}

export default function ProjectsPage() {
  const params = useParams();
  const userId = params.userId as string;
  const resumeId = params.resumeId as string;

  const [content, setContent] = useState<ProjectsContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjectsContent();
  }, [userId, resumeId]);

  const fetchProjectsContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/portfolio/public?userId=${userId}&resumeId=${resumeId}&pageType=portfolio`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio content');
      }

      const data = await response.json();
      
      const parsedContent = typeof data.content === 'string' 
        ? JSON.parse(data.content) 
        : data.content;
      
      setContent(parsedContent);
    } catch (err) {
      console.error('Error fetching projects content:', err);
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {content.title}
          </h1>
          <p className="text-xl text-white/80">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Projects Grid */}
        {content.projects && content.projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:bg-white/15 transition-all group"
              >
                {/* Project Image */}
                {project.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                )}

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {project.title}
                  </h3>

                  {project.date && (
                    <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
                      <FaCalendar className="w-4 h-4" />
                      <span>{project.date}</span>
                    </div>
                  )}

                  <p className="text-white/80 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Highlights */}
                  {project.highlights && project.highlights.length > 0 && (
                    <ul className="list-disc list-inside text-white/70 mb-4 space-y-1">
                      {project.highlights.map((highlight, hIndex) => (
                        <li key={hIndex}>{highlight}</li>
                      ))}
                    </ul>
                  )}

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FaTag className="w-4 h-4 text-white/70" />
                        <span className="text-white/70 text-sm font-medium">Technologies:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm border border-white/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex gap-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg transition-all border border-white/30"
                      >
                        <FaGithub className="w-5 h-5" />
                        Code
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg transition-all border border-white/30"
                      >
                        <FaExternalLinkAlt className="w-4 h-4" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white/70 py-12"
          >
            <p className="text-xl">No projects to display yet.</p>
          </motion.div>
        )}
      </Container>
    </div>
  );
}
