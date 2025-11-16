'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import { FaEnvelope, FaPhone, FaLinkedin, FaGithub, FaTwitter, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

interface ContactMethod {
  type: 'email' | 'phone' | 'linkedin' | 'github' | 'twitter' | 'location' | 'other';
  label: string;
  value: string;
  link?: string;
}

interface ContactContent {
  title: string;
  subtitle: string;
  contactMethods: ContactMethod[];
  availability?: string;
  formEnabled?: boolean;
}

export default function ContactPage() {
  const params = useParams();
  const userId = params.userId as string;
  const resumeId = params.resumeId as string;

  const [content, setContent] = useState<ContactContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formMessage, setFormMessage] = useState('');

  useEffect(() => {
    fetchContactContent();
  }, [userId, resumeId]);

  const fetchContactContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/portfolio/public?userId=${userId}&resumeId=${resumeId}&pageType=contact`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio content');
      }

      const data = await response.json();
      
      const parsedContent = typeof data.content === 'string' 
        ? JSON.parse(data.content) 
        : data.content;
      
      setContent(parsedContent);
    } catch (err) {
      console.error('Error fetching contact content:', err);
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const getContactIcon = (type: string) => {
    const icons: { [key: string]: any } = {
      email: FaEnvelope,
      phone: FaPhone,
      linkedin: FaLinkedin,
      github: FaGithub,
      twitter: FaTwitter,
      location: FaMapMarkerAlt,
    };
    return icons[type] || FaEnvelope;
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setFormMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          portfolioUserId: userId,
          portfolioResumeId: resumeId,
        }),
      });

      if (response.ok) {
        setFormStatus('success');
        setFormMessage('Message sent successfully! I\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setFormStatus('error');
        setFormMessage('Failed to send message. Please try again or use direct contact methods.');
      }
    } catch (err) {
      setFormStatus('error');
      setFormMessage('An error occurred. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">
          {error || 'Content not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {content.title}
          </h1>
          <p className="text-xl text-white/80">
            {content.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Availability */}
            {content.availability && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <FaClock className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-bold text-white">Availability</h2>
                </div>
                <p className="text-white/80">{content.availability}</p>
              </div>
            )}

            {/* Contact Methods */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
              <div className="space-y-4">
                {content.contactMethods.map((method, index) => {
                  const IconComponent = getContactIcon(method.type);
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <IconComponent className="w-6 h-6 text-white flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-white/70 text-sm mb-1">{method.label}</div>
                        {method.link ? (
                          <a
                            href={method.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-white/80 transition-colors"
                          >
                            {method.value}
                          </a>
                        ) : (
                          <div className="text-white">{method.value}</div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          {content.formEnabled !== false && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
              
              {formStatus === 'success' && (
                <div className="mb-4 p-4 bg-green-500/20 border border-green-500/40 rounded-lg text-white">
                  {formMessage}
                </div>
              )}
              
              {formStatus === 'error' && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/40 rounded-lg text-white">
                  {formMessage}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-white mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-white mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-white mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-white mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                    placeholder="Your message..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </Container>
    </div>
  );
}
