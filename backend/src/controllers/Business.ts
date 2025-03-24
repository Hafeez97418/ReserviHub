import { catchAsyncErrors } from "@/utils/errors/common.js";
import {
  Appointment,
  Business,
  BusinessAnalytics,
  Payment,
  Review,
  User,
} from "@/models/database.js";
import { Request, Response, NextFunction } from "express";
import { BusinessInterface, RequestWithUser } from "@/types/types.js";
import { deleteImage, uploadImage } from "@/repositories/cloudinary.js";
import { Op, Sequelize } from "sequelize";
import {
  createQueryByAI,
  getBusinessAdviceByAI,
} from "@/repositories/gemini.js";
import { getAnalytics } from "@/utils/utils.js";

// 1 create business account
const createBusiness = catchAsyncErrors(
  async (req: RequestWithUser, res: Response, _next: NextFunction) => {
    const { userId } = req.user;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource",
      });
    }

    const {
      name,
      description,
      category,
      location,
      phoneNumber,
    }: Partial<BusinessInterface> = req.body;
    const user = (await User.findOne({ where: { id: userId } })) as any;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found, please login again",
      });
    }

    user.role = "manager";
    await user.save();

    const business = await Business.create({
      name,
      managerId: userId,
      category,
      description,
      location,
      phoneNumber,
    });
    const { id } = business.get();
    await BusinessAnalytics.create({
      businessId: id,
    });

    res.status(201).json({
      success: true,
      message: "Business created successfully",
      business,
    });
  }
);
// 2 upload and replace business image
const uploadBusinessImage = catchAsyncErrors(
  async (req: RequestWithUser, res: Response, _next: NextFunction) => {
    const { userId } = req.user;
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    const business = (await Business.findOne({
      where: { managerId: userId },
    })) as any;

    if (!business) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid ID, please try again" });
    }

    const result = await uploadImage(req.file.path, business.id);

    if (!result) {
      return res.status(500).json({
        success: false,
        message: "Image upload failed, please try again later",
      });
    }

    business.image = result.url;
    await business.save();

    res
      .status(200)
      .json({ success: true, message: "Image uploaded successfully" });
  }
);

// 3 delete business image
const deleteBusinessImage = catchAsyncErrors(
  async (req: RequestWithUser, res: Response, _next: NextFunction) => {
    const { userId } = req.user;
    const business = (await Business.findOne({
      where: { managerId: userId },
    })) as any;
    if (!business) {
      res
        .status(400)
        .json({ success: false, message: "Business ID is Incorrect" });
      return;
    }
    const result = await deleteImage(business.id);

    if (!result.success) {
      res
        .status(500)
        .json({ success: false, message: "Failed to delete image" });
      return;
    }
    business.image = null;
    await business.save();
    res
      .status(200)
      .json({ success: true, message: "Image deleted successfully" });
  }
);

// 4 get all businesses

const getAllBusinesses = catchAsyncErrors(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { skip = "0", limit = "10", name } = req.query;
    let query: any = {};
    const offset = isNaN(Number(skip)) ? 0 : Number(skip);
    const limitValue = isNaN(Number(limit)) ? 10 : Number(limit);
    if (name) query = { name: { [Op.like]: `%${name}%` } };
    const { rows, count } = await Business.findAndCountAll({
      where: query,
      offset,
      limit: limitValue,
      subQuery: false, // disables subquery wrapping
      include: [
        {
          model: Review,
          attributes: [],
          required: false,
        },
      ],
      attributes: {
        include: [
          [Sequelize.fn("AVG", Sequelize.col("Reviews.rating")), "avg_rating"],
        ],
      },
      group: ["Business.id"],
    });

    res
      .status(200)
      .json({ success: true, businesses: rows, count: count.length });
  }
);

// 5 update Business details

const updateBusinessDetails = catchAsyncErrors(
  async (req: RequestWithUser, res: Response, _next: NextFunction) => {
    const { name, description, location, category, phoneNumber } = req.body;
    const { userId } = req.user;
    const details = (await Business.findOne({
      where: { managerId: userId },
    })) as any;
    if (!details) {
      res.status(404).json({ success: false, message: "business not found" });
      return;
    }
    details.name = name;
    details.description = description;
    details.location = location;
    details.category = category;
    details.phoneNumber = phoneNumber;
    await details.save();
    res.status(200).json({
      success: true,
      message: "business details got updated",
      business: details,
    });
  }
);

