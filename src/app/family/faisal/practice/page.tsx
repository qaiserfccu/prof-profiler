import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';

export const metadata = { title: "Dr. Faisal · Practice" };

export default function FaisalPracticePage() {
  return (
    <Section>
      <Container>
        <h1 className="text-3xl font-bold mb-4">Practice</h1>
        <p className="text-gray-700 dark:text-gray-300">
          Medical practice details will be added here.
        </p>
      </Container>
    </Section>
  );
}
