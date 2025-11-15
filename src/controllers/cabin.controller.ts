import { Request, Response } from "express";
import { BadRequestError, NotFoundError, asyncHandler } from "../utils/ApiError";
import * as cabinService from "../services/cabin.service";
import { ApiResponse } from "../utils/ApiResponse";
import { Types } from "mongoose";

export const createCabin = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, description, imageURL } = req.body;

    if (!name) {
      throw new BadRequestError("Cabin 'name' is required.");
    }

    const newCabin = await cabinService.createCabin({
      name,
      description,
      imageURL,
    });

    res.status(201).json(
      new ApiResponse(201, newCabin, "Cabin created successfully")
    );
  }
);

export const getCabinById = asyncHandler(
  async (req: Request, res: Response) => {
    const { cabinId } = req.params;

    if (!Types.ObjectId.isValid(cabinId)) {
      throw new BadRequestError("Invalid cabin ID");
    }

    const cabin = await cabinService.getCabinById(cabinId);
    if (!cabin) {
      throw new NotFoundError("Cabin not found");
    }

    res.status(200).json(
      new ApiResponse(200, cabin, "Cabin retrieved successfully")
    );
  }
);

export const getAllCabins = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const result = await cabinService.getAllCabins({ page, limit });

    res.status(200).json(
      new ApiResponse(200, result, "Cabins retrieved successfully")
    );
  }
);

export const updateCabin = asyncHandler(
  async (req: Request, res: Response) => {
    const { cabinId } = req.params;
    const { name, description, imageURL } = req.body;

    const updateData: { [key: string]: any } = {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(imageURL !== undefined && { imageURL }),
    };

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestError("No valid fields provided for update.");
    }

    const updatedCabin = await cabinService.updateCabin(cabinId, updateData);

    if (!updatedCabin) {
      throw new NotFoundError("Cabin not found");
    }

    res.status(200).json(
      new ApiResponse(200, updatedCabin, "Cabin updated successfully")
    );
  }
);

export const deleteCabin = asyncHandler(
  async (req: Request, res: Response) => {
    const { cabinId } = req.params;

    const deletedCabin = await cabinService.deleteCabin(cabinId);

    if (!deletedCabin) {
      throw new NotFoundError("Cabin not found");
    }

    res.status(200).json(
      new ApiResponse(200, null, "Cabin deleted successfully")
    );
  }
);