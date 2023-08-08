"use client";

import { Box, HStack } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { DevTools } from "jotai-devtools";
import Head from "next/head";
import { Navbar } from "@/components/NavBar";

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
        <HStack alignItems="flex-start">
          <Navbar />
          {children}
        </HStack>

        {process.env.NODE_ENV === "development" && <DevTools />}
      </Box>
    </>
  );
}
