import { NextFunction, Request, Response } from "express";
import * as adminService from "../services/admin.service";
import { logger } from "../config/logger.config";

export const createAdminUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Get admin details from the request body
    const { email, password, f_name, l_name, phoneNumber, id_card_number } =
      req.body;

    // 2. Basic validation
    if (!email || !password || !f_name || !l_name || !id_card_number) {
      return res.status(400).json({
        message:
          "Missing required fields: email, password, f_name, l_name, id_card_number",
      });
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
    res.status(201).json({
      message: "Admin user created successfully",
      data: newAdmin,
    });
  } catch (error) {
      // 5. Pass errors to the error-handling middleware
      logger.error("Error creating admin user:", error);
    next(error);
  }
};
