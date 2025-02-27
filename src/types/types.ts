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
  user: {
    userId: UUID,
    iat: number,
    exp:number
  };
}

export interface BusinessInterface {
  id: UUID;
  managerId: UUID;
  image: string;
  name: string;
  description: string;
  category: string;
  location: string;
}
