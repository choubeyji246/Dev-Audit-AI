import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../types/user';

const userSchema = new Schema<IUser>(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'], 
      trim: true 
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'], 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    clerkId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
    password: { 
      type: String, 
      select: false // Excludes password from default query returns
    }
  },
  { 
    timestamps: true 
  }
);

// Method to safely compare login passwords remains perfect here
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  const currentPassword = this.password || '';
  if (!currentPassword) {
    return false;
  }
  return await bcrypt.compare(enteredPassword, currentPassword);
};

export const User = model<IUser>('User', userSchema);