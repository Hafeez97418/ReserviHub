import transporter from "@/repositories/nodemailer.js";
import { userInterface } from "@/types/types.js";
import { catchAsyncErrors } from "@/utils/errors/common.js";
import optMailHTML from "@/utils/mail.js";
import { Request, Response, NextFunction, CookieOptions } from "express";
import { MailOptions } from "nodemailer/lib/ses-transport/index.js";
import bcrypt from "bcrypt";
import { User } from "@/models/database.js";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions: CookieOptions = {
  httpOnly: true, // Prevents JavaScript access
  secure: isProduction, // Use HTTPS in production
  sameSite: isProduction ? "none" : "lax", // "none" for cross-origin in prod
  maxAge: 86_400_000, // 1 day in milliseconds
};

declare module "express-session" {
  interface SessionData {
    otp?: string;
    otpExpires?: number;
  }
}

/**
 * OTP based email verification controller
 */
const sendEmailVerification = catchAsyncErrors(
  async (req: Request, res: Response, _next: NextFunction) => {
    const user: userInterface = req.body;
    const storedUser = await User.findOne({
      where: {
        [Op.or]: [{ email: user.email }, { phoneNumber: user.phoneNumber }],
      },
    });
    if (storedUser !== null) {
      res.status(400).json({
        success: false,
        message: "user with this email or phone number already exists",
      });
      return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    req.session.otp = `${user.email}:${otp}`;
    req.session.otpExpires = Date.now() + 10 * 60 * 1000; // Expire in 10 minutes

    const mailOptions: MailOptions = {
      from: process.env.SERVER_EMAIL,
      to: user.email,
      subject: "Your ReserviHub OTP Code for Email Verification",
      html: optMailHTML(otp),
    };

    await transporter.sendMail(mailOptions); // Ensure email is sent before responding

    res.status(200).json({
      success: true,
      message: "OTP has been sent to your email for Verification",
      user,
    });
  }
);

/**
 * register endpoint controller
 */
const Register = catchAsyncErrors(
  async (req: Request, res: Response, _next: NextFunction) => {
    interface userInterfaceWithOtp extends userInterface {
      otp: number;
    }
    const { name, email, password, otp, phoneNumber } =
      req.body as userInterfaceWithOtp;

    // Validate OTP existence
    if (!req.session.otp || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "OTP is required" });
    }

    // Check if OTP is expired
    if (!req.session.otpExpires || Date.now() > req.session.otpExpires) {
      return res
        .status(401)
        .json({ success: false, message: "OTP has expired" });
    }

    // Verify OTP
    if (req.session.otp !== `${email}:${otp}`) {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create user
    const storedUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      phoneNumber, // Ensure this exists in schema
    });

    // Clear OTP from session after successful verification
    delete req.session.otp;
    delete req.session.otpExpires;

    // Generate JWT Token
    const token = jwt.sign(
      { user: storedUser },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    // Set authentication token in cookies
    res.cookie("authToken", token, cookieOptions);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: storedUser,
    });
  }
);

/**
 * login endpoint controller
 */
const Login = catchAsyncErrors(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = (await User.findOne({
    where: { email },
  })) as userInterface | null;
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1d",
    }
  );

  // Set token in cookie
  res.cookie("authToken", token, cookieOptions);

  res.status(200).json({ success: true, message: "Login successful", user });
});

/**
 * logout endpoint controller
 */
const Logout = catchAsyncErrors(async (_req: Request, res: Response) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
});

export { Register, sendEmailVerification, Login, Logout };
