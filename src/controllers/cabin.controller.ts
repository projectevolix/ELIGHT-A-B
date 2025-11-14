import { NextFunction, Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../utils/ApiError";
import * as cabinService from "../services/cabin.service";
import { ApiResponse } from "../utils/ApiResponse";
import {  Types } from "mongoose";

export const createCabin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
      new ApiResponse(
        201, 
        newCabin, 
        "Cabin created successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getCabinById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cabinId } = req.params;

    if (!Types.ObjectId.isValid(cabinId)) {
      throw new BadRequestError("Invalid cabin ID");
    }

    const cabin = await cabinService.getCabinById(cabinId);
    if (!cabin) {
      throw new NotFoundError("Cabin not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, cabin, "Cabin retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getAllCabins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const result = await cabinService.getAllCabins({ page, limit });

    res
      .status(200)
      .json(new ApiResponse(200, result, "Cabins retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateCabin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cabinId } = req.params;
    const { name, description, imageURL } = req.body;

    const updateData: { [key: string]: any } = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (imageURL !== undefined) updateData.imageURL = imageURL;

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestError("No valid fields provided for update.");
    }

    const updatedCabin = await cabinService.updateCabin(cabinId, updateData);

    if (!updatedCabin) {
      throw new NotFoundError("Cabin not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, updatedCabin, "Cabin updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteCabin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cabinId } = req.params;

    const deletedCabin = await cabinService.deleteCabin(cabinId);

    if (!deletedCabin) {
      throw new NotFoundError("Cabin not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, null, "Cabin deleted successfully"));
  } catch (error) {
    next(error);
  }
};