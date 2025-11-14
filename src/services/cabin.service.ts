import { NextFunction, Request, Response } from "express";
import { Cabin } from "../models/cabin.model";
import { CreateCabinInput, ICabin, IPaginatedCabins, UpdateCabinInput } from "../types/cabin.types";
import { BadRequestError } from "../utils/ApiError";
import { IQueryOptions } from "../types/treatment.types";
import { FilterQuery, Types } from "mongoose";

export const createCabin = async (
  data: CreateCabinInput
): Promise<ICabin> => {

  const existingCabin = await Cabin.findOne({ name: data.name });
  if (existingCabin) {
    throw new BadRequestError("A cabin with this name already exists.");
  }

  const newCabin = new Cabin({
    ...data,
  });

  await newCabin.save();
  return newCabin;
};

export const getAllCabins = async (
  options: IQueryOptions
): Promise<IPaginatedCabins> => {
  // 1. Set pagination defaults
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  // 2. Set filter to get all active cabins
  const filter: FilterQuery<ICabin> = { is_active: true };

  // 3. Run queries in parallel
  const [cabins, totalDocs] = await Promise.all([
    Cabin.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Cabin.countDocuments(filter),
  ]);

  // 4. Calculate total pages
  const totalPages = Math.ceil(totalDocs / limit);

  // 5. Return paginated response
  return {
    data: cabins,
    meta: {
      page,
      limit,
      totalDocs,
      totalPages,
    },
  };
};

export const getCabinById = async (
  cabinId: string
): Promise<ICabin | null> => {
  if (!Types.ObjectId.isValid(cabinId)) {
    return null;
  }
  return Cabin.findById(cabinId);
};

export const updateCabin = async (
  cabinId: string,
  updateData: UpdateCabinInput
): Promise<ICabin | null> => {
  if (!Types.ObjectId.isValid(cabinId)) {
    return null;
  }
  return Cabin.findByIdAndUpdate(
    cabinId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

export const deleteCabin = async (
  cabinId: string
): Promise<ICabin | null> => {
  if (!Types.ObjectId.isValid(cabinId)) {
    return null;
  }
  return Cabin.findByIdAndUpdate(
    cabinId,
    { is_active: false },
    { new: true }
  );
};