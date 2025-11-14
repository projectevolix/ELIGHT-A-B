import { Types } from "mongoose";

export interface ICabin extends Document {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  imageURL?: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateCabinInput = {
  name: string;
  description?: string;
  imageURL?: string;
};

export type UpdateCabinInput = Partial<CreateCabinInput>;

// Options for pagination
export interface IQueryOptions {
  page?: number;
  limit?: number;
}

// Structure of the paginated response
export interface IPaginatedCabins {
  data: ICabin[];
  meta: {
    page: number;
    limit: number;
    totalDocs: number;
    totalPages: number;
  };
}