// 6 delete business
const deleteBusiness = catchAsyncErrors(
  async (req: RequestWithUser, res: Response, _next: NextFunction) => {
    const { userId } = req.user;

    const business: any = await Business.findOne({
      where: { managerId: userId },
    });
    const user: any = await User.findOne({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ success: false, message: "user not found" });
      return;
    }
    if (!business) {
      res.status(404).json({ success: false, message: "business not found" });
      return;
    }
    const data = await deleteImage(business.id);

    if (!data.success && data.result.result !== "not found") {
      res
        .status(500)
        .json({ success: false, message: "Failed to delete image" });
      return;
    }

    await business.destroy();

    user.role = "user";
    await user.save();
    res.status(200).json({
      success: true,
      message: "your business got deleted successfully",
    });
  }
);

const getBusinessAnalytics = catchAsyncErrors(
  async (req: RequestWithUser, res: Response, _next: NextFunction) => {
    const { userId } = req.user;
    const business = (await Business.findOne({
      where: { managerId: userId },
    })) as any;
    if (!business) {
      res.status(404).json({ success: false, message: "business not found" });
      return;
    }
    const data = await getAnalytics(business.id);
    if (!data.analytics || !data.success) {
      res.status(404).json({ success: false, message: "analytics not found" });
      return;
    }
    res.status(200).json({ success: true, analytics: data.analytics });
  }
);

const getBusinessByAi = catchAsyncErrors(
  async (req: Request, res: Response, _next: NextFunction) => {
    const prompt = req.query.prompt as string;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Query prompt is required.",
      });
    }

    const response = await createQueryByAI(prompt);

    if (!response.success || !response) {
      return res.status(500).json({
        success: false,
        message:
          response.message ||
          "Oops! Something went wrong. Please try again later.",
      });
    }

    // Pagination defaults
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;

    // AI-generated conditions
    const searchConditions = Object.entries(response.response).reduce(
      (acc: any, [key, value]) => {
        if (typeof value === "string") {
          acc[key] = { [Op.like]: `%${value.toLowerCase()}%` };
        } else if (value !== null) {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );

    // Query with Review join and rating avg
    const { count, rows } = await Business.findAndCountAll({
      where: { [Op.or]: { ...searchConditions } },
      limit,
      offset,
      subQuery: false,
      include: [
        {
          model: Review,
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [
            Sequelize.fn("AVG", Sequelize.col("Reviews.rating")),
            "averageRating",
          ],
        ],
      },
      group: ["Business.id"],
    });

    if (count.length === 0) {
      return res.status(400).json({
        success: false,
        rows,
        message:
          "Could not find any businesses with this prompt. Try something else.",
      });
    }

    res.status(200).json({ success: true, count: count.length, rows });
  }
);

const getAdviceByAgent = catchAsyncErrors(
  async (req: RequestWithUser, res: Response, _next: NextFunction) => {
    const { businessId } = req.params;
    const business = (await Business.findByPk(
      businessId
    )) as BusinessInterface | null;
    if (!business) {
      return res
        .status(404)
        .json({ success: false, message: "business not found" });
    }
    const result = await getBusinessAdviceByAI(business);
    if (!result.success) {
      res.status(500).json(result);
    }
    res.status(200).json({ success: true, result });
  }
);

const getCustomerArrivals = catchAsyncErrors(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { intervalId } = req.params;
    const data = await Appointment.findAll({
      where: { intervalId },
      include: [
        { model: User, attributes: ["id", "name", "email" , "phoneNumber"] },
        { model: Payment, attributes: ["id", "status", "amount"] },
      ],
    });
    res.status(200).json({ success: true, result: data });
  }
);

const getMyBusiness = catchAsyncErrors(
  async (req: RequestWithUser, res: Response, _next: NextFunction) => {
    const { userId } = req.user;
    const business = await Business.findOne({ where: { managerId: userId } });
    if (!business) {
      return res
        .status(404)
        .json({ success: false, message: "no business found" });
    }

    return res.status(200).json({ success: true, business });
  }
);
export {
  createBusiness,
  uploadBusinessImage,
  deleteBusinessImage,
  getAllBusinesses,
  updateBusinessDetails,
  deleteBusiness,
  getBusinessAnalytics,
  getBusinessByAi,
  getAdviceByAgent,
  getCustomerArrivals,
  getMyBusiness
};
