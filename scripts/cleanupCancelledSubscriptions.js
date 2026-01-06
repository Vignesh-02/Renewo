import mongoose from 'mongoose';
import dayjs from 'dayjs';
import Subscription from '../models/subscription.model.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Deletes cancelled subscriptions older than X days
 */
const CLEANUP_AFTER_DAYS = 60; // change to 30 / 90 if needed

const cleanupCancelledSubscriptions = async () => {
  try {
    console.log('🧹 Starting cleanup job...');

    await mongoose.connect(process.env.MONGO_URI);

    const cutoffDate = dayjs()
      .subtract(CLEANUP_AFTER_DAYS, 'day')
      .toDate();

    const result = await Subscription.deleteMany({
      status: 'cancelled',
      cancelledAt: { $lte: cutoffDate },
    });

    console.log(
      `✅ Cleanup complete. Deleted ${result.deletedCount} subscriptions`
    );

    process.exit(0);
  } catch (error) {
    console.error('❌ Cleanup job failed:', error);
    process.exit(1);
  }
};

cleanupCancelledSubscriptions();
