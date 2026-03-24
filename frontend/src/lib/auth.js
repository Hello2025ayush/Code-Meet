const TOKEN_KEY = "code_meet_token";
const USER_KEY = "code_meet_user";

const decodeJwtPayload = (token) => {
  try {
    const payload = token?.split(".")?.[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(normalized);
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getCurrentUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (error) {
      localStorage.removeItem(USER_KEY);
    }
  }

  try {
    const payload = decodeJwtPayload(getToken());
    if (!payload) return null;

    return {
      id: payload.userId,
      name: payload.name,
      email: payload.email,
    };
  } catch (error) {
    return null;
  }
};

export const setCurrentUser = (user) => {
  if (!user) {
    localStorage.removeItem(USER_KEY);
    return;
  }
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const requireToken = () => {
  const token = getToken();
  if(!token){
    throw new Error("Not authenticated");
  }
  return token;
};

export const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

