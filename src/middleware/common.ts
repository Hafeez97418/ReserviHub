import { userInterface } from "@/types/types.js";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

const isLoggedIn = (req: any, res: Response, next: NextFunction) => {
  const { authToken } = req.cookies;
  if (!authToken) {
    res
      .status(401)
      .json({ success: false, message: "Access Denied: No Token Provided" });
    return;
  }
  try {
    const verified = jwt.verify(authToken, process.env.JWT_SECRET as string);
    req.user = verified as userInterface; 
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or Expired Token" });
  }
};
export { isLoggedIn };
