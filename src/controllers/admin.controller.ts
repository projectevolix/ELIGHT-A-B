import { NextFunction, Request, Response } from "express";
import * as adminService from "../services/admin.service";
import { logger } from "../config/logger.config";
import { BadRequestError, asyncHandler } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

export const createAdminUser = asyncHandler(
  async (req: Request, res: Response) => {
    // 1. Get admin details from the request body
    const { email, password, f_name, l_name, phoneNumber, id_card_number } =
      req.body;

    // 2. Basic validation
    if (!email || !password || !f_name || !l_name || !id_card_number) {
      throw new BadRequestError(
        "Missing required fields: email, password, f_name, l_name, id_card_number"
      );
    }

    // 3. Pass the data to the service
    const adminData = {
      email,
      password,
      f_name,
      l_name,
      phoneNumber,
      id_card_number,
    };

    const newAdmin = await adminService.createAdmin(adminData);

    // 4. Send the new admin back (excluding sensitive data)
    res
      .status(201)
      .json(new ApiResponse(201, newAdmin, "Admin user created successfully"));
  }
);
