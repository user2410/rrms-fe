import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from "react";

import "@fortawesome/fontawesome-free/css/all.min.css";
import '../assets/globals.css';
import ReactQueryContext from '@/context/react-query';

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
      <body className={inter.className}>
        <ReactQueryContext>
          {children}
        </ReactQueryContext>
      </body>
    </html>
  )
}
