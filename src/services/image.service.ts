import { cloudinary } from "../config/cloudinary.config";
import { UploadedFile } from "../types/image.types";
import { ApiError } from "../utils/ApiError";
import streamifier from "streamifier";

export const saveImageAndGetUrl = async (
  file: UploadedFile
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Create an upload stream to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "your-project-folder", // Optional: organize uploads
        // resource_type: "auto", // Let Cloudinary detect
      },
      (error, result) => {
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