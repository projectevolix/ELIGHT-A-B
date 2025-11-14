import { model, Schema, Types } from "mongoose";
import { ITreatmentPlan } from "../types/treatment_plan.types";

const treatmentPlanSchema = new Schema<ITreatmentPlan>(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User", // This must match the model name 'User'
      required: true,
      unique: false, // Assumes one user has only one treatment plan
    },
    mealPlan: {
      type: String,
      required: true,
      trim: true,
    },
    voiceUrl: {
      type: String,
      required: false, // This field is optional
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// 3. Create and Export the Model
export const TreatmentPlan = model<ITreatmentPlan>(
  "TreatmentPlan",
  treatmentPlanSchema
);