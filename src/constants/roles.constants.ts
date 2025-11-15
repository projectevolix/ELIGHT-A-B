export type UserRole = 'USER' | 'ADMIN' | 'THERAPIST' | 'DOCTOR';

export const ROLES = {
  User: 'USER' as UserRole,
  Admin: 'ADMIN' as UserRole,
  Therapist: 'THERAPIST' as UserRole,
  Doctor: 'DOCTOR' as UserRole,
};

export const ROLE_LIST = [ROLES.User, ROLES.Admin, ROLES.Therapist, ROLES.Doctor];