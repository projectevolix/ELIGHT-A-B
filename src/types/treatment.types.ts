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

export type UpdateTreatmentData = Partial<IThreatment>;

export interface IQueryOptions {
  page?: number;
  limit?: number;
}

export interface IPaginatedTreatments {
  data: IThreatment[];
  meta: {
    page: number;
    limit: number;
    totalDocs: number;
    totalPages: number;
  };
}