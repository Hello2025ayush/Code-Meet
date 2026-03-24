import { io } from "socket.io-client";
import { SOCKET_BASE_URL } from "./config.js";
import { getToken } from "./auth.js";

export const createRoomSocket = () => {
  const token = getToken();

  return io(SOCKET_BASE_URL, {
    auth: { token },
  });
};

