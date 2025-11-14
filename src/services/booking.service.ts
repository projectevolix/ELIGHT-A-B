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
import { NotFoundError } from "../utils/ApiError";

export const getAllBookings = async (
  options: IQueryOptions
): Promise<IPaginatedBookings> => {
  // --- 1. Set Defaults & Pagination ---
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  // --- 2. Build Filter Query ---
  const bookingFilter: FilterQuery<IBooking> = {};

  // --- 3. Handle Search (f_name, l_name) ---
  if (options.search) {
    const searchRegex = new RegExp(options.search, "i");

    // Find users who match the search
    const matchingUsers = await User.find({
      $or: [{ f_name: searchRegex }, { l_name: searchRegex }],
    }).select("_id"); // We only need their IDs

    // Get an array of just the IDs
    const userIds = matchingUsers.map((user) => user._id);

    // Filter bookings where the 'userId' is in our list of matched users
    bookingFilter.userId = { $in: userIds };
  }

  // --- 4. Execute Queries ---
  const [bookings, totalDocs] = await Promise.all([
    // Query 1: Get the paginated bookings
    Booking.find(bookingFilter)
      .populate("userId", "f_name l_name email") // Populate user details
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    // Query 2: Get the total document count matching the filter
    Booking.countDocuments(bookingFilter),
  ]);

  // --- 5. Calculate Total Pages ---
  const totalPages = Math.ceil(totalDocs / limit);

  // --- 6. Format and Return Response ---
  return {
    data: bookings,
    meta: {
      page,
      limit,
      totalDocs,
      totalPages,
    },
  };
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
  // Validate the ID
  if (!Types.ObjectId.isValid(bookingId)) {
    return null;
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
  // 1. Validate the ID format
  if (!Types.ObjectId.isValid(bookingId)) {
    return null; // Return null if ID is invalid
  }

  // 2. Find the booking and update it
  // { new: true } tells Mongoose to return the *updated* document
  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    { $set: updateData }, // Use $set to apply partial updates safely
    { new: true }
  ).populate("userId", "f_name l_name email"); // Populate user details

  // 3. Return the updated document (or null if not found)
  return updatedBooking;
};

const getPaginatedBookings = async (
  filter: FilterQuery<IBooking>,
  options: IQueryOptions
): Promise<IPaginatedBookings> => {
  // 1. Set pagination defaults
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  // 2. Run queries in parallel
  const [bookings, totalDocs] = await Promise.all([
    Booking.find(filter)
      .populate("userId", "f_name l_name email")
      .sort({ checkInDate: 1 }) // Sort by upcoming date
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(filter),
  ]);

  // 3. Calculate total pages
  const totalPages = Math.ceil(totalDocs / limit);

  // 4. Return paginated response
  return {
    data: bookings,
    meta: {
      page,
      limit,
      totalDocs,
      totalPages,
    },
  };
};

export const getMyBookings = async (
  userId: string,
  options: IQueryOptions
): Promise<IPaginatedBookings> => {
  const filter = { userId: new Types.ObjectId(userId) };
  return getPaginatedBookings(filter, options);
};
