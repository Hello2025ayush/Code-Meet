import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  // Local dev fallback. For production, ensure JWT_SECRET is set in .env.
  return process.env.JWT_SECRET || "dev_secret";
};

export const requireAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, getJwtSecret());
    req.user = {
      userId: payload.userId,
      name: payload.name,
      email: payload.email,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

