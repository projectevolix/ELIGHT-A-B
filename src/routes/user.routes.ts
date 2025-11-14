import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { ROLES } from '../constants/roles.constants';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get(
  '/profile', 
  authorize([ROLES.User, ROLES.Admin, ROLES.Therapist, ROLES.Doctor]), 
  userController.getProfile
);

router.get(
  '/employees', 
  authorize([ROLES.Admin]), 
  userController.getAllEmployees
);

router.get(
  '/',
  authorize([ROLES.Admin]),
  userController.getAllUsers
);

router.delete(
  '/:userId/delete',
  authorize([ROLES.Admin]),
  userController.deleteUser
);

export default router;