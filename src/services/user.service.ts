import { FilterQuery, Types } from "mongoose";
import { IUser, User } from "../models/user.model";
import { IPaginatedUsers, IUserQueryOptions } from "../types/user.types";
import { ROLES } from "../constants/roles.constants";
import { BadRequestError } from "../utils/ApiError";

// Fields to exclude from user queries
const EXCLUDED_FIELDS = "-password -refreshTokens -passwordResetToken";

// Generic pagination function for users
const getPaginatedUsers = async (
  filter: FilterQuery<IUser>,
  options: IUserQueryOptions
): Promise<IPaginatedUsers> => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  const [users, totalDocs] = await Promise.all([
    User.find(filter)
      .select(EXCLUDED_FIELDS)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalDocs / limit);

  return {
    data: users,
    meta: { page, limit, totalDocs, totalPages },
  };
};

export const getProfile = async (userId: string) => {
  const user = await User.findById(userId).select("-password -refreshTokens");
  return user;
};

export const getAllEmployees = async (
  options: IUserQueryOptions
): Promise<IPaginatedUsers> => {
  const filter: FilterQuery<IUser> = {
    role: { $in: [ROLES.Admin, ROLES.Therapist, ROLES.Doctor] },
    is_active: true,
  };

  if (
    options.role &&
    [ROLES.Admin, ROLES.Therapist, ROLES.Doctor].includes(options.role)
  ) {
    filter.role = options.role;
  }

  return getPaginatedUsers(filter, options);
};

export const getAllUsers = async (
  options: IUserQueryOptions
): Promise<IPaginatedUsers> => {
  const filter: FilterQuery<IUser> = {
    role: ROLES.User,
    is_active: true,
  };

  return getPaginatedUsers(filter, options);
};

export const deleteUser = async (userId: string): Promise<IUser | null> => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new BadRequestError("Invalid user ID format");
  }

  const deactivatedUser = await User.findByIdAndUpdate(
    userId,
    { is_active: false },
    { new: true }
  );

  return deactivatedUser;
};
