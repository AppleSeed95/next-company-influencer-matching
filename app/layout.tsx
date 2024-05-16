"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { RecoilRoot } from "recoil";
import Analytics from "@/components/analytics";
// import { GoogleTagManager } from '@next/third-parties/google'
import { Suspense } from "react";


// import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="jp">
      <body className={inter.className}>
        {/* <GoogleTagManager gtmId="GTM-5RW3QBMN" /> */}

        <RecoilRoot>
          <Suspense>
            <Analytics />
            {children}
          </Suspense>
          {/* <Suspense fallback={<div>loading...</div>}>{children}</Suspense> */}
        </RecoilRoot>
      </body>
    </html>
  );
}
