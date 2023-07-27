"use client";

import { atom } from "jotai";
import { useAtom } from "jotai/react";
import { atomFamily } from "jotai/utils";
import { useCallback, useEffect } from "react";
import { okamiService } from "@/services/okami";

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

type MutationPayload<Payload = any, Result = void> = {
  isLoading: boolean;
  error: any;
  lastUpdated: number;
  result: Result;
  status: "idle" | "error" | "pending" | "success";
  args: Payload;
};

export const okamiServerApiCache = atom<Cache>({});

export const querySliceAtom = atomFamily((queryId: string) =>
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

export const mutationAtom = atom<MutationPayload<any, any>>({
  isLoading: false,
  error: null,
  lastUpdated: 0,
  result: null,
  status: "idle",
  args: null,
});

export const mutationStateSelectorAtom = atom(
  (get) => get(mutationAtom),
  (get, set, args: Partial<MutationPayload>) => {
    const currentMutationState = get(mutationAtom);

    const newMutationState = {
      ...currentMutationState,
      ...args,
      lastUpdated: Date.now(),
    };

    set(mutationAtom, newMutationState);
  },
);

interface UseQueryPayloadOutPut<Result> extends Endpoint<Result> {
  refetch: () => void;
}

export function useQuerySlice<State>(query: string, isLazy = false) {
  const [queryState, updateQuery] = useAtom(querySliceAtom(query));

  const executeQuery = useCallback(() => {
    if (queryState.isLoading) return;

    updateQuery({ isLoading: true });

    okamiService
      .get(query)
      .then(({ data }) => updateQuery({ currentData: data }))
      .catch((error) => updateQuery({ error }))
      .finally(() => updateQuery({ isLoading: false }));
  }, [query, updateQuery]);

  useEffect(() => {
    if (isLazy) return;

    executeQuery();
  }, [executeQuery, isLazy]);

  return {
    ...queryState,
    refetch: executeQuery,
  } as UseQueryPayloadOutPut<State>;
}

type MutationExec<Payload, Result> = (args: Payload) => Promise<Result>;

type UseMutationOutput<Payload, Result> = [
  mutateTrigger: (args: Payload) => { unwrap: () => Promise<Result> },
  state: MutationPayload<Payload, Result>,
];

export function useMutationSlice<Payload, Result>(
  mutation: MutationExec<Payload, Result>,
  invalidateCache: string = "",
): UseMutationOutput<Payload, Result> {
  const [mutationState, updateMutation] = useAtom(mutationStateSelectorAtom);
  const [, setQuerySlice] = useAtom(querySliceAtom(invalidateCache));

  function makeInvalidation(queryString: string) {
    setQuerySlice({ isLoading: true });

    okamiService
      .get(queryString)
      .then(({ data }) => {
        setQuerySlice({
          currentData: data,
          cache: data,
        });
      })
      .catch((error) => {
        setQuerySlice({
          error,
        });
      })
      .finally(() => setQuerySlice({ isLoading: false }));
  }

  function mutate(args: Payload) {
    updateMutation({ isLoading: true, status: "pending" });

    const promise = mutation(args)
      .then((result: any) => {
        updateMutation({
          result,
          status: "success",
          error: null,
        });

        if (invalidateCache) makeInvalidation(invalidateCache);

        return result;
      })
      .catch((error) => {
        updateMutation({ error, status: "error" });

        return error;
      })
      .finally(() => updateMutation({ isLoading: false }));

    return {
      unwrap: async (): Promise<Result> => promise,
    };
  }

  return [mutate, mutationState as MutationPayload<Payload, Result>];
}
