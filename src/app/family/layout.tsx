import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ReactNode } from 'react';

export default function FamilyLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Family layout only wraps top-level family pages.
  // Member subroutes use their own MemberLayout which provides MemberHeader.
  // This layout is NOT used for /family/father/*, /family/mother/*, etc.
  // Those routes use their own layout.tsx files that wrap with MemberLayout.
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        {children}
      </main>
      <Footer />
    </>
  );
}