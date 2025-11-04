import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';

export const metadata = { title: "Dr. Hira · Education" };

export default function HiraEducationPage() {
  return (
    <Section>
      <Container>
        <h1 className="text-3xl font-bold mb-4">Education</h1>
        <p className="text-gray-700 dark:text-gray-300">
          Education details for Dr. Hira Nadeem will be added here.
        </p>
      </Container>
    </Section>
  );
}
