import './globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });
const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  //metadataBase: new URL('https://ric-sau.kallanroy.xyz'),
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  title: 'Research & Innovation Center - Leading Technology Research',
  description: 'Advanced research and innovation center focusing on cutting-edge technology, AI, machine learning, and software engineering solutions.',
  keywords: 'research, innovation, technology, AI, machine learning, software engineering',
  authors: [{ name: 'Research & Innovation Center' }],
  creator: 'Research & Innovation Center',
  publisher: 'Research & Innovation Center',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ric-sau.kallanroy.xyz',
    title: 'Research & Innovation Center',
    description: 'Leading technology research and innovation center',
    siteName: 'Research & Innovation Center',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Research & Innovation Center',
    description: 'Leading technology research and innovation center',
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}