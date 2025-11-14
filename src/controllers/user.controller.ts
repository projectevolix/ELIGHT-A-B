import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";
import { ApiResponse } from "../utils/ApiResponse";
import { UserRole } from "../constants/roles.constants";
import { NotFoundError } from "../utils/ApiError";
import { Types } from "mongoose";

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized." });
    }

    const userId = req.user.id;
    const user = await userService.getProfile(userId);

    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, user, "User profile fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const getAllEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const role = req.query.role as UserRole;

    const result = await userService.getAllEmployees({ page, limit, role });

    res
      .status(200)
      .json(new ApiResponse(200, result, "Employees retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const result = await userService.getAllUsers({ page, limit });

    res
      .status(200)
      .json(new ApiResponse(200, result, "Users retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Get the userId from the URL parameters
    const { userId } = req.params;

    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundError("User not found");
    }

    // 2. Call the service to deactivate the user
    const deletedUser = await userService.deleteUser(userId);

    
    // 3. If no user was found/updated, throw a 404 error
    if (!deletedUser) {
      throw new NotFoundError("User not found");
    }

    // 4. Send a successful response
    res.status(200).json(
      new ApiResponse(
        200,
        null, // No data needed, just confirmation
        "User deleted successfully"
      )
    );
  } catch (error) {
    // 5. Pass any errors to the global error handler
    next(error);
  }
};
