import axios from "axios";

export const okamiService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

okamiService.interceptors.request.use((request) => {
  const token = localStorage.getItem("token");

  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

okamiService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export const getUnreadWorksQuery = "/work/fetch-for-workers-unread";
export const getReadWorksQuery = "/work/fetch-for-workers-read";
export const refreshWorkStatusQuery = "/work/refresh-chapters";
export const getCurrentUserQuery = "/auth/user/me";

interface MarkWorkAsReadPayload {
  chapter: number;
  workId: string;
}

export async function markWorkAsReadCall({ workId, chapter }: MarkWorkAsReadPayload) {
  const response = await okamiService.patch(`/work/${workId}/update-chapater`, {
    chapter,
  });

  return response.data;
}

interface UpdateWorkInput {
  id: string;
  name?: string;
  chapter?: number;
  url?: string;
}

interface MakeLoginInput {
  email: string;
  password: string;
}

export async function updateWorkCall({ id, ...data }: UpdateWorkInput) {
  const response = await okamiService.put(`/work/update-work/${id}`, data);

  return response.data;
}

export async function uploadWorkImageCall(data: FormData) {
  const response = await okamiService.post(`/work/upload-work-image/${data.get("id")}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}

export async function markWorkAsFinishedCall(workId: string) {
  const { data } = await okamiService.patch(`/work/mark-finished/${workId}`);

  return data;
}

export async function makeLoginCall(data: MakeLoginInput) {
  const response = await okamiService.post("/auth/login", data);

  return response.data;
}

export * from "./types";
