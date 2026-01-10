import axios from "axios";
import { getToken } from "./auth";

// ⚠️ HIER deine PC-IP eintragen (nicht localhost)
const BASE_URL = "http://192.168.178.34:4000/api";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
