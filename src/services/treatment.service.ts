import { Types } from "mongoose";
import { Threatment } from "../models/treatment.model";
import { CreateTreatmentInput, IThreatment, UpdateTreatmentData } from "../types/treatment.types";
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
    