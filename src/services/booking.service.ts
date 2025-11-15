import { FilterQuery, Types } from "mongoose";
import { Booking } from "../models/booking.model";
import {
  CreateBookingInput,
  IBooking,
  IPaginatedBookings,
  IQueryOptions,
} from "../types/booking.types";
import { User } from "../models/user.model";
import { BookingStatus } from "../constants/booking.constants";
import { BadRequestError } from "../utils/ApiError";

// Helper function to calculate pagination metadata
const calculatePaginationMeta = (page: number, limit: number, totalDocs: number) => {
  const totalPages = Math.ceil(totalDocs / limit);
  const skip = (page - 1) * limit;
  return { page, limit, totalDocs, totalPages, skip };
};

// Generic pagination function for bookings
const getPaginatedBookings = async (
  filter: FilterQuery<IBooking>,
  options: IQueryOptions,
  sortOptions: Record<string, 1 | -1> = { createdAt: -1 }
): Promise<IPaginatedBookings> => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  const [bookings, totalDocs] = await Promise.all([
    Booking.find(filter)
      .populate("userId", "f_name l_name email address id_card_number description")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(filter),
  ]);

  const { totalPages } = calculatePaginationMeta(page, limit, totalDocs);

  return {
    data: bookings,
    meta: { page, limit, totalDocs, totalPages },
  };
};

export const getAllBookings = async (
  options: IQueryOptions
): Promise<IPaginatedBookings> => {
  const bookingFilter: FilterQuery<IBooking> = { is_active: true };

  // Handle search by user name
  if (options.search) {
    const searchRegex = new RegExp(options.search, "i");
    const matchingUsers = await User.find({
      $or: [{ f_name: searchRegex }, { l_name: searchRegex }],
    }).select("_id");

    const userIds = matchingUsers.map((user) => user._id);
    bookingFilter.userId = { $in: userIds };
  }

  // Handle date range filter
  if (options.startDate || options.endDate) {
    const dateFilter: any = {};
    
    if (options.startDate) {
      dateFilter.$gte = new Date(options.startDate);
    }
    
    if (options.endDate) {
      dateFilter.$lte = new Date(options.endDate);
    }
    
    bookingFilter.checkInDate = dateFilter;
  }

  return getPaginatedBookings(bookingFilter, options);
};

export const createBooking = async (
  data: CreateBookingInput
): Promise<IBooking> => {
  const newBooking = new Booking(data);
  await newBooking.save();
  return newBooking;
};

export const deleteBooking = async (
  bookingId: string
): Promise<IBooking | null> => {
  if (!Types.ObjectId.isValid(bookingId)) {
    throw new BadRequestError("Invalid booking ID format");
  }

  const deletedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    { is_active: false },
    { new: true }
  );

  return deletedBooking;
};

export const updateBookingStatus = async (
  bookingId: string,
  newStatus: BookingStatus
): Promise<IBooking | null> => {
  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    { status: newStatus },
    { new: true }
  ).populate("userId", "f_name l_name email");

  return updatedBooking;
};

export const updateBookingDetails = async (
  bookingId: string,
  updateData: Partial<IBooking>
): Promise<IBooking | null> => {
  if (!Types.ObjectId.isValid(bookingId)) {
    throw new BadRequestError("Invalid booking ID format");
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    { $set: updateData },
    { new: true }
  ).populate("userId", "f_name l_name email");

  return updatedBooking;
};

export const getMyBookings = async (
  userId: string,
  options: IQueryOptions
): Promise<IPaginatedBookings> => {
  const filter: FilterQuery<IBooking> = {
    userId: new Types.ObjectId(userId),
    is_active: true,
  };

  return getPaginatedBookings(filter, options, { checkInDate: 1 });
};

export const getCheckedInBookingsForDoctor = async (
  options: IQueryOptions
): Promise<IPaginatedBookings> => {
  // Set today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter for bookings that are currently "checked in":
  // - checkInDate <= today (guest has already checked in)
  // - checkOutDate >= today (guest hasn't checked out yet)
  // - status is ACCEPTED
  // - booking is active
  const filter: FilterQuery<IBooking> = {
    checkInDate: { $lte: today },
    checkOutDate: { $gte: today },
    status: BookingStatus.Accepted,
    is_active: true,
  };

  return getPaginatedBookings(filter, options, { checkOutDate: 1 });
};

