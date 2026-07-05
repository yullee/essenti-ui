import '@essenti-ui/ui/styles.css';
import './globals.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'essenti-ui',
  description: 'React design system library',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
