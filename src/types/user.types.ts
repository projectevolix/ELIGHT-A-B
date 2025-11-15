import { UserRole } from "../constants/roles.constants";
import { IUser } from "../models/user.model";

export interface IUserQueryOptions {
  page?: number;
  limit?: number;
  role?: UserRole; 
}

/**
 * The structure of a paginated response for users.
 */
export interface IPaginatedUsers {
  data: IUser[];
  meta: {
    page: number;
    limit: number;
    totalDocs: number;
    totalPages: number;
  };
}