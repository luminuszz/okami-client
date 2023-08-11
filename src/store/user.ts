import { atom } from "jotai";
import { getCurrentUserQuery } from "@/services/okami";
import { useQuerySlice } from "@/store/api";

export const userToken = atom<string | null>(() => localStorage.getItem("token") || null);

interface UseDetails {
  name: string;
  email: string;
  avatarImageUrl: string | null;
  id: string;
}

export const userDetails = atom<UseDetails | null>(null);

export function useUserDetails() {
  const { currentData, isLoading, error } = useQuerySlice<UseDetails>(getCurrentUserQuery);

  return {
    user: currentData,
    isLoading,
    error,
  };
}
