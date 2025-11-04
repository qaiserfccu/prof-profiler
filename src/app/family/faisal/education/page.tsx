import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';

export const metadata = { title: "Dr. Faisal · Education" };

export default function FaisalEducationPage() {
  return (
    <Section>
      <Container>
        <h1 className="text-3xl font-bold mb-4">Education</h1>
        <p className="text-gray-700 dark:text-gray-300">
          Education details for Dr. Faisal Nadeem will be added here.
        </p>
      </Container>
    </Section>
  );
}
