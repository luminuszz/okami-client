import axios from "axios";
import { Work } from "@/services/okami/types";

export const okamiService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getUnreadWorksQuery = "/work/fetch-for-workers-unread";

interface MarkWorkAsReadPayload {
  chapter: number;
  workId: string;
}

export async function markWorkAsReadCall({
  workId,
  chapter,
}: MarkWorkAsReadPayload) {
  const response = await okamiService.patch(`/work/${workId}/update-chapater`, {
    chapter,
  });

  return response.data;
}

export * from "./types";
