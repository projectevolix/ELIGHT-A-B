import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { imageUploader } from "../utils/imageUploader";

export const saveImageAndGetUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Check if a file was attached by Multer
    if (!req.file) {
      throw new BadRequestError("No image file provided.");
    }

    // 2. Pass the file to the service
    const imageUrl = await imageUploader(req.file);

    // 3. Send the successful response
    res.status(201).json(
      new ApiResponse(
        201,
        { url: imageUrl }, // Send URL in data object
        "Image uploaded successfully"
      )
    );
  } catch (error) {
    // 4. Pass errors to the error handler
    next(error);
  }
};
