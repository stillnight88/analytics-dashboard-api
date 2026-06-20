import express from 'express';
import {
    getEventSummary,
    getUserTimeline,
    getTopUsers
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/summary',protect,isAdmin,getEventSummary);
router.get('/user/:userId', protect, isAdmin, getUserTimeline);
router.get('/top-users', protect, isAdmin, getTopUsers);

export default router;