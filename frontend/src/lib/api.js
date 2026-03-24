import axios from "axios";
import { API_BASE_URL } from "./config.js";
import { getToken } from "./auth.js";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const apiAuth = () => {
  // We create a per-call config so it stays in sync with localStorage.
  const token = getToken();
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const registerRequest = (body) => api.post("/auth/register", body);
export const loginRequest = (body) => api.post("/auth/login", body);

export const createSessionRequest = (body = {}) => {
  return api.post("/session/create", body, apiAuth());
};

export const joinSessionRequest = (sessionCode) => {
  return api.post("/session/join", { sessionCode }, apiAuth());
};

