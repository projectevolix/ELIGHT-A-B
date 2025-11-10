import { uploadToCloudinary } from "../config/cloudinary.config";
import { UploadedFile } from "../types/image.types";

export const imageUploader = (file: UploadedFile) => {
  uploadToCloudinary(file);
};
