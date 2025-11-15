import { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger.config";
import * as therapistService from "../services/therapist.service";
import { BadRequestError, asyncHandler } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

export const createTherapistUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password, f_name, l_name, phoneNumber, id_card_number } =
      req.body;

    if (!email || !password || !f_name || !l_name || !id_card_number) {
      throw new BadRequestError(
        "Missing required fields: email, password, f_name, l_name, id_card_number"
      );
    }

    // 3. Pass the data to the service
    const therapistData = {
      email,
      password,
      f_name,
      l_name,
      phoneNumber,
      id_card_number,
    };

    const newTherapist = await therapistService.createTherapist(therapistData);

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          newTherapist,
          "Therapist user created successfully"
        )
      );
  }
);
