"use client";

import { atom, PrimitiveAtom } from "jotai";
import { useAtom, useAtomValue } from "jotai/react";
import { atomFamily } from "jotai/utils";
import { useEffect } from "react";
import { okamiService } from "@/services/okami";
import { cloneDeep } from "lodash";

interface Endpoint<Data = any> {
  currentData: Data;
  isLoading: boolean;
  error: any | null;
  lastUpdated: number;
  cache: Data | null;
}

type OptionalEndpoint<Data> = Partial<Endpoint<Data>>;

type Cache = Record<string, Endpoint>;

const defaultQueryState = {
  currentData: null,
  isLoading: false,
  error: null,
  lastUpdated: 0,
  cache: null,
};

type QueryPayload = {
  queryString: string;
  data: OptionalEndpoint<any>;
};

export const okamiServerApiCache = atom<Cache>({});

export const querySlice = atomFamily((queryId: string) =>
  atom(
    (get) => get(okamiServerApiCache)[queryId] || defaultQueryState,
    (get, set, args: Partial<Endpoint>) => {
      const currentCache =
        get(okamiServerApiCache)[queryId] ?? defaultQueryState;

      const newCache = { ...currentCache, ...args, lastUpdated: Date.now() };

      set(okamiServerApiCache, {
        ...get(okamiServerApiCache),
        [queryId]: newCache,
      });
    },
  ),
);

export function useQuerySlice<State>(query: string) {
  const [queryState, updateQuery] = useAtom(querySlice(query));

  useEffect(() => {
    okamiService
      .get(query)
      .then(({ data }) => updateQuery({ currentData: data }))
      .catch((error) => updateQuery({ error }))
      .finally(() => updateQuery({ isLoading: false }));
  }, [query, updateQuery]);

  return queryState as Endpoint<State>;
}
