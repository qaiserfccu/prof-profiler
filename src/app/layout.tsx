import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Professional Portfolio",
  description: "A professional portfolio showcasing expertise and achievements",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-sky-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-sky-900/20"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        <div className="fixed inset-0 bg-[url('/images/grid.png')] bg-center [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none"></div>
        {children}
      </body>
    </html>
  );
}
