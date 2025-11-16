/**
 * Database Seeding Script
 * Inserts sample data for development and testing
 */

import { initializeDatabase } from './init';
import { createUser, createResume, createPortfolioPhoto } from './services';

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Initialize database first
    const initialized = await initializeDatabase();
    if (!initialized) {
      throw new Error('Failed to initialize database');
    }

    // Create sample user
    console.log('Creating sample user...');
    const user = await createUser({
      email: 'demo@example.com',
      passwordHash: '$2b$10$example.hash.for.demo.user',
      name: 'Demo User',
      role: 'user',
      emailVerified: true,
    });
    console.log(`✅ User created: ${user.id}`);

    // Create sample portfolio photos
    console.log('Creating sample portfolio photos...');
    const photo1 = await createPortfolioPhoto({
      userId: user.id,
      photoUrl: 'https://example.com/demo-photo1.jpg',
    });
    const photo2 = await createPortfolioPhoto({
      userId: user.id,
      photoUrl: 'https://example.com/demo-photo2.jpg',
    });
    console.log(`✅ Photos created: ${photo1.id}, ${photo2.id}`);

    // Create sample resumes
    console.log('Creating sample resumes...');
    const resume1 = await createResume({
      userId: user.id,
      resumeUrl: 'https://example.com/demo-resume1.pdf',
      originalFilename: 'demo-resume-software-engineer.pdf',
      aiNotes: 'Experienced software engineer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies.',
    });
    const resume2 = await createResume({
      userId: user.id,
      resumeUrl: 'https://example.com/demo-resume2.pdf',
      originalFilename: 'demo-resume-data-scientist.pdf',
      aiNotes: 'Data scientist with expertise in machine learning, Python, and big data analytics. Passionate about AI-driven solutions.',
    });
    console.log(`✅ Resumes created: ${resume1.id}, ${resume2.id}`);

    console.log('🎉 Database seeded successfully!');
    console.log(`Sample user email: ${user.email}`);
    console.log('You can now test the application with this data.');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}