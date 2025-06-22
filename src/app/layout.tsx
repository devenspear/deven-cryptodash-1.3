import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';
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
      <head>
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" 
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.className} gradient-bg min-h-screen`}>
        <Providers>
          <AuthGuard>
            {children}
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