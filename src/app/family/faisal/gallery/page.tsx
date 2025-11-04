import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';

export const metadata = { title: "Dr. Faisal · Gallery" };

export default function FaisalGalleryPage() {
  return (
    <Section>
      <Container>
        <h1 className="text-3xl font-bold mb-4">Gallery</h1>
        <p className="text-gray-700 dark:text-gray-300">
          Photo gallery for Dr. Faisal Nadeem will be displayed here.
        </p>
      </Container>
    </Section>
  );
}
