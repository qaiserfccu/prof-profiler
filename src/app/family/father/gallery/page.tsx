import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';

export const metadata = { title: "Father · Gallery" };

export default function FatherGalleryPage() {
  return (
    <Section>
      <Container>
        <h1 className="text-3xl font-bold mb-4">Gallery</h1>
        <p className="text-gray-700 dark:text-gray-300">
          Photo gallery for Rao Muhammad Afzal Nadeem will be displayed here.
        </p>
      </Container>
    </Section>
  );
}
