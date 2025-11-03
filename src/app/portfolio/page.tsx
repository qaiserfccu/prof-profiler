import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import Image from 'next/image';
import Link from 'next/link';
import GithubProjects from '@/components/ui/GithubProjects';
import { githubProjects } from '@/data/github-projects';

export default function Portfolio() {
  const projects = [
    {
      title: 'Department of Culture and Tourism Applications',
      description:
        'Led the development and maintenance of applications across multiple platforms, including CRM, Tamm, and .Net Core. Implemented robust full-stack solutions and optimized application performance.',
      tags: ['.NET Core', 'CRM', 'Microservices', 'React', 'Angular'],
      image: '/images/project1.jpg',
    },
    {
      title: 'Enterprise System Architecture - Injazat',
      description:
        'Designed and built scalable software systems to support cross-departmental initiatives. Implemented microservices architecture and optimized application performance.',
      tags: ['Microservices', 'Docker', 'Kubernetes', 'API Design', 'Cloud Architecture'],
      image: '/images/project2.jpg',
    },
    {
      title: 'Kubernetes & Docker Implementation - MDC',
      description:
        'Oversaw the implementation and management of Kubernetes and Docker systems, ensuring optimal container orchestration and application deployment processes.',
      tags: ['Kubernetes', 'Docker', 'DevOps', 'CI/CD', 'Cloud'],
      image: '/images/project3.jpg',
    },
    {
      title: 'Enterprise Applications Development',
      description:
        'Developed and maintained applications using .NET, MVC framework, and various frontend technologies. Implemented database management solutions using MSSQL and MySQL.',
      tags: ['.NET', 'TypeScript', 'SQL', 'React', 'Angular'],
      image: '/images/project4.jpg',
    },
  ];

  return (
    <>
      <Section className="bg-gradient-to-b from-white to-gray-50">
        <Container>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Portfolio</h1>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl">
            Explore my recent projects that showcase my expertise in web development,
            UI/UX design, and problem-solving capabilities.
          </p>
        </Container>
      </Section>

      <Section delay={0.2}>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div
                key={project.title}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48 w-full bg-gray-200">
                  <Image
                    src={`/images/portfolio${index + 1}.jpg`}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section delay={0.4}>
        <Container>
          <h2 className="text-3xl font-bold mb-8">Open Source Projects</h2>
          <GithubProjects projects={githubProjects} />
        </Container>
      </Section>

      <Section delay={0.6}>
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Want to work together?</h2>
            <p className="text-gray-600 mb-8">
              I'm always open to discussing new projects and opportunities.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}