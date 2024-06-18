
import Image from "next/image";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="h-screen">
      <div className="container h-full px-6 py-24">
        <div
          className="flex h-full flex-wrap items-center justify-center lg:justify-between shadow-md">
          <div className="relative hidden md:flex h-full mb-12 md:mb-0 md:w-8/12 lg:w-6/12">
            <Image
              src="/img/login.png"
              fill
              objectFit="cover"
              alt="Authentication"
              className="inset-0"
            />
          </div>
          <div className="md:w-8/12 lg:ms-6 lg:w-5/12">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};
