import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from "react";
import { Toaster } from 'react-hot-toast';

import NextAuthContext from '@/context/next-auth';
import ReactQueryContext from '@/context/react-query';
import { ManagedUIContext } from '@/context/ui.context';
import GoogleMapContext from '@/context/google-map';
import ManagedModal from '@/components/complex/managed-modal';

import '@fortawesome/fontawesome-free/css/all.min.css';
import '../assets/globals.css';
import 'swiper/css';
import 'swiper/css/navigation';
import "swiper/css/grid";
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rental Management System',
  description: 'Rentals made easy.',
};

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
          <GoogleMapContext>
            <ReactQueryContext>
              <ManagedUIContext>
                <Toaster />
                <ManagedModal />
                  {children}
              </ManagedUIContext>
            </ReactQueryContext>
          </GoogleMapContext>
        </NextAuthContext>
      </body>
    </html>
  );
}
