'use client';

import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import { motion } from 'framer-motion';
import { FaChalkboardTeacher, FaAward, FaBookReader } from 'react-icons/fa';

export default function MotherPage() {
  const achievements = [
    {
      title: "Best Teacher Award",
      year: "2018",
      description: "Recognized for excellence in teaching and student mentorship"
    },
    {
      title: "Academic Excellence Award",
      year: "2015",
      description: "Outstanding contribution to academic development"
    },
    {
      title: "Community Service Recognition",
      year: "2012",
      description: "Dedicated service in education and community development"
    }
  ];

  const experiences = [
    {
      role: "Senior High School Teacher",
      period: "2010-2020",
      description: "Led curriculum development and student counseling initiatives"
    },
    {
      role: "Subject Coordinator",
      period: "2000-2010",
      description: "Coordinated academic programs and mentored junior teachers"
    },
    {
      role: "High School Teacher",
      period: "1990-2000",
      description: "Taught multiple subjects and organized educational activities"
    }
  ];

  const subjects = [
    "Mathematics",
    "Science",
    "English Literature",
    "Social Studies"
  ];

  return (
    <Section className="bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950 dark:via-indigo-950/30 dark:to-purple-950/50">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
              Razia Afzal
            </h1>
            <div className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400">
              <FaChalkboardTeacher className="w-6 h-6" />
              <span className="text-xl">Retired High School Teacher</span>
            </div>
          </div>

          {/* Career Summary */}
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white/80 dark:bg-gray-800/50 p-8 rounded-xl shadow-lg backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Educational Journey
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Dedicated educator with over three decades of experience in shaping young minds. 
                Known for innovative teaching methods, strong student mentorship, and commitment 
                to academic excellence. Successfully guided numerous students toward their educational 
                and career goals.
              </p>
            </motion.div>
          </div>

          {/* Subjects Taught */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-8">
              Subjects Taught
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {subjects.map((subject, index) => (
                <motion.div
                  key={subject}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/80 dark:bg-gray-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm text-center"
                >
                  <FaBookReader className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
                  <div className="text-gray-800 dark:text-white font-medium">{subject}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-8">
              Achievements
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
                  <FaAward className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{achievement.title}</h3>
                  <div className="text-indigo-600 dark:text-indigo-400 text-sm mb-2">{achievement.year}</div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{achievement.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Experience Timeline */}
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-8">
              Teaching Journey
            </h2>
            <div className="space-y-6">
              {experiences.map((experience, index) => (
                <motion.div
                  key={experience.role}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-blue-600 before:to-purple-600 before:dark:from-blue-400 before:dark:to-purple-400 before:rounded-full"
                >
                  <div className="bg-white/80 dark:bg-gray-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm">
                    <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{experience.period}</div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mt-2">{experience.role}</h3>
                    <p className="mt-3 text-gray-700 dark:text-gray-300">{experience.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}