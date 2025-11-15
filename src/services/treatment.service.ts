import { FilterQuery, Types } from "mongoose";
import { Threatment } from "../models/treatment.model";
import {
  CreateTreatmentInput,
  IPaginatedTreatments,
  IQueryOptions,
  IThreatment,
  UpdateTreatmentData,
} from "../types/treatment.types";
import { BadRequestError, ConflictError } from "../utils/ApiError";

export const createTreatment = async (
  data: CreateTreatmentInput
): Promise<IThreatment> => {
  const existingTreatment = await Threatment.findOne({ name: data.name });

  if (existingTreatment) {
    throw new ConflictError("A treatment with this name already exists.");
  }

  const newTreatment = new Threatment(data);
  await newTreatment.save();

  return newTreatment;
};

export const updateTreatment = async (
  id: string,
  updateData: UpdateTreatmentData
): Promise<IThreatment | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid treatment ID format");
  }

  const updatedTreatment = await Threatment.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  return updatedTreatment;
};

export const deleteTreatment = async (
  id: string
): Promise<IThreatment | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid treatment ID format");
  }

  const deletedTreatment = await Threatment.findByIdAndDelete(id);

  return deletedTreatment;
};

export const getAllTreatments = async (
  options: IQueryOptions
): Promise<IPaginatedTreatments> => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  const filter: FilterQuery<IThreatment> = {};

  const [treatments, totalDocs] = await Promise.all([
    Threatment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Threatment.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalDocs / limit);

  return {
    data: treatments,
    meta: {
      page,
      limit,
      totalDocs,
      totalPages,
    },
  };
};