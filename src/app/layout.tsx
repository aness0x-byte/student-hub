import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SignInModal from '@/components/auth/SignInModal';

export const metadata: Metadata = {
  title: 'ستودنت هب | منصة الوسيط الحصري للمهام والخدمات الجامعية',
  description: 'منصة وساطة معتمدة تربط طلاب الجامعات النخبة بالشركات الناشئة لطلب الخدمات واكتساب الخبرة والمقابل المالي دون تواصل مباشر.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#07070C] text-white selection:bg-[#7F5AF0]/40 selection:text-white font-sans">
        <div className="bg-ambient-glow" />
        <div className="starfield" />
        <StoreProvider>
          <Navbar />
          <main className="flex-1 relative z-10">
            {children}
          </main>
          <Footer />
          <SignInModal />
        </StoreProvider>
      </body>
    </html>
  );
}
