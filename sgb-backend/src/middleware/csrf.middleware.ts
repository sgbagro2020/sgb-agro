import { Request, Response, NextFunction } from 'express';
import { config } from '../config/index.js';

export const csrfOriginProtection = (req: Request, res: Response, next: NextFunction) => {
  // In production only, check write requests for Origin match with FRONTEND_URL
  if (config.nodeEnv === 'production') {
    const writeMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
    if (writeMethods.includes(req.method.toUpperCase())) {
      const origin = req.headers.origin;
      if (!origin || origin !== config.frontendUrl) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Origin header does not match FRONTEND_URL',
        });
      }
    }
  }
  return next();
};
