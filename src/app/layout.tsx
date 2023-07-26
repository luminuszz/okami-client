"use client";

import { Inter } from "next/font/google";
import { Providers } from "@/app/providers";
import React from "react";
import { ColorModeScript, Flex } from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
