import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";
import { ApiResponse } from "../utils/ApiResponse";
import { UserRole } from "../constants/roles.constants";
import { NotFoundError, UnauthorizedError, asyncHandler } from "../utils/ApiError";

export const getProfile = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedError("Not authorized.");
    }

    const userId = req.user.id;
    const user = await userService.getProfile(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, user, "User profile fetched successfully"));
  }
);

export const getAllEmployees = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const role = req.query.role as UserRole;

    const result = await userService.getAllEmployees({ page, limit, role });

    res
      .status(200)
      .json(new ApiResponse(200, result, "Employees retrieved successfully"));
  }
);

export const getAllUsers = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const result = await userService.getAllUsers({ page, limit });

    res
      .status(200)
      .json(new ApiResponse(200, result, "Users retrieved successfully"));
  }
);

export const deleteUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    const deletedUser = await userService.deleteUser(userId);

    if (!deletedUser) {
      throw new NotFoundError("User not found");
    }

    res.status(200).json(
      new ApiResponse(
        200,
        null,
        "User deleted successfully"
      )
    );
  }
);
