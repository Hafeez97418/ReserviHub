import { catchAsyncErrors } from "@/utils/errors/common.js";
import { AppointmentInterval, Business } from "@/models/database.js";
import { Request, Response, NextFunction } from "express";
import {
  AppointmentIntervalInterface,
  RequestWithUser,
} from "@/types/types.js";
import { Op } from "sequelize";

const TimeToSeconds = (date: string) => {
  if (typeof date !== "string") return -1; // Ensure input is a string
  const parts = date.split(":");
  if (parts.length !== 3) return -1; // Ensure correct format

  const Hour = Number(parts[0]);
  const min = Number(parts[1]);
  const sec = Number(parts[2]);

  if (isNaN(Hour) || isNaN(min) || isNaN(sec)) {
    return -1; // Invalid number case
  }

  const seconds = Hour * 3600 + min * 60 + sec;
  return seconds;
};

const createAppointmentInterval = catchAsyncErrors(
  async (req: RequestWithUser, res: Response, _next: NextFunction) => {
    const { userId } = req.user;
    const {
      startTime,
      endTime,
      maxSlots,
      availableSlots,
      type,
      price,
      duration,
      description,
    }: AppointmentIntervalInterface = req.body;

    // Fetch the business
    const business = (await Business.findOne({
      where: { managerId: userId },
    })) as any;
    if (!business) {
      return res
        .status(404)
        .json({ success: false, message: "Business not found" });
    }
    const businessId = business.id;

    // If type is 'daily', duration is required
    if (type === "daily") {
      if (!duration) {
        return res.status(400).json({
          success: false,
          message: "Duration is required for daily reservation slot",
        });
      }
      const result = await AppointmentInterval.create({
        businessId,
        price,
        duration,
        description,
        maxSlots,
        availableSlots,
        type,
      });
      return res.status(201).json({
        success: true,
        message: "Appointment interval for daily reservations is created",
        result,
      });
    }

    // If type is not 'daily', startTime and endTime are required
    if (!startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "startTime and endTime are required for hourly reservations",
      });
    }

    // Convert time to seconds
    const startSeconds = TimeToSeconds(startTime);
    const endSeconds = TimeToSeconds(endTime);

    if (
      startSeconds === -1 ||
      endSeconds === -1 ||
      startSeconds >= endSeconds
    ) {
      return res.status(400).json({ success: false, message: "Invalid time" });
    }

    // Check for overlapping intervals
    const overlappingInterval = await AppointmentInterval.findOne({
      where: {
        businessId,
        [Op.or]: [
          {
            startTime: { [Op.lt]: endTime },
            endTime: { [Op.gt]: startTime },
          },
        ],
      },
    });

    if (overlappingInterval) {
      return res.status(400).json({
        success: false,
        message: "An appointment interval within this duration already exists",
      });
    }

    // Create the appointment interval
    const result = await AppointmentInterval.create({
      businessId,
      startTime,
      endTime,
      price,
      description,
      maxSlots,
      availableSlots,
      type,
    });

    return res.status(201).json({
      success: true,
      message: "Appointment interval for hourly business is created",
      result,
    });
  }
);

const deleteAppointmentInterval = catchAsyncErrors(
  async (req: RequestWithUser, res: Response, _next: NextFunction) => {
    const { userId } = req.user;
    const { intervalId } = req.params;

    // Validate input
    if (!intervalId) {
      return res
        .status(400)
        .json({ success: false, message: "Interval ID is required" });
    }

    // Check if business exists for the user
    const business = (await Business.findOne({
      where: { managerId: userId },
    })) as any;
    if (!business) {
      return res
        .status(404)
        .json({ success: false, message: "Business not found" });
    }

    // Find the appointment interval
    const appointmentInterval = await AppointmentInterval.findOne({
      where: { id: intervalId, businessId: business.id },
    });

    if (!appointmentInterval) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment interval not found" });
    }

    // Delete the appointment interval
    await appointmentInterval.destroy();

    return res.status(200).json({
      success: true,
      message: "Appointment interval deleted successfully",
    });
  }
);

const getAppointmentIntervals = catchAsyncErrors(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { businessId } = req.params; // Extract businessId from params

    if (!businessId) {
      return res.status(400).json({
        success: false,
        message: "Business ID is required",
      });
    }

    // Check if business exists
    const business = await Business.findByPk(businessId);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    // Fetch appointment intervals for the business
    const appointmentIntervals = await AppointmentInterval.findAll({
      where: { businessId },
      order: [["startTime", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Appointment intervals fetched successfully",
      data: appointmentIntervals,
    });
  }
);


export {
  createAppointmentInterval,
  deleteAppointmentInterval,
  getAppointmentIntervals,
};
