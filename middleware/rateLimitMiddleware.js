import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  keyGenerator: (req) => req.user?.id?.toString() || req.ip,
  message: {
    success: false,
    message: "Too many events logged. Please try again later."
  }
});