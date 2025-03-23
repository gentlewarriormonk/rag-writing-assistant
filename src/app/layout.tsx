import './globals.css';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

// Load Inter font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kaku - AI Writing Assistant',
  description: 'Generate content in your authentic writing style',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} font-sans bg-[#121212] text-white`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
