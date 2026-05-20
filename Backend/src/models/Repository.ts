import mongoose, { Schema, Document } from 'mongoose';

export interface IRepository extends Document {
  userId: mongoose.Types.ObjectId;
  owner: string;
  repoName: string;
  scanStatus: 'pending' | 'processing' | 'completed' | 'failed';
  analysisReport?: string; // Field to hold the markdown analysis report
  createdAt: Date;
}

const RepositorySchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  owner: { type: String, required: true },
  repoName: { type: String, required: true },
  scanStatus: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed'], 
    default: 'pending' 
  },
  analysisReport: { type: String, default: '' }, // Initialized empty
  createdAt: { type: Date, default: Date.now }
});

export const Repository = mongoose.model<IRepository>('Repository', RepositorySchema);