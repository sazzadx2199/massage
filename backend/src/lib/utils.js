import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (userId, res) => {
  const { JWT_SECRET, NODE_ENV } = ENV;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

  // For production (Render/Vercel), always use secure cookies with sameSite: none
  const isProduction = NODE_ENV === "production";

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in MS
    httpOnly: true, // prevent XSS attacks: cross-site scripting
    sameSite: isProduction ? "none" : "lax", // "none" for cross-origin (Vercel + Render)
    secure: isProduction, // HTTPS required when sameSite is "none"
  });

  // Also return token in response for mobile browsers that block cookies
  return token;
};

// http://localhost
// https://dsmakmk.com
