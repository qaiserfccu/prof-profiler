import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';

export const metadata = { title: "Dr. Memoona · Practice" };

export default function MemoonaPracticePage() {
  return (
    <Section>
      <Container>
        <h1 className="text-3xl font-bold mb-4">Practice</h1>
        <p className="text-gray-700 dark:text-gray-300">
          Practice-related details will be added here.
        </p>
      </Container>
    </Section>
  );
}
