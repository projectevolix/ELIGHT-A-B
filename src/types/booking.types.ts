import { Document, Types } from "mongoose";
import { IUser } from "../models/user.model";
import { UserRole } from "../constants/roles.constants";

export interface IBooking extends Document { 
    _id: Types.ObjectId;
    userId: IUser["_id"] | IUser;
    checkInDate: Date;
    checkOutDate: Date;
    description?: string;
    is_active: boolean;
}

export type CreateBookingInput = {
  userId: IBooking['userId'];
  checkInDate: Date;
  checkOutDate: Date;
  description?: string;
}

export interface IQueryOptions {
  page?: number;
  limit?: number;
  search?: string; // For f_name, l_name
}

/**
 * The structure of the paginated response.
 */
export interface IPaginatedBookings {
  data: IBooking[];
  meta: {
    page: number;
    limit: number;
    totalDocs: number;
    totalPages: number;
  };
}