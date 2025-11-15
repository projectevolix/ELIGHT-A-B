import { NextFunction, Request, Response } from "express";
import { AdminCreationData } from "../types/admin.types";
import { IUser, User } from "../models/user.model";
import { logger } from "../config/logger.config";
import { BadRequestError, ConflictError } from "../utils/ApiError";
import { ROLES } from "../constants/roles.constants";

export const createAdmin = async (data: AdminCreationData): Promise<IUser> => {
    // 1. Check if user (admin) already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
        // Throw a specific error that the controller can catch
        throw new ConflictError("An account with this email already exists.");
    }

    // 2. Create the new admin user
    const newAdmin = new User({
        ...data,
        role: ROLES.Admin, 
        is_active: true
    });

    // 3. Save to the database (the 'pre-save' hook will hash the password)
    await newAdmin.save();

    // 4. Return the new user
    return newAdmin;
};
