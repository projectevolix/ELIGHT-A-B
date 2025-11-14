import { Types } from "mongoose";
import { ITreatmentPlan } from "./treatment_plan.types";
import { IThreatment } from "./treatment.types";
import { IUser } from "../models/user.model";
import { ICabin } from "./cabin.types";

export interface ITreatmentSession extends Document {
  _id: Types.ObjectId;
  treatmentPlanId: ITreatmentPlan["_id"] | ITreatmentPlan;
  treatmentId: IThreatment["_id"] | IThreatment;
  therapistIds: (IUser["_id"] | IUser)[]; // Array of User IDs
  cabinId: ICabin["_id"] | ICabin;
  date: Date; // The date of the session
  time: string; // The time of the session (e.g., "14:30")
  createdAt: Date;
  updatedAt: Date;
}