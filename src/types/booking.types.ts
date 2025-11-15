import { Document, Types } from "mongoose";
import { IUser } from "../models/user.model";
import { BookingStatus } from "../constants/booking.constants";

export interface IBooking extends Document { 
    _id: Types.ObjectId;
    userId: IUser["_id"] | IUser;
    checkInDate: Date;
    checkOutDate: Date;
    description?: string;
    is_active: boolean;
    status: BookingStatus;
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
  startDate?: string; // Start date for date range filter
  endDate?: string; // End date for date range filter
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