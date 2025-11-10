import { Threatment } from "../models/treatment.model";
import { CreateTreatmentInput, IThreatment } from "../types/treatment.types";
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