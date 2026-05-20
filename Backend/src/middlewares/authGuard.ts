import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createClerkClient, createClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { User } from '../models/User';

const clerkSecret = process.env.CLERK_SECRET_KEY || process.env.CLERK_API_KEY;
const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';

if (!clerkSecret) {
  throw new Error('Missing Clerk secret key. Set CLERK_SECRET_KEY or CLERK_API_KEY in environment variables.');
}

const clerkClient = createClerkClient({
  apiKey: clerkSecret,
});

const clerkRequireAuth = createClerkExpressRequireAuth({
  clerkClient,
  secretKey: clerkSecret,
});

export const authGuard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      res.status(401).json({ status: 'fail', message: 'Missing authorization token.' });
      return;
    }

    let currentUser = null;

    try {
      await new Promise<void>((resolve, reject) => {
        clerkRequireAuth()(req as any, res as any, (err?: unknown) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      const auth = (req as any).auth;
      const clerkId = auth?.userId as string | undefined;

      if (clerkId) {
        currentUser = await User.findOne({ clerkId });

        if (!currentUser) {
          const email = auth?.claims?.email || auth?.claims?.email_address || `user-${clerkId}@clerk.local`;
          const name = auth?.claims?.name || auth?.claims?.given_name || `ClerkUser-${clerkId.slice(0, 8)}`;

          currentUser = await User.create({
            clerkId,
            name,
            email,
          } as any);
        }
      }
    } catch {
      // Clerk auth failed, fallback to manual JWT.
    }

    if (!currentUser) {
      try {
        const decoded = jwt.verify(token, jwtSecret) as { id: string };
        currentUser = await User.findById(decoded.id);
      } catch {
        // ignore invalid manual token
      }
    }

    if (!currentUser) {
      res.status(401).json({ status: 'fail', message: 'Not authorized, token invalid or expired' });
      return;
    }

    (req as any).user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({ status: 'fail', message: 'Not authorized, token invalid or expired' });
  }
};