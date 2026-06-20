import express from 'express';
import { createEvent } from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';
import { rateLimiter } from '../middleware/rateLimitMiddleware.js';
import { validateEvent } from '../utils/validateEvent.js';

const router = express.Router();

router.post('/', protect, rateLimiter, validateEvent, createEvent);

export default router;