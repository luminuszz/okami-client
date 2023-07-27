"use client";

import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import { DevTools } from "jotai-devtools";

interface WorkLayoutProps {
  children: ReactNode;
}

export default function WorkLayout({ children }: WorkLayoutProps) {
  return (
    <Box w="100vw" h="100%">
      {children}
      {process.env.NODE_ENV === "development" && <DevTools />}
    </Box>
  );
}
