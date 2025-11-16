import { notFound } from 'next/navigation';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/security/jwt';
import {
  findGeneratedPortfolioByResumeId,
  findPortfolioThemeByPortfolioId,
  findUserById,
} from '@/lib/db/services';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    userId: string;
    resumeId: string;
  }>;
}

export default async function PortfolioLayout({ children, params }: LayoutProps) {
  const { userId, resumeId } = await params;

  // Fetch portfolio data
  const portfolio = await findGeneratedPortfolioByResumeId(resumeId);
  
  if (!portfolio || portfolio.userId !== userId) {
    notFound();
  }

  // Fetch theme
  const theme = await findPortfolioThemeByPortfolioId(portfolio.id);
  const gradientCss = theme?.gradientCss || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

  // Check if user is logged in
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  let isLoggedIn = false;
  let isOwner = false;

  if (token) {
    const payload = verifyJWT(token);
    if (payload) {
      isLoggedIn = true;
      isOwner = payload.sub === userId;
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: gradientCss,
      }}
    >
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                href={`/portfolio/${userId}/${resumeId}/home`}
                className="text-white hover:text-white/80 transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                href={`/portfolio/${userId}/${resumeId}/about`}
                className="text-white hover:text-white/80 transition-colors font-medium"
              >
                About
              </Link>
              <Link
                href={`/portfolio/${userId}/${resumeId}/projects`}
                className="text-white hover:text-white/80 transition-colors font-medium"
              >
                Projects
              </Link>
              <Link
                href={`/portfolio/${userId}/${resumeId}/contact`}
                className="text-white hover:text-white/80 transition-colors font-medium"
              >
                Contact
              </Link>
            </div>

            {isLoggedIn && isOwner && (
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg transition-all border border-white/30"
              >
                Back to Dashboard
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-md border-t border-white/20 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-white/80">
          <p>© {new Date().getFullYear()} Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
