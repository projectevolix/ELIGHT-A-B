import { Types } from "mongoose";
import { IUser } from "../models/user.model";

export interface ITreatmentPlan extends Document {
  _id: Types.ObjectId;
  userId: IUser["_id"] | IUser; // Link to the user
  mealPlan: string;           // The meal plan text
  voiceUrl?: string;          // Optional URL for a voice note
  createdAt: Date;
  updatedAt: Date;
}