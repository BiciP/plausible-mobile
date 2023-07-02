import axios from "axios";

import { useApiContext } from "../context/auth";

export function useAxios() {
  const { apiKey, baseUrl } = useApiContext();

  const client = axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    }
  });

  return client;
}