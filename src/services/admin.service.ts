import { NextFunction, Request, Response } from "express";
import { AdminCreationData } from "../types/admin.types";
import { IUser, User } from "../models/user.model";
import { logger } from "../config/logger.config";
import { BadRequestError } from "../utils/ApiError";

export const createAdmin = async (data: AdminCreationData): Promise<IUser> => {
    // 1. Check if user (admin) already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
        // Throw a specific error that the controller can catch
        throw new Error("An account with this email already exists.");
    }

    // 2. Create the new admin user
    const newAdmin = new User({
        ...data,
        roles: ['admin'], // Hardcode the role to 'admin'
        is_active: true
    });

    // 3. Save to the database (the 'pre-save' hook will hash the password)
    try {
        await newAdmin.save();
    } catch (error) {
        logger.error("Error saving new admin user:", error);
        throw new BadRequestError("Failed to create admin user.");
    }

    // 4. Return the new user
    // Note: Mongoose's .save() returns the doc. If you need to remove the password:
    const adminObject = newAdmin.toObject();
    delete adminObject.password;
    
    return adminObject;
};
