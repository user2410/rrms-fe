import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from "react";

import '../assets/globals.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

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
      <body className={inter.className}>{children}</body>
    </html>
  )
}
