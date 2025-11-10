import { NextFunction, Request, Response } from "express";
import * as treatmentService from "../services/treatment.service";
import { BadRequestError, NotFoundError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { IThreatment } from "../types/treatment.types";

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

export const updateTreatment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Get the ID from the URL parameters
    const { id } = req.params;

    // 2. Get the allowed fields from the request body
    const {
      name,
      description,
      duration,
      resources,
      benifits, // Matches your model's spelling
      imgUrl,
    } = req.body;

    // 3. Create a secure update object (prevents unwanted field updates)
    const updateData: Partial<IThreatment> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (duration !== undefined) updateData.duration = duration;
    if (resources !== undefined) updateData.resources = resources;
    if (benifits !== undefined) updateData.benifits = benifits;
    if (imgUrl !== undefined) updateData.imgUrl = imgUrl;

    // 4. Check if any valid data was provided
    if (Object.keys(updateData).length === 0) {
      throw new BadRequestError("No valid fields provided for update.");
    }

    // 5. Call the service to perform the update
    const updatedTreatment = await treatmentService.updateTreatment(
      id,
      updateData
    );

    // 6. If the treatment wasn't found, throw a NotFoundError
    if (!updatedTreatment) {
      throw new NotFoundError("Treatment not found");
    }

    // 7. Send the successful response
    res.status(200).json(
      new ApiResponse(
        200,
        updatedTreatment,
        "Treatment updated successfully"
      )
    );
    
  } catch (error) {
    // 8. Pass any errors to the global error handler
    next(error);
  }
};