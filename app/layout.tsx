import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import React from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import AuthProvider from '@/components/AuthProvider/AuthProvider';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'NoteHub - Manage Your Notes',
  description:
    'NoteHub is a simple and efficient application for managing personal notes.',
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            {children}
            <Footer />

            {/* ТІЛЬКИ SLOT, БЕЗ MODAL WRAPPER */}
            {modal}
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
