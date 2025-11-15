import { ROLES } from "../constants/roles.constants";
import { IUser, User } from "../models/user.model";
import { CreateTherapistInput } from "../types/therapist.types";
import { BadRequestError, ConflictError } from "../utils/ApiError";

export const createTherapist = async (
  data: CreateTherapistInput 
): Promise<IUser> => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new ConflictError("A user with this email already exists.");
  }

  const newTherapist = new User({
    ...data,
    role: ROLES.Therapist, 
  });

  await newTherapist.save();

  return newTherapist;
};