import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import repoRoutes from './routes/repo.routes';
import clerkRoutes from './routes/webhook.routes';
import { initWorker } from './config/worker';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/repos', repoRoutes);
app.use('/api/webhooks', clerkRoutes)

// Base Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', message: 'DevAudit Core API Engine running.' });
});

// Production Global Error Handler Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Production server spinning at http://localhost:${PORT}`);
  initWorker(); // Start the background worker for processing audit tasks
});