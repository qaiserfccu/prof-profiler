'use client';

import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaLinkedin, FaCalendarAlt, FaCar, FaLanguage, FaPray } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function About() {
  const personalInfo = {
    location: 'Riyadh, SA',
    phone: '+966 56 1869834',
    email: 'qaiserfcc@gmail.com',
    linkedin: 'linkedin.com/in/qaiserfcc',
    dob: '24 July, 1991',
    civilStatus: 'Married',
    origin: 'Pakistan',
    religion: 'Islam',
    visaStatus: 'Visit Visa',
    drivingLicense: 'PAK, UAE',
    languages: 'Urdu, English & Arabic'
  };

  const skills = [
    {
      category: 'Backend Development',
      description: 'Highly skilled in architecting and developing robust backend systems using .NET (C#), Node.js, and TypeScript. Proficient in building secure, high-performance APIs, integrating complex business logic, and optimizing data flow between distributed microservices.',
      technologies: ['.NET Core', 'Node.js', 'TypeScript', 'C#', 'Python']
    },
    {
      category: 'Frontend Development',
      description: 'Proficient in developing responsive, user-friendly interfaces using AngularJS and ReactJS. Capable of integrating complex frontend logic with backend APIs while maintaining modular, maintainable code.',
      technologies: ['Angular', 'React', 'TypeScript', 'JavaScript', 'HTML/CSS']
    },
    {
      category: 'Microservices Architecture',
      description: 'Experienced in designing and implementing microservices-based architectures for scalable enterprise applications. Skilled in defining service boundaries, managing inter-service communication, and implementing secure API gateways.',
      technologies: ['Microservices', 'API Gateway', 'Service Mesh', 'Event-Driven Architecture']
    },
    {
      category: 'Cloud & DevOps',
      description: 'Skilled in deploying and managing cloud infrastructure on AWS and Azure, leveraging services like EC2, S3, RDS, and App Service. Hands-on experience with CI/CD pipelines, Docker, and Kubernetes.',
      technologies: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'CI/CD']
    },
    {
      category: 'Database Design',
      description: 'Expert in designing normalized relational databases, writing optimized SQL queries, and developing dynamic query engines. Proficient with Sequelize ORM, query optimization, and multi-language data mapping.',
      technologies: ['SQL Server', 'PostgreSQL', 'MongoDB', 'Redis', 'ORMs']
    },
    {
      category: 'Testing & Security',
      description: 'Authored Python-based frameworks for authorized load testing, endpoint scanning, and security validation in staging environments. Focused on identifying performance bottlenecks and ensuring API robustness.',
      technologies: ['Python Testing', 'Security Testing', 'Load Testing', 'API Testing']
    }
  ];

  const experiences = [
    {
      year: '2023 - 2025',
      company: 'Department of Culture and Tourism, Abu Dhabi',
      role: 'Senior Full Stack Developer',
      description: 'Led development of enterprise applications, implemented microservices architecture, and optimized application performance through debugging and system architecture enhancements. Collaborated with cross-departmental teams to ensure alignment with business objectives while maintaining high coding standards.'
    },
    {
      year: '2021 - 2023',
      company: 'Injazat Data Systems Ltd',
      role: 'Information Specialist - Senior (Software Engineer - JEE)',
      description: 'Developed and maintained applications across various platforms, including CRM, Tamm, and .Net Core. Implemented robust full-stack solutions, designed scalable software systems, and optimized application performance while collaborating with multidisciplinary teams.'
    },
    {
      year: '2018 - 2021',
      company: 'MDC Business Management Services',
      role: 'Senior Information Technology Consultant',
      description: 'Managed Kubernetes and Docker systems, developed .NET Core applications, and implemented frontend solutions using Angular and ReactJS. Promoted collaboration across teams and provided technical expertise while ensuring compliance with organizational best practices.'
    },
    {
      year: '2014 - 2018',
      company: 'Pakistani Employers',
      role: 'Software Engineer',
      description: 'Developed applications using .NET, MVC framework, and WinForms. Implemented frontend solutions and managed databases using MSSQL and MySQL. Contributed to Android application development and delivered comprehensive software solutions within defined deadlines.'
    }
  ];

  const education = [
    {
      year: '2009 - 2013',
      degree: 'Bachelor of Computer Science',
      school: 'Forman Christian College University',
      description: 'Strong foundation in technical and programming disciplines from a prestigious institution in Lahore, Pakistan.'
    },
    {
      year: '2007 - 2009',
      degree: 'Intermediate of Computer Science',
      school: 'Govt Islamia College of Civilines',
      description: 'Early foundation in computer science education from Lahore, Pakistan.'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950 dark:via-indigo-950/30 dark:to-purple-950/50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
                  Rao Muhammad Qaiser Nadeem
                </h1>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  {[
                    { icon: FaMapMarkerAlt, text: personalInfo.location },
                    { icon: FaPhone, text: personalInfo.phone },
                    { icon: FaEnvelope, text: personalInfo.email },
                    { icon: FaLinkedin, text: personalInfo.linkedin }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full md:w-1/3 bg-white/80 dark:bg-gray-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-indigo-100/20 dark:border-indigo-700/20">
                <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Personal Information
                </h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  {[
                    { icon: FaCalendarAlt, label: 'Date of Birth', value: personalInfo.dob },
                    { icon: FaPray, label: 'Religion', value: personalInfo.religion },
                    { icon: FaCar, label: 'Driving License', value: personalInfo.drivingLicense },
                    { icon: FaLanguage, label: 'Languages', value: personalInfo.languages }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <item.icon className="w-5 h-5 mt-1 text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <span className="font-medium">{item.label}:</span> {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
                Professional Summary
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Seasoned Fullstack Developer with extensive experience in designing and implementing
                scalable software solutions across multiple industries, including government and
                tourism. Proficient in backend development, microservices architecture, RESTful API design,
                and frontend frameworks such as ReactJS and AngularJS, with a strong focus on
                optimizing performance and ensuring seamless cross-platform functionality.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Career highlights include contributions to large-scale projects such as Ad Locker systems
                and applications for cultural and governmental departments, ensuring high coding
                standards and effective team collaboration. Actively seeking opportunities to lead and
                deliver innovative, user-centric software solutions while contributing to
                technological advancements in dynamic organizations.
              </p>
            </div>

            {/* Skills Section */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-8">
                Technical Expertise
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white/80 dark:bg-gray-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-indigo-100/20 dark:border-indigo-700/20 hover:shadow-xl transition-all"
                  >
                    <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                      {skill.category}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
                      {skill.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {skill.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* Experience Section */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-8">
                Professional Experience
              </h2>
              <div className="space-y-8">
                {experiences.map((exp, index) => (
                  <motion.div
                    key={exp.company}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-blue-600 before:to-purple-600 before:dark:from-blue-400 before:dark:to-purple-400 before:rounded-full"
                  >
                    <div className="bg-white/80 dark:bg-gray-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-blue-100/20 dark:border-blue-700/20">
                      <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{exp.year}</div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mt-2">{exp.role}</h3>
                      <div className="text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">{exp.company}</div>
                      <p className="mt-3 text-gray-700 dark:text-gray-300">{exp.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Education Section */}
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
                    className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-purple-600 before:to-blue-600 before:dark:from-purple-400 before:dark:to-blue-400 before:rounded-full"
                  >
                    <div className="bg-white/80 dark:bg-gray-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-purple-100/20 dark:border-purple-700/20">
                      <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{edu.year}</div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mt-2">{edu.degree}</h3>
                      <div className="text-lg font-medium bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">{edu.school}</div>
                      <p className="mt-3 text-gray-700 dark:text-gray-300">{edu.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Soft Skills Section */}
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-8">
                Soft Skills & Approach
              </h2>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white/80 dark:bg-gray-800/50 p-8 rounded-xl shadow-lg backdrop-blur-sm border border-indigo-100/20 dark:border-indigo-700/20"
              >
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  In addition to my technical proficiency, I'm known for maintaining a proactive and structured approach to development — from planning and design to deployment and optimization — ensuring that deliverables meet both technical and business objectives. My background as a Systems Analyst has strengthened my ability to understand organizational needs, translate them into actionable technical solutions, and ensure long-term scalability.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                  I also value leadership, mentorship, and continuous learning. I've guided junior developers, fostered collaborative team environments, and encouraged the adoption of modern technologies to improve efficiency. Above all, I believe in discipline, adaptability, and professional integrity, qualities that help me perform consistently in fast-paced and evolving technology environments.
                </p>
              </motion.div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}