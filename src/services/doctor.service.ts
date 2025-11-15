import { ROLES } from "../constants/roles.constants";
import { IUser, User } from "../models/user.model";
import { CreateDoctorInput } from "../types/doctor.types";
import { ConflictError } from "../utils/ApiError";

export const createDoctor = async (
  data: CreateDoctorInput
): Promise<IUser> => {
  // 1. Check if a user with this email already exists
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new ConflictError("A user with this email already exists.");
  }

  // 2. Create the new user with the "doctor" role
  const newDoctor = new User({
    ...data,
    role: ROLES.Doctor, 
  });

  // 3. Save the user (password will be hashed by the pre-save hook)
  await newDoctor.save();

  // 4. Return the new user
  return newDoctor;
};