import { FilterQuery, Types } from "mongoose";
import { IUser, User } from "../models/user.model";
import { IPaginatedUsers, IUserQueryOptions } from "../types/user.tyoes";
import { ROLES } from "../constants/roles.constants";

export const getProfile = async (userId: string) => {
  const user = await User.findById(userId).select("-password -refreshTokens");
  return user;
};

export const getAllEmployees = async (
  options: IUserQueryOptions
): Promise<IPaginatedUsers> => {
  // 1. Set defaults
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  // 2. Build base filter
  const filter: FilterQuery<IUser> = {
    roles: { $in: [ROLES.Admin, ROLES.Therapist, ROLES.Doctor] },
  };

  // 3. Add role-specific filter if provided
  if (
    options.role &&
    [ROLES.Admin, ROLES.Therapist, ROLES.Doctor].includes(options.role)
  ) {
    filter.roles = options.role;
  }

  // 4. Execute queries
  const [employees, totalDocs] = await Promise.all([
    User.find(filter)
      .select("-password -refreshTokens -passwordResetToken")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  // 5. Return paginated data
  const totalPages = Math.ceil(totalDocs / limit);
  return {
    data: employees,
    meta: { page, limit, totalDocs, totalPages },
  };
};

export const getAllUsers = async (
  options: IUserQueryOptions
): Promise<IPaginatedUsers> => {
  // 1. Set defaults
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  // 2. Build fixed filter for ROLES.User
  const filter: FilterQuery<IUser> = {
    roles: ROLES.User,
  };

  // 3. Execute queries
  const [users, totalDocs] = await Promise.all([
    User.find(filter)
      .select("-password -refreshTokens -passwordResetToken")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  // 4. Return paginated data
  const totalPages = Math.ceil(totalDocs / limit);
  return {
    data: users,
    meta: { page, limit, totalDocs, totalPages },
  };
};

export const deleteUser = async (userId: string): Promise<IUser | null> => { 
  if (!Types.ObjectId.isValid(userId)) {
    return null;
  }

  const deactivatedUser = await User.findByIdAndUpdate(
    userId,
    { is_active: false }, 
    { new: true }
  );
  
  return deactivatedUser;
}