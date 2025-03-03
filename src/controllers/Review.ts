import Business from "@/models/Business.js";
import { Review } from "@/models/database.js";
import { RequestWithUser } from "@/types/types.js";
import { catchAsyncErrors } from "@/utils/errors/common.js";
import { Response, NextFunction } from "express";

const createRating = catchAsyncErrors(
  async (req: RequestWithUser, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const { userId } = req.user;
    const { rating, review }: { rating: number; review: string } = req.body;

    const foundedBusiness = await Business.findOne({ where: { id } });
    if (!foundedBusiness) {
      res.status(404).json({ success: false, message: "Business not found" });
      return;
    }
    const result = await Review.create({
      userId,
      businessId: id,
      rating,
      review,
    });
    res
      .status(201)
      .json({ success: true, message: "your review is uploaded", result });
  }
);

const showRatings = catchAsyncErrors(
  async (req: RequestWithUser, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const { userId } = req.user;
    const query: { businessId: string; userId?: string } = {
      businessId: id,
    };
    if (userId) query.userId = userId;
    const result = await Review.findAll({ where: query });
    res.status(200).json({ success: true, reviews: result });
  }
);

const showAllRatings = catchAsyncErrors(
  async (req: RequestWithUser, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const { stars, skip, limit } = req.query as {
      stars?: string;
      skip?: string;
      limit?: string;
    };

    const query: { businessId: string; rating?: number } = {
      businessId: id,
    };
    if (!isNaN(Number(stars))) query.rating = Number(stars);
    const offset = isNaN(Number(skip)) ? 0 : Number(skip);
    const limitValue = isNaN(Number(limit)) ? 10 : Number(limit);

    const { rows, count } = await Review.findAndCountAll({
      where: query,
      offset,
      limit: limitValue,
    });
    res.status(200).json({ success: true, reviews: rows , count });
  }
);

const updateRating = catchAsyncErrors(
  async (req: RequestWithUser, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const { userId } = req.user;
    const { rating, review }: { rating: number; review: string } = req.body;

    const uploadedRating = (await Review.findOne({
      where: { userId, businessId: id },
    })) as any;
    if (!uploadedRating) {
      res.status(404).json({ success: false, message: "review not found" });
      return;
    }
    uploadedRating.rating = rating;
    uploadedRating.review = review;
    await uploadedRating.save();
    res
      .status(200)
      .json({ success: true, message: "your rating has been updated" });
  }
);

const removeRating = catchAsyncErrors(
  async (req: RequestWithUser, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const { userId } = req.user;
    const uploadedRating = await Review.destroy({
      where: { userId, businessId: id },
    });
    if (uploadedRating === 0) {
      res.status(404).json({ success: false, message: "review not found" });
      return;
    }
    res
      .status(200)
      .json({ success: true, message: "your rating has been deleted" });
  }
);

export {
  createRating,
  showRatings,
  updateRating,
  removeRating,
  showAllRatings,
};
