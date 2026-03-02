import express from 'express';
import { getUsers, updateUserRole, getUserProfile } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getUsers);
router.route('/profile').get(protect, getUserProfile);
router.route('/:id/role').put(protect, admin, updateUserRole);

export default router;
