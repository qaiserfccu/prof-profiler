'use client';

import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import Image from 'next/image';
import Link from 'next/link';
import { FaCode, FaServer, FaMobile, FaCloud, FaDatabase, FaCogs } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Carousel from '@/components/ui/Carousel';

export default function Home() {
  const experience = [
    {
      title: 'Senior Full Stack Developer',
      description: 'Leading enterprise-scale applications development using modern tech stack. Implementing microservices architecture and establishing DevOps practices.',
      date: '2020 - Present',
      tags: ['Nodejs', '.NET Core', 'React', 'Angular', 'Microservices', 'DevOps'],
      image: '/images/project1.jpg'
    },
    {
      title: 'Full Stack Developer',
      description: 'Developed and optimized web applications for government and tourism sectors. Improved system performance and enhanced user experience.',
      date: '2018 - 2020',
      tags: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
      image: '/images/project2.jpg'
    },
    {
      title: 'Software Engineer',
      description: 'Built responsive web applications and RESTful APIs. Collaborated with cross-functional teams to deliver high-quality solutions.',
      date: '2015 - 2018',
      tags: ['JavaScript', 'Python', 'MySQL', 'REST APIs'],
      image: '/images/project3.jpg'
    }
  ];

  const projects = [
    {
      title: 'Tourism Management System',
      description: 'A comprehensive platform for managing tourism activities, bookings, and customer relationships.',
      tags: ['React', 'Node.js', 'MongoDB', 'AWS'],
      link: '/portfolio',
      image: '/images/project1.jpg'
    },
    {
      title: 'Government Document Portal',
      description: 'Secure document management system with advanced search and workflow capabilities.',
      tags: ['.NET Core', 'Angular', 'SQL Server', 'Azure'],
      link: '/portfolio',
      image: '/images/project2.jpg'
    },
    {
      title: 'E-commerce Platform',
      description: 'Modern e-commerce solution with real-time inventory management and analytics.',
      tags: ['Next.js', 'TypeScript', 'GraphQL', 'PostgreSQL'],
      link: '/portfolio',
      image: '/images/project3.jpg'
    }
  ];

  const repositories = [
    {
      title: 'Next.js Portfolio Template',
      description: 'A modern, responsive portfolio template built with Next.js and Tailwind CSS.',
      tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
      link: 'https://github.com/username/nextjs-portfolio',
      image: '/images/project2.jpg'  // Using different image to avoid repetition
    },
    {
      title: 'React Component Library',
      description: 'A collection of reusable React components with TypeScript support.',
      tags: ['React', 'TypeScript', 'Storybook'],
      link: 'https://github.com/username/react-components',
      image: '/images/project3.jpg'
    },
    {
      title: 'API Framework',
      description: 'Lightweight API framework with built-in authentication and caching.',
      tags: ['Node.js', 'Express', 'MongoDB'],
      link: 'https://github.com/username/api-framework',
      image: '/images/project1.jpg'  // Rotating images to create variety
    }
  ];

  const stats = [
    { number: '10+', label: 'Years Experience', gradient: 'from-blue-400 to-blue-600' },
    { number: '50+', label: 'Projects Completed', gradient: 'from-purple-400 to-purple-600' },
    { number: '15+', label: 'GitHub Repositories', gradient: 'from-indigo-400 to-indigo-600' },
    { number: '3+', label: 'Enterprise Solutions', gradient: 'from-violet-400 to-violet-600' }
  ];
  const skills = [
    {
      icon: FaCode,
      title: 'Frontend Development',
      description: 'Expert in Angular and React, creating responsive and intuitive user interfaces with modern web technologies.',
      techs: ['Angular', 'React', 'TypeScript', 'Tailwind CSS', 'Redux']
    },
    {
      icon: FaServer,
      title: 'Backend Development',
      description: 'Building robust and scalable backend systems with modern frameworks and microservices architecture.',
      techs: ['.NET Core', 'Node.js', 'Python', 'Java', 'RESTful APIs']
    },
    {
      icon: FaMobile,
      title: 'Mobile Development',
      description: 'Creating native mobile applications for iOS and Android platforms.',
      techs: ['Swift', 'Kotlin', 'React Native', 'Mobile UI/UX']
    },
    {
      icon: FaCloud,
      title: 'Cloud & DevOps',
      description: 'Implementing and managing cloud infrastructure with modern DevOps practices.',
      techs: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'CI/CD']
    },
    {
      icon: FaDatabase,
      title: 'Database Management',
      description: 'Designing and optimizing database systems for performance and scalability.',
      techs: ['SQL Server', 'MongoDB', 'PostgreSQL', 'Redis', 'ElasticSearch']
    },
    {
      icon: FaCogs,
      title: 'System Architecture',
      description: 'Designing scalable and maintainable system architectures for enterprise applications.',
      techs: ['Microservices', 'Event-Driven', 'Domain-Driven Design', 'API Gateway']
    }
  ];

  return (
    <>
      {/* Hero Section with Gradient Background */}
      <Section className="bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-indigo-950 dark:via-gray-900 dark:to-purple-950">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold">
                  Hi, I'm{' '}
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                    Rao Muhammad Qaiser Nadeem
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mt-6">
                  A seasoned Full Stack Developer with extensive experience in designing and implementing scalable software solutions across multiple industries, including government and tourism.
                </p>
                <div className="flex gap-4 mt-8">
                  <Link
                    href="/portfolio"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    View My Work
                  </Link>
                  <Link
                    href="/contact"
                    className="border-2 border-gray-800 dark:border-gray-200 text-gray-800 dark:text-gray-200 px-8 py-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white transition-all transform hover:scale-105"
                  >
                    Contact Me
                  </Link>
                </div>
              </motion.div>
            </div>
            <motion.div
              className="flex-1 relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-64 h-80 md:w-80 md:h-96 relative mx-auto overflow-hidden rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 dark:from-indigo-400/10 dark:to-purple-400/10 z-10"></div>
                <Image
                  src="/images/IMG_3832.JPG"
                  alt="Rao Muhammad Qaiser Nadeem"
                  width={800}
                  height={1000}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

            {/* Skills Section */}
      <Section delay={0.2} className="bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-indigo-950 dark:via-gray-900 dark:to-purple-950">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent inline-block">
              Technical Expertise
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
              With over a decade of experience, I've developed expertise across multiple domains of software development
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-indigo-100/20 dark:border-indigo-700/20"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                    <skill.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold dark:text-white">{skill.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{skill.description}</p>
                <div className="flex flex-wrap gap-2">
                  {skill.techs.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/50 dark:to-purple-900/50 text-gray-700 dark:text-gray-200 rounded-full text-sm backdrop-blur-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Experience Carousel */}
      <Section delay={0.3} className="bg-gradient-to-br from-purple-50/50 via-white to-indigo-50/50 dark:from-purple-950 dark:via-gray-900 dark:to-indigo-950">
        <Container>
          <Carousel
            items={experience}
            title="Professional Experience"
            autoPlayInterval={6000}
          />
        </Container>
      </Section>

      {/* Projects Carousel */}
      <Section delay={0.4} className="bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-indigo-950 dark:via-gray-900 dark:to-purple-950">
        <Container>
          <Carousel
            items={projects}
            title="Featured Projects"
            autoPlayInterval={5000}
          />
        </Container>
      </Section>

      {/* Repositories Carousel */}
      <Section delay={0.5} className="bg-gradient-to-br from-purple-50/50 via-white to-indigo-50/50 dark:from-purple-950 dark:via-gray-900 dark:to-indigo-950">
        <Container>
          <Carousel
            items={repositories}
            title="Open Source Contributions"
            autoPlayInterval={4000}
          />
        </Container>
      </Section>

      {/* Statistics Section */}
      <Section delay={0.6} className="bg-gradient-to-br from-gray-900 to-indigo-900 dark:from-gray-950 dark:to-indigo-950 text-white py-16">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center backdrop-blur-sm p-6 rounded-xl border border-white/10"
              >
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 dark:from-indigo-300 dark:to-purple-300 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-lg text-gray-200 dark:text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section delay={0.7} className="bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-indigo-950 dark:via-gray-900 dark:to-purple-950">
        <Container>
          <div className="text-center max-w-3xl mx-auto py-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Ready to Start a Project?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Let's collaborate to bring your ideas to life with cutting-edge technology and best practices
            </p>
            <Link
              href="/contact"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get in Touch
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
