import { Router, Request, Response } from 'express';
import { Webhook } from 'svix';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const router = Router();

// Mongoose Baseline User Schema Reference
const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  username: { type: String },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.models.User || mongoose.model('clerkUser', UserSchema);

router.post(
  '/clerk',
  bodyParser.raw({ type: 'application/json' }),
  async (req: Request, res: Response): Promise<void> => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      res.status(500).json({ error: 'Missing webhook verification signing parameters.' });
      return;
    }

    // Read inbound Svix verification headers
    const svix_id = req.headers['svix-id'] as string;
    const svix_timestamp = req.headers['svix-timestamp'] as string;
    const svix_signature = req.headers['svix-signature'] as string;

    if (!svix_id || !svix_timestamp || !svix_signature) {
      res.status(400).json({ error: 'Missing required validation signatures.' });
      return;
    }

    const payload = req.body.toString();
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: any;

    try {
      evt = wh.verify(payload, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (err: any) {
      res.status(400).json({ error: 'Signature matching transaction verification failed.' });
      return;
    }

    const { id } = evt.data;
    const eventType = evt.type;

    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { email_addresses, username, image_url } = evt.data;
      const primaryEmail = email_addresses[0]?.email_address;

      // Upsert user account cleanly into MongoDB Atlas collection space
      await User.findOneAndUpdate(
        { clerkId: id },
        {
          clerkId: id,
          email: primaryEmail,
          username: username || primaryEmail.split('@')[0],
          avatar: image_url
        },
        { upsert: true, new: true }
      );
      console.log(`👤 Sync Engine: Successfully synchronized Clerk ID ${id} with MongoDB Atlas.`);
    }

    res.status(200).json({ success: true });
  }
);

export default router;