import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
  headers: any;
  body: any;
  params: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const userId = req.headers['x-user-id'] as string;
  
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized: User ID is required' });
    return;
  }

  req.userId = userId;
  next();
};

