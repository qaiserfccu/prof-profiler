'use client';

import MemberLayout from '@/components/layout/MemberLayout';

const memberInfo = {
  name: 'Razia Afzal',
  role: 'Retired High School Teacher',
  navigationItems: [
    { name: 'Home', href: '/family/mother' },
    { name: 'Career', href: '/family/mother/career' },
    { name: 'Education', href: '/family/mother/education' },
    { name: 'Gallery', href: '/family/mother/gallery' }
  ]
};

export default function MotherLayout({
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