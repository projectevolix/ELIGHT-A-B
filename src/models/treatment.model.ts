import { model, Schema } from "mongoose";
import { IThreatment } from "../types/treatment.types";

const userSchema = new Schema<IThreatment>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: false,
        trim: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    resources: {
        type: [String],
        required: true,
    },
    benifits: {
        type: [String],
        required: true,
    },
    imgUrl: {
        type: String,
        required: false,
        trim: true,
    },
}, { timestamps: true })

export const Threatment = model<IThreatment>('Threatment', userSchema);