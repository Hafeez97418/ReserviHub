import { catchAsyncErrors } from "@/utils/errors/common.js";
import { User } from "@/models/database.js";
import { Request, Response, NextFunction } from "express";

const getAllUsers = catchAsyncErrors(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { email, skip, limit, phoneNumber, role } = req.query as {
      email?: string;
      skip?: string;
      limit?: string;
      phoneNumber?: string;
      role?: "user" | "manager" | "admin";
    };

    // Convert pagination values safely
    const offset = skip ? Number(skip) : 0;
    const limitValue = limit ? Number(limit) : 10;

    // Build query object properly
    const query: Record<string, string> = {};
    if (email) query.email = email;
    if (phoneNumber) query.phoneNumber = phoneNumber;
    if (role) query.role = role;

    if (Object.keys(query).length > 0) {
      const data = await User.findAll({
        where: query,
        offset,
        limit: limitValue,
      });
      return res.status(200).json({ success: true, users: data });
    }

    const { rows, count } = await User.findAndCountAll({
      offset,
      limit: limitValue,
      order: [["createdAt", "DESC"]], // Sort by latest created records
    });

    res.status(200).json({ success: true, users: rows, count });
  }
);

const updateUser = catchAsyncErrors(
  async (req: Request, res: Response, _next: NextFunction) => {
    const data: {
      name: string;
      phoneNumber: string;
      email: string;
    } = req.body;
    const user = (await User.findOne({
      where: { email: data.email },
    })) as any;
    if (!user) {
      res.status(404).json({
        success: false,
        message: "user not found please try again later",
      });
      return;
    }
    user.name = data.name;
    user.phoneNumber = data.phoneNumber;
    user.save();
    res.status(200).json({ success: true, message: "your data is updated" });
  }
);

const deleteUser = catchAsyncErrors(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }
    const deletedRecords = await User.destroy({ where: { id } });
    if (deletedRecords === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User was deleted" });
  }
);

export { getAllUsers, updateUser, deleteUser };
