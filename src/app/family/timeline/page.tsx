'use client';

import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import { motion } from 'framer-motion';
import { FaLaptopCode } from 'react-icons/fa';

export default function FamilyTimeline() {
  const timelineEvents = [
    {
      year: '1991',
      events: [
        {
          title: "Birth of Rao Muhammad Qaiser Nadeem",
          description: "Born on July 24, 1991",
          icon: FaLaptopCode
        }
      ]
    },
    {
      year: '2009-2013',
      events: [
        {
          title: "Qaiser's University Education",
          description: "Bachelor of Computer Science at Forman Christian College University",
          icon: FaLaptopCode
        }
      ]
    },
    {
      year: '2014-2018',
      events: [
        {
          title: "Professional Career Beginnings",
          description: "Started career as Software Engineer in Pakistan",
          icon: FaLaptopCode
        }
      ]
    },
    {
      year: '2018-2021',
      events: [
        {
          title: "Senior IT Consultant",
          description: "MDC Business Management Services",
          icon: FaLaptopCode
        }
      ]
    },
    {
      year: '2021-2023',
      events: [
        {
          title: "Senior Software Engineer",
          description: "Injazat Data Systems Ltd",
          icon: FaLaptopCode
        }
      ]
    },
    {
      year: '2023-Present',
      events: [
        {
          title: "Senior Full Stack Developer",
          description: "Department of Culture and Tourism, Abu Dhabi",
          icon: FaLaptopCode
        }
      ]
    }
  ];

  return (
    <Section className="bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950 dark:via-indigo-950/30 dark:to-purple-950/50">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
              Family Timeline
            </h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              Our journey through the years
            </p>
          </div>

          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"></div>

            {/* Timeline Events */}
            <div className="space-y-12">
              {timelineEvents.map((timeEvent, index) => (
                <div key={timeEvent.year} className="relative pl-12">
                  {/* Year Marker */}
                  <div className="absolute left-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-4 h-4 bg-white dark:bg-gray-900 rounded-full"></div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white/80 dark:bg-gray-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm"
                  >
                    <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                      {timeEvent.year}
                    </div>
                    <div className="space-y-4">
                      {timeEvent.events.map((event, eventIndex) => (
                        <div key={event.title} className="flex items-start gap-4">
                          <event.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mt-1" />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                              {event.title}
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 mt-1">
                              {event.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
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
                This timeline represents key milestones in our family's journey. Each event marks a 
                significant moment that has contributed to our growth and success.
              </p>
            </motion.div>
          </div>
        </div>
      </Container>
    </Section>
  );
}