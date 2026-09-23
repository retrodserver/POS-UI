import axios from "axios";
import { BASEURL } from "@/config/variables";

/**
 * Single shared Axios instance. All services must import this client.
 * No auth logic here — attach a future interceptor from features/auth if needed.
 */
const httpClient = axios.create({
  baseURL: BASEURL,
  timeout: 30_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = {
      message: error?.response?.data?.message ?? error?.message ?? "Request failed",
      status: error?.response?.status as number | undefined,
      data: error?.response?.data as unknown,
      raw: error,
    };
    return Promise.reject(normalized);
  },
);

export default httpClient;
