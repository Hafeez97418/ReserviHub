import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

const validateCredentials = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array()[0].msg, // Send errors as an array
    });
    return;
  }

  next();
};


export { validateCredentials };
