"use client";

import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import { DevTools } from "jotai-devtools";
import Head from "next/head";

interface WorkLayoutProps {
  children: ReactNode;
}

export default function WorkLayout({ children }: WorkLayoutProps) {
  return (
    <>
      <Head>
        <title>Okami</title>
        <meta name="description" content="Okami the Manga and Anime notifier" />
      </Head>

      <Box w="100vw" h="100%">
        {children}
        {process.env.NODE_ENV === "development" && <DevTools />}
      </Box>
    </>
  );
}
