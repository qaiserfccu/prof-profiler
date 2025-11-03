import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';

export default function About() {
  const experiences = [
    {
      year: '2023 - 2025',
      company: 'Department of Culture and Tourism, Abu Dhabi',
      role: 'Senior Full Stack Developer',
      description:
        'Led development of applications across multiple platforms, including CRM, Tamm, and .Net Core. Implemented robust full-stack solutions and optimized application performance.',
    },
    {
      year: '2021 - 2023',
      company: 'Injazat Data Systems Ltd',
      role: 'Information Specialist - Senior (Software Engineer - JEE)',
      description:
        'Developed and maintained enterprise applications, implemented microservices architecture, and optimized system performance.',
    },
    {
      year: '2018 - 2021',
      company: 'MDC Business Management Services',
      role: 'Senior Information Technology Consultant',
      description:
        'Managed Kubernetes and Docker systems, developed .NET Core applications, and implemented frontend solutions using Angular and ReactJS.',
    },
    {
      year: '2014 - 2018',
      company: 'Pakistani Employers',
      role: 'Software Engineer',
      description:
        'Developed applications using .NET, MVC framework, and WinForms. Implemented frontend solutions and managed databases using MSSQL and MySQL.',
    },
  ];

  const education = [
    {
      year: '2009 - 2013',
      degree: 'Bachelor of Computer Science',
      school: 'Forman Christian College University',
      description:
        'Strong foundation in technical and programming disciplines from a prestigious institution in Lahore, Pakistan.',
    },
    {
      year: '2007 - 2009',
      degree: 'Intermediate of Computer Science',
      school: 'Govt Islamia College of Civilines',
      description:
        'Early foundation in computer science education from Lahore, Pakistan.',
    },
  ];

  return (
    <>
      <Section className="bg-gradient-to-b from-white to-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">About Me</h1>
            <p className="text-lg text-gray-600 mb-8">
              Based in Riyadh, SA, I'm a seasoned Full Stack Developer with extensive experience in designing and implementing scalable software solutions across multiple industries, including government and tourism. Proficient in backend development, microservices architecture, RESTful API design, and frontend frameworks such as ReactJS and AngularJS. I hold a Bachelor's degree in Computer Science from Forman Christian College University.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Skills</h2>
                <div className="space-y-2">
                  {[
                    'Backend Development (.NET, Node.js)',
                    'Frontend (Angular, React)',
                    'Microservices Architecture',
                    'RESTful API Design',
                    'Docker & Kubernetes',
                    'Cloud (AWS/Azure)',
                    'Database Design',
                    'DevOps & CI/CD'
                  ].map((skill) => (
                    <div
                      key={skill}
                      className="bg-white p-3 rounded-lg shadow-sm border border-gray-100"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">Interests</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Web Development</li>
                  <li>Cloud Architecture</li>
                  <li>UI/UX Design</li>
                  <li>Machine Learning</li>
                  <li>Open Source</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section delay={0.2}>
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Experience</h2>
            <div className="space-y-8">
              {experiences.map((exp) => (
                <div key={exp.company} className="border-l-4 border-blue-600 pl-4">
                  <div className="text-sm text-gray-500">{exp.year}</div>
                  <h3 className="text-xl font-semibold">{exp.role}</h3>
                  <div className="text-blue-600">{exp.company}</div>
                  <p className="mt-2 text-gray-600">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section delay={0.4}>
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Education</h2>
            <div className="space-y-8">
              {education.map((edu) => (
                <div key={edu.degree} className="border-l-4 border-green-600 pl-4">
                  <div className="text-sm text-gray-500">{edu.year}</div>
                  <h3 className="text-xl font-semibold">{edu.degree}</h3>
                  <div className="text-green-600">{edu.school}</div>
                  <p className="mt-2 text-gray-600">{edu.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}