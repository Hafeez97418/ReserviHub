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
    userId: UUID;
    iat: number;
    exp: number;
    role: "user" | "manager" | "admin";
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
  phoneNumber: string;
}

export interface AppointmentIntervalInterface {
  id?: string; // UUID, optional as it's auto-generated
  businessId: string; // UUID
  startTime: string; // HH:MM:SS format, only for "hourly"
  endTime: string ; // HH:MM:SS format, only for "hourly"
  price: number;
  maxSlots: number;
  availableSlots: number;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface analyticsInterface {
  totalAppointments: number;
  completedAppointments: number;
  missedAppointments: number;
  totalRevenue: string;
  peakHours: JSON;
  businessId: string;
  id: string;
  save?: Function;
}
