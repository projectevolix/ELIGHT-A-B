import { Document, Types } from "mongoose";
import { IUser } from "../models/user.model";

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