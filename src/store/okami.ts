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

type MutationPayload<Payload = any, Result = void> = {
  isLoading: boolean;
  error: any;
  lastUpdated: number;
  result: Result;
  status: "idle" | "error" | "pending" | "success";
  args: Payload;
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

type MutationExec<Payload, Result> = (args: Payload) => Promise<Result>;

type UseMutationOutput<Payload, Result> = [
  mutateTrigger: (args: Payload) => { unwrap: () => Promise<Result> },
  state: MutationPayload<Payload, Result>,
];

export function useMutationSlice<Payload, Result>(
  mutation: MutationExec<Payload, Result>,
): UseMutationOutput<Payload, Result> {
  const [mutationState, updateMutation] = useAtom(mutationStateSelectorAtom);

  function mutate(args: Payload) {
    updateMutation({ isLoading: true, status: "pending" });

    const promise = mutation(args)
      .then((result: any) => {
        updateMutation({
          result,
          status: "success",
          error: null,
        });
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
