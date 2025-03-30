import { RequestWithUser } from "@/types/types.js";
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
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or Expired Token" });
  }
};

const checkRole:any =
  (_role: "user" | "manager" | "admin") =>
  (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { role } = req.user;
    
    if (role !== _role) {      
      res.status(401).json({ success: false, message: "Forbidden" });
      return;
    }
    next();
  } ;
export { isLoggedIn  , checkRole};
