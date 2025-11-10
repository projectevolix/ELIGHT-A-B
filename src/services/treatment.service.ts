import { FilterQuery, Types } from "mongoose";
import { Threatment } from "../models/treatment.model";
import {
  CreateTreatmentInput,
  IPaginatedTreatments,
  IQueryOptions,
  IThreatment,
  UpdateTreatmentData,
} from "../types/treatment.types";
import { BadRequestError } from "../utils/ApiError";

export const createTreatment = async (
  data: CreateTreatmentInput
): Promise<IThreatment> => {
  // 1. Check if a treatment with this name already exists
  const existingTreatment = await Threatment.findOne({ name: data.name });

  if (existingTreatment) {
    throw new BadRequestError("A treatment with this name already exists.");
  }

  // 2. Create and save the new treatment
  const newTreatment = new Threatment(data);
  await newTreatment.save();

  // 3. Return the new document
  return newTreatment;
};

export const updateTreatment = async (
  id: string,
  updateData: UpdateTreatmentData
): Promise<IThreatment | null> => {
  // 1. Validate the ID format
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  // 2. Find and update the document
  // { new: true } returns the modified document, not the original
  const updatedTreatment = await Threatment.findByIdAndUpdate(
    id,
    { $set: updateData }, // $set ensures only provided fields are updated
    { new: true, runValidators: true } // runValidators ensures schema rules are checked
  );

  // 3. Return the updated document or null
  return updatedTreatment;
};

export const deleteTreatment = async (
  id: string
): Promise<IThreatment | null> => {
  // 1. Validate the ID format
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  // 2. Find and delete the document
  const deletedTreatment = await Threatment.findByIdAndDelete(id);

  // 3. Return the deleted document (or null if not found)
  return deletedTreatment;
};

export const getAllTreatments = async (
  options: IQueryOptions
): Promise<IPaginatedTreatments> => {
  // 1. Set pagination defaults
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  // 2. Create an empty filter (to get all)
  const filter: FilterQuery<IThreatment> = {};

  // 3. Run queries in parallel for efficiency
  const [treatments, totalDocs] = await Promise.all([
    // Query 1: Get the documents for the current page
    Threatment.find(filter)
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit),

    // Query 2: Get the total count of all documents
    Threatment.countDocuments(filter),
  ]);

  // 4. Calculate total pages
  const totalPages = Math.ceil(totalDocs / limit);

  // 5. Return the paginated response
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