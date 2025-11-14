import { model, Schema, Types } from "mongoose";
import { ITreatmentSession } from "../types/treatment_session.types";

const treatmentSessionSchema = new Schema<ITreatmentSession>(
  {
    treatmentPlanId: {
      type: Types.ObjectId,
      ref: "TreatmentPlan", // Ref to your TreatmentPlan model
      required: true,
    },
    treatmentId: {
      type: Types.ObjectId,
      ref: "Threatment", // Ref to your Threatment model
      required: true,
    },
    therapistIds: [
      {
        type: Types.ObjectId,
        ref: "User", // Ref to the User model (for therapists)
      },
    ],
    cabinId: {
      type: Types.ObjectId,
      ref: "Cabin", // Ref to your Cabin model
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String, // e.g., "10:00 AM" or "14:30"
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// 3. Create and Export the Model
export const TreatmentSession = model<ITreatmentSession>(
  "TreatmentSession",
  treatmentSessionSchema
);