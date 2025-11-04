import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = { title: 'Personal · Home' };

export default function PersonalHomePage() {
  return (
    <>
      <Section className="bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-blue-50/50 dark:from-indigo-950 dark:via-purple-950/30 dark:to-blue-950/50">
        <Container>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1 flex justify-center">
              <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-xl ring-4 ring-indigo-200/60 dark:ring-indigo-800/60">
                <Image src="/images/qaiser-profile.jpg" alt="Rao Muhammad Qaiser Nadeem" fill className="object-cover" />
              </div>
            </div>
            <div className="md:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent mb-3">
                Rao Muhammad Qaiser Nadeem
              </h1>
              <p className="text-indigo-700 dark:text-indigo-300 font-medium mb-4">Senior Full Stack Developer</p>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Building scalable web platforms with a focus on performance, developer experience,
                and clean architecture. Experienced across .NET, TypeScript, cloud-native systems,
                and modern frontend frameworks.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/personal/about" className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">About</Link>
                <Link href="/personal/portfolio" className="px-5 py-2 rounded-lg bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 dark:bg-transparent dark:text-indigo-300 dark:border-indigo-800">
                  Portfolio
                </Link>
                <Link href="/personal/contact" className="px-5 py-2 rounded-lg bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 dark:bg-transparent dark:text-indigo-300 dark:border-indigo-800">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section delay={0.2}>
        <Container>
          <h2 className="text-2xl font-bold mb-4">Highlights</h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <li className="p-4 rounded-xl bg-white/80 dark:bg-gray-800/50 border border-indigo-100/20 dark:border-indigo-700/20">.NET, Node.js, TypeScript</li>
            <li className="p-4 rounded-xl bg-white/80 dark:bg-gray-800/50 border border-indigo-100/20 dark:border-indigo-700/20">React, Next.js, Tailwind</li>
            <li className="p-4 rounded-xl bg-white/80 dark:bg-gray-800/50 border border-indigo-100/20 dark:border-indigo-700/20">Microservices, Docker, K8s</li>
          </ul>
        </Container>
      </Section>
    </>
  );
}
