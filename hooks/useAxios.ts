import axios from "axios";
import { useAtom } from "jotai";

import { requestsAtom } from "../store";
import { useApiContext } from "../context/auth";

export function useAxios() {
  const { apiKey, baseUrl } = useApiContext();
  const [, setRequests] = useAtom(requestsAtom);

  const client = axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    }
  });

  client.interceptors.request.use(async (config) => {
    setRequests((r: number[]) => [...r, Date.now()]);
    return config;
  });

  return client;
}