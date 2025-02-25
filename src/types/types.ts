import { UUID } from "crypto";
import { Request } from "express";
export interface userInterface {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  id?: UUID;
  role: "user" | "admin" | "manager";
}

export interface RequestWithUser extends Request {
  user: userInterface;
}
