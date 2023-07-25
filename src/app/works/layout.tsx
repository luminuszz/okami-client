"use client";

import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import { DevTools } from "jotai-devtools";

interface WorkLayoutProps {
  children: ReactNode;
}

export default function WorkLayout({ children }: WorkLayoutProps) {
  return (
    <Box w="100vw" h="full" backgroundColor="blue.900">
      {children}

      <DevTools />
    </Box>
  );
}
