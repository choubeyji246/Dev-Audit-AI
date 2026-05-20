// src/routes/auth.routes.ts
import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { RegisterSchema, LoginSchema } from '../controllers/auth.schema';
import { authGuard } from '../middlewares/authGuard';
import { IUser } from '../types/user'; // Ensure you import your User interface

const router = Router();

// Public Routes
router.post('/register', validateRequest(RegisterSchema), register);
router.post('/login', validateRequest(LoginSchema), login);

// Protected Route 
router.get('/profile', authGuard, (req, res) => {
  // Production safe type assertion to bypass ts-node compilation context drops
  const authUser = (req as any).user as IUser | undefined;

  if (!authUser) {
     res.status(401).json({ status: 'fail', message: 'User context not found' });
     return;
  }

  res.status(200).json({
    status: 'success',
    user: {
      id: authUser._id,
      name: authUser.name,
      email: authUser.email,
      createdAt: authUser.createdAt,
    }
  });
});

export default router;