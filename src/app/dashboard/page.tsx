'use client';

import { useRouter } from 'next/navigation';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaUsers, FaUserShield, FaSignOutAlt, FaFileUpload, FaImage, FaEye, FaMagic, FaTrash } from 'react-icons/fa';
import { useState, useEffect } from 'react';

interface Resume {
  id: string;
  originalFilename: string;
  uploadedAt: string;
  portfolioGenerated: boolean;
}

interface PortfolioPhoto {
  id: string;
  photoUrl: string;
  uploadedAt: string;
}

interface UserStats {
  photoCount: number;
  resumeCount: number;
  canUploadMorePhotos: boolean;
  canUploadMoreResumes: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [portfolioPhotos, setPortfolioPhotos] = useState<PortfolioPhoto[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [aiNotes, setAiNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchResumes();
    fetchPortfolioPhotos();
    fetchStats();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await fetch('/api/upload/resume');
      if (response.ok) {
        const data = await response.json();
        setResumes(data.resumes || []);
      }
    } catch (err) {
      console.error('Failed to fetch resumes:', err);
    }
  };

  const fetchPortfolioPhotos = async () => {
    try {
      const response = await fetch('/api/portfolio/photos');
      if (response.ok) {
        const data = await response.json();
        setPortfolioPhotos(data.photos || []);
      }
    } catch (err) {
      console.error('Failed to fetch portfolio photos:', err);
    }
  };

