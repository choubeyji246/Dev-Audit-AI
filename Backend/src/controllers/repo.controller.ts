import { Request, Response, NextFunction } from 'express';
import { Repository } from '../models/Repository';
import { User } from '../models/User'; // 🌟 Correct up-one level reference mapping paths
import { repoScanQueue } from '../config/queue';
import axios from 'axios';

const deriveReportSummary = (text: string) => {
  const normalized = text.toLowerCase();
  const securityKeywords = normalized.match(/security|vulnerabilit|xss|sql injection|csrf|authentication|authorization|secret|credential|privilege/g) || [];
  const performanceKeywords = normalized.match(/performance|latency|throughput|bottleneck|optimiz|cpu|memory/g) || [];
  const qualityKeywords = normalized.match(/maintainability|readability|duplication|style|complexity|best practice/g) || [];

  const securityCount = Math.max(1, Math.min(8, securityKeywords.length));
  const performanceCount = Math.max(1, Math.min(8, performanceKeywords.length));
  const qualityCount = Math.max(1, Math.min(8, qualityKeywords.length));
  const scoreBase = 10 - Math.min(7, Math.round((securityCount + performanceCount + qualityCount) / 2));
  const score = Math.max(2, Math.min(10, scoreBase));

  return { score, securityCount, performanceCount, qualityCount };
};

export const triggerRepoScan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { owner, repoName } = req.body;
    const authUser = (req as any).user;

    if (!owner || !repoName) {
      res.status(400).json({ status: 'fail', message: 'Please provide both repository owner and repository name.' });
      return;
    }

    // 🔒 STRATEGY 3 SHIELD: Verify if the executing account profile houses Admin clearances
    const fullUser = await User.findById(authUser._id);
    if (!fullUser) {
      res.status(404).json({ status: 'fail', message: 'User identity context not found.' });
      return;
    }

    if (!fullUser.isAdmin) {
      res.status(403).json({
        status: 'forbidden',
        message: 'Demo Mode Active: Scanning custom repositories is temporarily restricted to avoid OpenAI credit drain. Please contact Ankit Choubey to white-list your target account authorization rights.'
      });
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

    if (!repoRecord) {
      repoRecord = await Repository.create({
        userId: authUser._id,
        owner,
        repoName,
        scanStatus: 'pending',
      });
    } else {
      repoRecord.scanStatus = 'pending';
      await repoRecord.save();
    }

    const job = await repoScanQueue.add(`scan:${repoRecord._id}`, {
      repoId: repoRecord._id,
      owner,
      repoName,
      userId: authUser._id,
    });

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

export const getRepoReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { repoId } = req.params;
    const authUser = (req as any).user;

    if (!repoId) {
      res.status(400).json({ status: 'fail', message: 'repoId is required' });
      return;
    }

    const repo = await Repository.findOne({ _id: repoId, userId: authUser._id });
    if (!repo) {
      res.status(404).json({ status: 'fail', message: 'Repository not found' });
      return;
    }

    // 🟢 FIXED: Pipes clean Markdown text strings without throwing JSON parse error loops
    if (repo.analysisReport) {
      let reportText = repo.analysisReport;
      let score = 8;
      let securityCount = 1;
      let performanceCount = 1;
      let qualityCount = 1;

      try {
        const parsed = JSON.parse(repo.analysisReport);
        reportText = typeof parsed.report === 'string' ? parsed.report : repo.analysisReport;
        if (typeof parsed.score === 'number') score = parsed.score;
        if (typeof parsed.securityCount === 'number') securityCount = parsed.securityCount;
        if (typeof parsed.performanceCount === 'number') performanceCount = parsed.performanceCount;
        if (typeof parsed.qualityCount === 'number') qualityCount = parsed.qualityCount;
      } catch (e) {
        // Safe string fallback processing
        const derived = deriveReportSummary(repo.analysisReport);
        score = derived.score;
        securityCount = derived.securityCount;
        performanceCount = derived.performanceCount;
        qualityCount = derived.qualityCount;
      }

      res.status(200).json({
        status: 'success',
        repoName: repo.repoName,
        scanStatus: repo.scanStatus,
        analysisReport: reportText, 
        score,
        securityCount,
        performanceCount,
        qualityCount,
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      repoName: repo.repoName,
      scanStatus: repo.scanStatus,
      score: 0,
      securityCount: 0,
      performanceCount: 0,
      qualityCount: 0,
      analysisReport: '',
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
    const response = await axios.post(`${aiServiceUrl}/ai/chat`, { repoId, query });
    res.json(response.data);
  } catch (error: any) {
    console.error('💥 Gateway Chat Routing Error:', error.message);
    res.status(500).json({ error: 'Failed to retrieve response from AI engine.' });
  }
};

export const getMetricsSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = (req as any).user;
    const totalReviews = await Repository.countDocuments({ userId: authUser._id });
    const recent = await Repository.find({ userId: authUser._id }).sort({ createdAt: -1 }).limit(5).lean();

    let totalScore = 0;
    let scoreCount = 0;
    let totalSecurityIssues = 0;
    let totalHighSeverity = 0;

    const recentReviews = recent.map((r) => {
      let score = 0;
      let issuesLabel = 'Generated';

      if (r.analysisReport) {
        const derived = deriveReportSummary(r.analysisReport || '');
        score = derived.score;
        totalScore += derived.score;
        scoreCount += 1;
        totalSecurityIssues += derived.securityCount;
      }

      return {
        id: r._id,
        name: r.repoName,
        score,
        issues: issuesLabel,
        date: r.createdAt?.toDateString?.() || new Date(r.createdAt).toDateString(),
      };
    });

    res.status(200).json({
      totalReviews,
      securityIssues: totalSecurityIssues,
      avgScore: scoreCount > 0 ? Number((totalScore / scoreCount).toFixed(1)) : 0,
      highSeverity: totalHighSeverity,
      recentReviews,
    });
  } catch (error) {
    next(error);
  }
};

export const listUserRepos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = (req as any).user;
    const repos = await Repository.find({ userId: authUser._id }).sort({ createdAt: -1 }).lean();
    const payload = repos.map(r => ({ id: r._id, owner: r.owner, repoName: r.repoName, scanStatus: r.scanStatus, createdAt: r.createdAt }));
    res.status(200).json({ status: 'success', repos: payload });
  } catch (error) {
    next(error);
  }
};