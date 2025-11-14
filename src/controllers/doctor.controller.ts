import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../utils/ApiError";
import * as doctorService from "../services/doctor.service";
import { ApiResponse } from "../utils/ApiResponse";

export const createDoctorUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Get user details from the request body
    const { email, password, f_name, l_name, phoneNumber, id_card_number } =
      req.body;

    // 2. Basic validation
    if (!email || !password || !f_name || !l_name || !id_card_number) {
      throw new BadRequestError(
        "Missing required fields: email, password, f_name, l_name, id_card_number"
      );
    }

    // 3. Pass the data to the service
    const doctorData = {
      email,
      password,
      f_name,
      l_name,
      phoneNumber,
      id_card_number,
    };

    const newDoctor = await doctorService.createDoctor(doctorData);

    // 4. Send the successful response
    res.status(201).json(
      new ApiResponse(
        201,
        newDoctor,
        "Doctor user created successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};