  const fetchStats = async () => {
    try {
      // TODO: Create a dedicated stats endpoint
      const photosResponse = await fetch('/api/portfolio/photos');
      const resumesResponse = await fetch('/api/upload/resume');
      
      if (photosResponse.ok && resumesResponse.ok) {
        const photosData = await photosResponse.json();
        const resumesData = await resumesResponse.json();
        
        setStats({
          photoCount: photosData.count || 0,
          resumeCount: resumesData.resumes?.length || 0,
          canUploadMorePhotos: photosData.canUploadMore || false,
          canUploadMoreResumes: (resumesData.resumes?.length || 0) < 2,
        });
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!stats?.canUploadMoreResumes) {
      setError('Maximum 2 resumes allowed. Please delete an existing resume first.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      if (aiNotes) {
        formData.append('aiNotes', aiNotes);
      }

      const response = await fetch('/api/upload/resume', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSuccess('Resume uploaded successfully!');
        setAiNotes('');
        await fetchResumes();
        await fetchStats();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to upload resume');
      }
    } catch (err) {
      setError('An error occurred while uploading');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!stats?.canUploadMorePhotos) {
      setError('Maximum 3 portfolio photos allowed. Please delete a photo first.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await fetch('/api/portfolio/photos', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSuccess('Photo uploaded successfully!');
        await fetchPortfolioPhotos();
        await fetchStats();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to upload photo');
      }
    } catch (err) {
      setError('An error occurred while uploading');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      const response = await fetch(`/api/portfolio/photos?id=${photoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Photo deleted successfully!');
        await fetchPortfolioPhotos();
        await fetchStats();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete photo');
      }
    } catch (err) {
      setError('An error occurred while deleting');
      console.error('Delete error:', err);
    }
  };

  const handleGeneratePortfolio = async (resumeId: string) => {
    setIsGenerating(resumeId);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/portfolio/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeId }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess('Portfolio generated successfully!');
        await fetchResumes();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to generate portfolio');
      }
    } catch (err) {
      setError('An error occurred while generating portfolio');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <Section className="bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950 dark:via-indigo-950/30 dark:to-purple-950/50 min-h-screen">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>

          {/* Notifications */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-200 rounded-lg"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-800 dark:text-green-200 rounded-lg"
            >
              {success}
            </motion.div>
          )}

          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/80 dark:bg-gray-800/50 p-4 rounded-lg shadow-md backdrop-blur-sm border border-indigo-100/20 dark:border-indigo-700/20"
              >
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.resumeCount}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Resumes</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white/80 dark:bg-gray-800/50 p-4 rounded-lg shadow-md backdrop-blur-sm border border-indigo-100/20 dark:border-indigo-700/20"
              >
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.photoCount}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Photos</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 dark:bg-gray-800/50 p-4 rounded-lg shadow-md backdrop-blur-sm border border-indigo-100/20 dark:border-indigo-700/20"
              >
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{2 - stats.resumeCount}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Slots Left</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white/80 dark:bg-gray-800/50 p-4 rounded-lg shadow-md backdrop-blur-sm border border-indigo-100/20 dark:border-indigo-700/20"
              >
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{3 - stats.photoCount}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Photo Slots</div>
              </motion.div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Resume Upload Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 dark:bg-gray-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-indigo-100/20 dark:border-indigo-700/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FaFileUpload className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Resume Upload
                </h2>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  AI Notes (Optional)
                </label>
                <textarea
                  value={aiNotes}
                  onChange={(e) => setAiNotes(e.target.value)}
                  placeholder="Add any additional notes or context for AI portfolio generation..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={4}
                />
              </div>

              <label
                className={`flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
                  stats?.canUploadMoreResumes
                    ? 'border-indigo-300 dark:border-indigo-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,.md"
                  onChange={handleResumeUpload}
                  disabled={!stats?.canUploadMoreResumes || isUploading}
                  className="hidden"
                />
                <FaFileUpload className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {isUploading ? 'Uploading...' : stats?.canUploadMoreResumes ? 'Upload Resume (PDF, DOCX, TXT, MD)' : 'Maximum resumes reached'}
                </span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Maximum 2 resumes • Up to 10MB each
              </p>
            </motion.div>

            {/* Portfolio Photos Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white/80 dark:bg-gray-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-indigo-100/20 dark:border-indigo-700/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <FaImage className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Portfolio Photos
                </h2>
              </div>

              <label
                className={`flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg transition-colors cursor-pointer mb-4 ${
                  stats?.canUploadMorePhotos
                    ? 'border-purple-300 dark:border-purple-600 hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
                }`}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoUpload}
                  disabled={!stats?.canUploadMorePhotos || isUploading}
                  className="hidden"
                />
                <FaImage className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {isUploading ? 'Uploading...' : stats?.canUploadMorePhotos ? 'Upload Photo (JPG, PNG, WebP)' : 'Maximum photos reached'}
                </span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Maximum 3 photos • Up to 5MB each
              </p>

              {/* Photo Grid */}
              <div className="grid grid-cols-3 gap-2">
                {portfolioPhotos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.photoUrl}
                      alt="Portfolio"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Resumes List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 dark:bg-gray-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-indigo-100/20 dark:border-indigo-700/20 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Your Resumes
            </h2>
            
            {resumes.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                No resumes uploaded yet. Upload a resume to get started!
              </p>
            ) : (
              <div className="space-y-4">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        {resume.originalFilename}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!resume.portfolioGenerated ? (
                        <button
                          onClick={() => handleGeneratePortfolio(resume.id)}
                          disabled={isGenerating === resume.id}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all disabled:opacity-50"
                        >
                          <FaMagic className="w-4 h-4" />
                          {isGenerating === resume.id ? 'Generating...' : 'Generate Portfolio'}
                        </button>
                      ) : (
                        <button
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-lg transition-all"
                        >
                          <FaEye className="w-4 h-4" />
                          View Portfolio
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/family">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/80 dark:bg-gray-800/50 p-8 rounded-xl shadow-lg backdrop-blur-sm border border-indigo-100/20 dark:border-indigo-700/20 hover:shadow-xl transition-all cursor-pointer"
              >
                <FaUsers className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Family Pages
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Access and manage family member portfolios
                </p>
              </motion.div>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="bg-white/80 dark:bg-gray-800/50 p-8 rounded-xl shadow-lg backdrop-blur-sm border border-indigo-100/20 dark:border-indigo-700/20"
            >
              <FaUserShield className="w-12 h-12 text-green-600 dark:text-green-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Your Role
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Superuser - Full access to all family content
              </p>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
