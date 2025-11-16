/**
 * AI Content Generation Service
 * Uses free/open-source AI models to generate portfolio content
 */

import { PageType } from '../db/schema';

export interface ResumeData {
  resumeUrl: string;
  aiNotes?: string;
  linkedInUrl?: string;
}

export interface UserPhotos {
  profilePhoto?: string;
  portfolioPhotos: string[];
}

export interface GeneratedContent {
  title: string;
  content: string;
}

export interface PortfolioContent {
  home: GeneratedContent;
  about: GeneratedContent;
  portfolio: GeneratedContent;
  contact: GeneratedContent;
}

/**
 * Generate a random gradient theme CSS
 */
export function generateGradientTheme(): string {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
    'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    'linear-gradient(135deg, #f8b500 0%, #fceabb 100%)',
  ];

  return gradients[Math.floor(Math.random() * gradients.length)];
}

/**
 * Extract skills from resume content (mock implementation)
 */
function extractSkills(text: string): string[] {
  // Common skills to look for
  const commonSkills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++',
    'HTML', 'CSS', 'SQL', 'Git', 'Docker', 'AWS', 'Azure', 'Leadership',
    'Project Management', 'Communication', 'Problem Solving', 'Team Collaboration'
  ];

  return commonSkills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  ).slice(0, 8);
}

/**
 * Generate AI-powered portfolio content
 * This is a mock implementation - in production, integrate with Hugging Face, OpenAI, etc.
 */
export async function generatePortfolioContent(
  resumeData: ResumeData,
  userPhotos: UserPhotos
): Promise<PortfolioContent> {
  try {
    const mockResumeText = `
      Experienced Software Engineer with 5+ years in full-stack development.
      Expert in JavaScript, TypeScript, React, Node.js, and cloud technologies.
    `;

    const skills = extractSkills(mockResumeText);

    const home: GeneratedContent = {
      title: 'Welcome to My Portfolio',
      content: JSON.stringify({
        hero: {
          greeting: 'Hello, I am',
          name: 'Professional Developer',
          tagline: 'Building innovative solutions with modern technologies',
          description: 'Passionate software engineer with expertise in full-stack development.',
          backgroundImage: userPhotos.portfolioPhotos[0] || null
        }
      })
    };

    const about: GeneratedContent = {
      title: 'About Me',
      content: JSON.stringify({
        sections: [
          {
            heading: 'Professional Background',
            content: 'Dedicated software engineer with proven track record.',
            image: userPhotos.profilePhoto || userPhotos.portfolioPhotos[0]
          }
        ]
      })
    };

    const portfolio: GeneratedContent = {
      title: 'My Portfolio',
      content: JSON.stringify({
        projects: [
          {
            id: 1,
            title: 'E-Commerce Platform',
            description: 'Full-featured e-commerce platform.',
            technologies: skills.slice(0, 4)
          }
        ]
      })
    };

    const contact: GeneratedContent = {
      title: 'Get In Touch',
      content: JSON.stringify({
        introduction: 'Feel free to reach out!',
        contactMethods: []
      })
    };

    return { home, about, portfolio, contact };
  } catch (error) {
    console.error('Error generating portfolio content:', error);
    throw new Error('Failed to generate portfolio content');
  }
}

export async function generatePageContent(
  pageType: PageType,
  resumeData: ResumeData,
  userPhotos: UserPhotos
): Promise<GeneratedContent> {
  const allContent = await generatePortfolioContent(resumeData, userPhotos);
  return allContent[pageType];
}
