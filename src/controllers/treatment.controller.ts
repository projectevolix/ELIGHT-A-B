import { NextFunction, Request, Response } from "express";
import * as treatmentService from "../services/treatment.service";
import { BadRequestError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

export const getAllTreatments = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        res.send("Get all treatments");
    } catch (error) {
        
    }
}

export const createTreatment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Get data from the request body
    const {
      name,
      description,
      duration,
      resources,
      benifits, // Matches your interface spelling
      imgUrl,
    } = req.body;

    // 2. Validate required fields (based on your schema)
    if (!name || !duration || !resources || !benifits) {
      throw new BadRequestError(
        "Missing required fields: name, duration, resources, and benifits are required."
      );
    }
    
    // 3. Call the service to create the treatment
    const newTreatment = await treatmentService.createTreatment({
      name,
      description,
      duration,
      resources,
      benifits,
      imgUrl,
    });

    // 4. Send a successful response using your ApiResponse class
    res.status(201).json(
      new ApiResponse(
        201, 
        newTreatment, 
        "Treatment created successfully"
      )
    );
    
  } catch (error) {
    // 5. Pass any errors to your global error handler
    next(error);
  }
};