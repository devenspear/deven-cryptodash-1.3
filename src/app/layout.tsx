import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';
import { Navbar } from "@/components/Navbar";
import { AuthGuard } from "@/components/AuthGuard";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Deven Crypto Dashboard',
  description: 'Deven\'s personal cryptocurrency portfolio tracking and management dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} gradient-bg min-h-screen`}>
        <Providers>
          <AuthGuard>
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </AuthGuard>
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'card-gradient text-white',
              duration: 4000,
            }}
          />
        </Providers>
      </body>
    </html>
  );
} 