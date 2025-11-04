import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';

export const metadata = { title: "Mother · Research" };

export default function MotherResearchPage() {
  return (
    <Section>
      <Container>
        <h1 className="text-3xl font-bold mb-4">Research</h1>
        <p className="text-gray-700 dark:text-gray-300">
          Research contributions and publications, if any, will be added here.
        </p>
      </Container>
    </Section>
  );
}
