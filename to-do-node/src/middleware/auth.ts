import { Request, Response } from "express";

import { verifyAccessToken } from "../util/jwt.js";

const auth_middleware = (req: Request, res: Response, next: () => void) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header is missing" });
  }

  const token = authHeader.split(" ")[1]; // Assuming the format is "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Token is missing" });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }

  next();
};

export default auth_middleware;
