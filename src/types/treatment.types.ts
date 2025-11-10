import { Document } from "mongoose";

export interface IThreatment extends Document{
    name: string;
    description: string;
    duration: number;
    resources: string[]; 
    benifits: string[];
    imgUrl?: string;
}

export type CreateTreatmentInput = {
  name: string;
  description?: string;
  duration: number;
  resources: string[];
  benifits: string[]; // Matches your interface spelling
  imgUrl?: string;
};