'use client';

import MemberLayout from '@/components/layout/MemberLayout';

const memberInfo = {
  name: 'Rao Muhammad Afzal Nadeem',
  role: 'Retired Police Officer - Punjab Police',
  navigationItems: [
    { name: 'Home', href: '/family/father' },
    { name: 'Career', href: '/family/father/career' },
    { name: 'Achievements', href: '/family/father/achievements' },
    { name: 'Gallery', href: '/family/father/gallery' }
  ]
};

export default function FatherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MemberLayout memberInfo={memberInfo}>
      {children}
    </MemberLayout>
  );
}