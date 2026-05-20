import { Queue } from 'bullmq';
import IORedis from 'ioredis';

// Establish a connection to our local Docker Redis instance
export const redisConnection = new IORedis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null, // Critical requirement for BullMQ compatibility
});

// Initialize our specialized repository scanning queue
export const repoScanQueue = new Queue('repo-scan-queue', {
  connection: redisConnection,
});

console.log('🛑 Redis Message Broker Queue Link Initialized.');