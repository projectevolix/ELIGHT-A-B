import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../constants/roles.constants";
import { JWT_SECRET } from "../config/env.config";
import { JwtPayload } from "../types/express.d"; 
import { ForbiddenError, UnauthorizedError } from "../utils/ApiError";

/**
 * Authentication (AuthN) - Verifies JWT
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired." });
    }
    return res.status(401).json({ message: "Invalid token." });
  }
};

/**
 * Authorization (AuthZ) - Verifies Roles
 */
export const authorize = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      throw new UnauthorizedError("Not authenticated or user role is missing.");
    }

    const hasPermission = allowedRoles.includes(req.user.role);

    if (!hasPermission) {
      throw new ForbiddenError(
        'Forbidden. You do not have the required permissions.'
      );
    }

    next();
  };
};
