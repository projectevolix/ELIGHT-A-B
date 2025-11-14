import { Schema, model} from "mongoose";
import { ICabin } from "../types/cabin.types";

const cabinSchema = new Schema<ICabin>({
  name: {
    type: String,
    required: true,
    unique: true, 
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  imageURL: {
    type: String,
    required: false,
    trim: true,
  },
  is_active: { 
    type: Boolean,
    default: true, 
  },
}, { 
  timestamps: true 
});

export const Cabin = model<ICabin>('Cabin', cabinSchema);