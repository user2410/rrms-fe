import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from "react";

import "@fortawesome/fontawesome-free/css/all.min.css";
import '../assets/globals.css';
import ReactQueryContext from '@/context/react-query';
import NextAuthContext from '@/context/next-auth';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rental Management System',
  description: 'Rentals made easy.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head></head>
      <body className={inter.className}>
        <NextAuthContext>
          <ReactQueryContext>
            <Toaster/>
            {children}
          </ReactQueryContext>
        </NextAuthContext>
      </body>
    </html>
  )
}
