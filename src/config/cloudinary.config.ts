import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "../config/env.config"; // Adjust path as needed
import { UploadedFile } from "../types/image.types";
import { ApiError } from "../utils/ApiError";
import streamifier from "streamifier";

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true, // Use HTTPS
});

export const uploadToCloudinary = (
  file: UploadedFile
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Create an upload stream to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "your-project-folder", // Optional: organize uploads
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          // If Cloudinary gives an error, reject the promise
          return reject(new ApiError(500, "Image upload failed", [error]));
        }
        if (!result) {
          // If no result (should be rare)
          return reject(new ApiError(500, "Image upload failed to return result"));
        }
        // Resolve the promise with the secure URL
        resolve(result.secure_url);
      }
    );

    // Pipe the file buffer from Multer into the Cloudinary stream
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};