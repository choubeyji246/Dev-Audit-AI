import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

export const authGuard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    // 1. Check for token in the Authorization header (Format: Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2. If no token found, block access immediately
    if (!token) {
      res.status(401).json({ status: 'fail', message: 'Not authorized, token missing' });
      return;
    }

    // 3. Verify token signature
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, secret) as DecodedToken;

    // 4. Fetch the user from MongoDB Atlas and attach to the request object
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      res.status(401).json({ status: 'fail', message: 'The user belonging to this token no longer exists' });
      return;
    }

    // Grant access to the protected route and store user context
    (req as any).user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({ status: 'fail', message: 'Not authorized, token invalid or expired' });
  }
};