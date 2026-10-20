import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SignInModal from '@/components/auth/SignInModal';

export const metadata: Metadata = {
  title: 'StudentHub | Exclusive Broker Platform for University Services',
  description: 'Certified brokerage platform connecting elite university students with startups for services and experience without direct contact.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <StoreProvider>
          <div className="glass-outer-shell">
            <div className="glass-frame">
              <Navbar />
              <main className="flex-1 w-full">
                {children}
              </main>
              <Footer />
            </div>
          </div>
          <SignInModal />
        </StoreProvider>
      </body>
    </html>
  );
}
