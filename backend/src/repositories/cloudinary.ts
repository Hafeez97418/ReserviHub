import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs/promises"; // Use Promises API for better handling

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (imagePath: string, businessId: string) => {
  const safePublicId = businessId.replace(/[@.]/g, "_"); // Replace @ and . to avoid issues

  const options = {
    public_id: safePublicId,
    use_filename: false,
    unique_filename: false,
    overwrite: true,
  };

  try {
    const result = await cloudinary.uploader.upload(imagePath, options);
    await fs.unlink(imagePath); // Ensures file is deleted properly

    return result; // Return the image URL
  } catch (error) {
    return null;
  }
};

const deleteImage = async (businessId: string) => {
  try {
    const publicId = businessId.replace(/[@.]/g, "_");
    const result = await cloudinary.uploader.destroy(publicId);
    return { success: result.result === "ok", result };
  } catch (error) {
    return { success: false, error };
  }
};


export { uploadImage, deleteImage };