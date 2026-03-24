import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  // Local dev fallback. For production, ensure JWT_SECRET is set in .env.
  return process.env.JWT_SECRET || "dev_secret";
};

export const authSocket = (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error("Unauthorized"));
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());
    socket.user = {
      userId: payload.userId,
      name: payload.name,
      email: payload.email,
    };
    return next();
  } catch (error) {
    return next(new Error("Unauthorized"));
  }
};

