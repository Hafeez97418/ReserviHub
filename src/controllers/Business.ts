import { catchAsyncErrors } from "@/utils/errors/common.js";
import { Business, BusinessAnalytics, User } from "@/models/database.js";
import { Request, Response, NextFunction } from "express";
import { BusinessInterface, RequestWithUser } from "@/types/types.js";
import { deleteImage, uploadImage } from "@/repositories/cloudinary.js";
import { Op } from "sequelize";

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
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    const business = (await Business.findOne({
      where: { id: req.params.id },
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
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const business = (await Business.findOne({ where: { id } })) as any;
    if (!business) {
      res
        .status(400)
        .json({ success: false, message: "Business ID is Incorrect" });
      return;
    }
    const result = await deleteImage(id);

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
    const { skip = "0", limit = "10", name, category, location } = req.query;

    const offset = isNaN(Number(skip)) ? 0 : Number(skip);
    const limitValue = isNaN(Number(limit)) ? 10 : Number(limit);

    const query: Record<string, any> = {};
    if (name) query.name = { [Op.like]: `%${name}%` }; // Case-insensitive search
    if (category) query.category = { [Op.like]: `%${category}%` };
    if (location) query.location = { [Op.like]: `%${location}%` };

    const data = await Business.findAll({
      offset,
      limit: limitValue,
      where: query,
    });

    res.status(200).json({ success: true, businesses: data });
  }
);

// 5 update Business details

const updateBusinessDetails = catchAsyncErrors(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { name, description, location, category } = req.body;
    const { id } = req.params;
    const details = (await Business.findOne({ where: { id } })) as any;
    if (!details) {
      res.status(404).json({ success: false, message: "business not found" });
      return;
    }
    details.name = name;
    details.description = description;
    details.location = location;
    details.category = category;
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
    const { id } = req.params;
    const { userId } = req.user;

    const user = (await User.findOne({ where: { id: userId } })) as any;
    if (!user) {
      res.status(404).json({ success: false, message: "user not found" });
      return;
    }
    const data = await deleteImage(id);
    
    if (!data.success && data.result.result !== 'not found') {
      res
        .status(500)
        .json({ success: false, message: "Failed to delete image" });
      return;
    }

    const deleteCount = await Business.destroy({ where: { id } });
    if (deleteCount === 0) {
      res.status(404).json({ success: false, message: "business not found" });
      return;
    }

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
    const { id } = req.params;
    const analytics = await BusinessAnalytics.findOne({
      where: { businessId: id },
    });
    if (!analytics) {
      res.status(404).json({ success: false, message: "analytics not found" });
      return
    }
    res.status(200).json({ success: true, analytics });
  }
);
export {
  createBusiness,
  uploadBusinessImage,
  deleteBusinessImage,
  getAllBusinesses,
  updateBusinessDetails,
  deleteBusiness,
  getBusinessAnalytics
};
