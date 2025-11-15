'use client';

import MemberHeader from '@/components/layout/MemberHeader';

interface MemberLayoutProps {
  children: React.ReactNode;
  memberInfo: {
    name: string;
    role: string;
    navigationItems: Array<{
      name: string;
      href: string;
    }>;
  };
}

export default function MemberLayout({
  children,
  memberInfo,
}: MemberLayoutProps) {
  return (
    <>
      <MemberHeader 
        name={memberInfo.name}
        role={memberInfo.role}
        navigationItems={memberInfo.navigationItems}
      />
      <main className="min-h-screen pt-16">
        {children}
      </main>
    </>
  );
}