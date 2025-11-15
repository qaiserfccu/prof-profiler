'use client';

import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FaUserTie, FaChalkboardTeacher, FaUserMd, FaLaptopCode, FaFemale, FaPrescription } from 'react-icons/fa';

export default function Home() {
  const familyMembers = [
    {
      name: 'Rao Muhammad Afzal Nadeem',
      role: 'Retired Police Officer - Punjab Police',
      path: '/family/father',
      icon: FaUserTie,
      description: 'Dedicated his life to serving in the Punjab Police, ensuring law and order in the community.'
    },
    {
      name: 'Razia Afzal',
      role: 'Retired High School Teacher',
      path: '/family/mother',
      icon: FaChalkboardTeacher,
      description: 'Educated and inspired generations of students throughout her teaching career.'
      title: 'Software Engineer',
      description: 'Built responsive web applications and RESTful APIs. Collaborated with cross-functional teams to deliver high-quality solutions.',
      date: '2013 - 2018',
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
      name: 'Dr. Faisal Nadeem',
      role: 'MBBS Doctor - Pulmonologist',
      path: '/family/faisal',
      icon: FaUserMd,
      description: 'Specialized in pulmonology, helping patients with respiratory conditions.'
    },
    {
      name: 'Rao Muhammad Qaiser Nadeem',
      role: 'Senior Full Stack Developer',
      path: '/personal/about',
      icon: FaLaptopCode,
      description: 'Expert in full-stack development, creating innovative software solutions.'
    },
    {
      name: 'Dr. Memoona Umar',
      role: 'MBBS Doctor - Gynecologist',
      path: '/family/memoona',
      icon: FaFemale,
      description: "Specialized in gynecology, providing care for women's health."
    },
    {
      name: 'Dr. Hira Nadeem',
      role: 'Doctor of Pharmacy (Pharm D)',
      path: '/family/hira',
      icon: FaPrescription,
      description: 'Expert in pharmaceutical sciences and medication management.'
    }
  ];

  return (
    <>
      <Header />
      <Section className="bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950 dark:via-indigo-950/30 dark:to-purple-950/50">
        <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
              Rao's Family
            </h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              A family of professionals from Lahore, Pakistan, dedicated to serving society through various fields.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {familyMembers.map((member, index) => (
              <Link href={member.path} key={member.name}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/80 dark:bg-gray-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-indigo-100/20 dark:border-indigo-700/20 hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <member.icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                        {member.name}
                      </h3>
                      <div className="text-indigo-600 dark:text-indigo-400 font-medium mb-2">
                        {member.role}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {member.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-700 dark:text-gray-300">
              Together, we strive to make a positive impact in our respective fields, carrying forward our family's values of dedication, service, and excellence.
            </p>
          </div>
        </div>
      </Container>
      </Section>
      <Footer />
    </>
  );
}
