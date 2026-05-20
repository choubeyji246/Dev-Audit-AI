import { Request, Response, NextFunction } from 'express';
import { Repository } from '../models/Repository';
import { repoScanQueue } from '../config/queue';
import axios from 'axios';

export const triggerRepoScan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { owner, repoName } = req.body;
    // Bypassing the Request type override using our runtime cast
    const authUser = (req as any).user;

    if (!owner || !repoName) {
      res.status(400).json({ status: 'fail', message: 'Please provide both repository owner and repository name.' });
      return;
    }

    // Check if we are already scanning this repository for this user to avoid duplicates
    let repoRecord = await Repository.findOne({ userId: authUser._id, owner, repoName });

    if (repoRecord && (repoRecord.scanStatus === 'pending' || repoRecord.scanStatus === 'processing')) {
      res.status(200).json({
        status: 'success',
        message: 'Scan already in progress for this repository.',
        repoId: repoRecord._id,
      });
      return;
    }

    // If no active record exists, create a fresh tracking reference
    if (!repoRecord) {
      repoRecord = await Repository.create({
        userId: authUser._id,
        owner,
        repoName,
        scanStatus: 'pending',
      });
    } else {
      // If an old scan failed or completed, reset its state back to pending
      repoRecord.scanStatus = 'pending';
      await repoRecord.save();
    }

    // Push the scanning configuration job to BullMQ
    const job = await repoScanQueue.add(`scan:${repoRecord._id}`, {
      repoId: repoRecord._id,
      owner,
      repoName,
      userId: authUser._id,
    });

    // Send a 202 Accepted response back immediately to keep our UI snappy
    res.status(202).json({
      status: 'accepted',
      message: 'Repository scan job successfully queued.',
      repoId: repoRecord._id,
      jobId: job.id,
    });
  } catch (error) {
    next(error);
  }
};


export const triggerRepoChat = async (req: Request, res: Response) => {
  try {
    const { repoId } = req.params;
    const { query } = req.body;

    if (!query) {
       res.status(400).json({ error: 'Query string parameter is required.' });
       return;
    }

    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
    
    // Forward query directly down to our Python service layer
    const response = await axios.post(`${aiServiceUrl}/ai/chat`, {
      repoId,
      query
    });

    res.json(response.data);
  } catch (error: any) {
    console.error('💥 Gateway Chat Routing Error:', error.message);
    res.status(500).json({ error: 'Failed to retrieve response from AI engine.' });
  }
}