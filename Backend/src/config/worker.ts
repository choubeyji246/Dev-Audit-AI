import { Worker, Job } from 'bullmq';
import { redisConnection } from './queue';
import { Repository } from '../models/Repository';
import { fetchRepositoryContents } from './github.service';
import axios from 'axios';

export const initWorker = () => {
  const worker = new Worker(
    'repo-scan-queue',
    async (job: Job) => {
      const { repoId, owner, repoName } = job.data;
      console.log(`⏳ Job ${job.id}: Commencing analysis processing for ${owner}/${repoName}...`);

      try {
        // 1. Shift database status to "processing" inside MongoDB Atlas
        await Repository.findByIdAndUpdate(repoId, { scanStatus: 'processing' });

        // 2. Fetch code assets from GitHub
        console.log(`🗂️ Job ${job.id}: Traversing file trees via authenticated GitHub APIs...`);
        const repositoryFiles = await fetchRepositoryContents(owner, repoName);
        
        console.log(`✅ Job ${job.id}: Extracted ${repositoryFiles.length} source code files cleanly.`);

        // Safety Guard: Terminate early if the repository contains zero supported files
        if (repositoryFiles.length === 0) {
          await Repository.findByIdAndUpdate(repoId, { scanStatus: 'completed' });
          console.log(`⚠️ Job ${job.id}: No target code files found. Terminating task matrix.`);
          return;
        }

        // 3. TRANSMIT PAYLOAD TO FASTAPI AI ENGINE
        console.log(`🚀 Job ${job.id}: Transmitting data payload to FastAPI AI Service...`);
        
        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
        
        const aiResponse = await axios.post(`${aiServiceUrl}/ai/analyze`, {
          repoId: repoId,
          files: repositoryFiles,
        });

        // Extract the beautiful analysis text from the FastAPI response payload
        const auditReportText = aiResponse.data.report;

        // 4. Update MongoDB Document with completed status and the analysis text
        await Repository.findByIdAndUpdate(repoId, { 
          scanStatus: 'completed',
          analysisReport: auditReportText
        });
        
        console.log(`🎉 Job ${job.id}: End-to-end background processing finished successfully!`);
        
      } catch (error: any) {
        console.error(`💥 Job ${job.id} Execution Failure:`, error.message);
        await Repository.findByIdAndUpdate(repoId, { scanStatus: 'failed' });
        throw error;
      }
    },
    {
      connection: redisConnection,
      concurrency: 1,
    }
  );

  worker.on('completed', (job) => {
    console.log(`🏁 Worker Job ${job.id} has cleared the execution matrix safely.`);
  });

  worker.on('failed', (job, err) => {
    console.error(`🚨 Worker Job ${job?.id} declared a critical execution halt: ${err.message}`);
  });
};