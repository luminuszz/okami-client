import axios from "axios";
import { Work } from "@/services/okami/types";

export const okamiService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export async function getWorksUnread() {
  const { data } = await okamiService.get<Work[]>(
    "/works/fetch-for-workers-unread",
  );

  return data;
}

export * from "./types";
