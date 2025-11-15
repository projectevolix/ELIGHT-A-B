import { Request, Response } from "express";
import * as treatmentService from "../services/treatment.service";
import { BadRequestError, NotFoundError, asyncHandler } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { IThreatment } from "../types/treatment.types";

export const getAllTreatments = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const result = await treatmentService.getAllTreatments({ page, limit });

    if (result.data.length === 0) {
      return res.status(200).json(
        new ApiResponse(200, result, "No treatments found")
      );
    }

    res.status(200).json(
      new ApiResponse(200, result, "Treatments retrieved successfully")
    );
  }
);

export const createTreatment = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, description, duration, resources, benifits, imgUrl } = req.body;

    if (!name || !duration || !resources || !benifits) {
      throw new BadRequestError(
        "Missing required fields: name, duration, resources, and benifits are required."
      );
    }
    
    const newTreatment = await treatmentService.createTreatment({
      name,
      description,
      duration,
      resources,
      benifits,
      imgUrl,
    });

    res.status(201).json(
      new ApiResponse(201, newTreatment, "Treatment created successfully")
    );
  }
);

export const updateTreatment = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, duration, resources, benifits, imgUrl } = req.body;

    const updateData: Partial<IThreatment> = {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(duration !== undefined && { duration }),
      ...(resources !== undefined && { resources }),
      ...(benifits !== undefined && { benifits }),
      ...(imgUrl !== undefined && { imgUrl }),
    };

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestError("No valid fields provided for update.");
    }

    const updatedTreatment = await treatmentService.updateTreatment(id, updateData);

    if (!updatedTreatment) {
      throw new NotFoundError("Treatment not found");
    }

    res.status(200).json(
      new ApiResponse(200, updatedTreatment, "Treatment updated successfully")
    );
  }
);

export const deleteTreatment = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const deletedTreatment = await treatmentService.deleteTreatment(id);

    if (!deletedTreatment) {
      throw new NotFoundError("Treatment not found");
    }

    res.status(200).json(
      new ApiResponse(200, null, "Treatment deleted successfully")
    );
  }
);