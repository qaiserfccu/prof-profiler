'use client';

import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import { motion } from 'framer-motion';
import { FaUserMd, FaHeartbeat, FaBriefcaseMedical } from 'react-icons/fa';

export default function MemoonaPage() {
  const specializations = [
    {
      title: "Gynecology",
      description: "Expert in women's reproductive health"
    },
    {
      title: "Obstetrics",
      description: "Specialized care during pregnancy and childbirth"
    },
    {
      title: "Women's Health",
      description: "Comprehensive women's healthcare services"
    },
    {
      title: "Prenatal Care",
      description: "Specialized care for expectant mothers"
    }
  ];

  const education = [
    {
      degree: "Fellowship in Gynecology",
      institution: "Premier Medical Institute",
      year: "2018-2020",
      description: "Advanced specialization in women's health"
    },
    {
      degree: "MBBS",
      institution: "Medical University",
      year: "2010-2015",
      description: "Foundation in medical sciences and clinical practice"
    }
  ];

  const achievements = [
    {
      title: "Research Publication",
      year: "2021",
      description: "Published research on women's health innovations"
    },
    {
      title: "Excellence in Patient Care",
      year: "2019",
      description: "Recognition for outstanding maternal care"
    },
    {
      title: "Medical Conference Speaker",
      year: "2020",
      description: "Featured speaker at gynecology conference"
    }
  ];

  return (
    <Section className="bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950 dark:via-indigo-950/30 dark:to-purple-950/50">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
              Dr. Memoona Umar
            </h1>
            <div className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400">
              <FaUserMd className="w-6 h-6" />
              <span className="text-xl">MBBS Doctor - Gynecologist</span>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white/80 dark:bg-gray-800/50 p-8 rounded-xl shadow-lg backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Professional Summary
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Dedicated gynecologist with expertise in women's health and maternal care. 
                Committed to providing comprehensive healthcare services with a focus on 
                patient comfort and well-being. Known for exceptional care delivery and 
                contributions to women's health research.
              </p>
            </motion.div>
          </div>

          {/* Specializations */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-8">
              Areas of Expertise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {specializations.map((spec, index) => (
                <motion.div
                  key={spec.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/80 dark:bg-gray-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm"
                >
                  <FaHeartbeat className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{spec.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{spec.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-8">
              Education
            </h2>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <motion.div
                  key={edu.degree}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-blue-600 before:to-purple-600 before:dark:from-blue-400 before:dark:to-purple-400 before:rounded-full"
                >
                  <div className="bg-white/80 dark:bg-gray-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm">
                    <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{edu.year}</div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mt-2">{edu.degree}</h3>
                    <div className="text-lg font-medium text-indigo-600 dark:text-indigo-400">{edu.institution}</div>
                    <p className="mt-3 text-gray-700 dark:text-gray-300">{edu.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-8">
              Professional Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/80 dark:bg-gray-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm"
                >
                  <FaBriefcaseMedical className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{achievement.title}</h3>
                  <div className="text-indigo-600 dark:text-indigo-400 text-sm mb-2">{achievement.year}</div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{achievement.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}