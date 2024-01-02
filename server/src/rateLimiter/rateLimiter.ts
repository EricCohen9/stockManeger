import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5, 
  message: 'Too many login attempts. Please try again later.',
});

