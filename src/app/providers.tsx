"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { createStore } from "jotai";
import { Provider } from "jotai/react";

const jotaiStore = createStore();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider>
        <Provider store={jotaiStore}>{children}</Provider>
      </ChakraProvider>
    </CacheProvider>
  );
}
