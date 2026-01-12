
import { Queue, Worker, Job } from 'bullmq';
import * as bookingService from '../../booking/booking.service';

const QUEUE_NAME = 'booking-timeout';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
};

export const bookingQueue = new Queue(QUEUE_NAME, {
  connection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export const addBookingTimeoutJob = async (bookingId: string) => {
  await bookingQueue.add(
    'cancel-pending-booking',
    { bookingId },
    { delay: 15 * 60 * 1000 } // 15 minutes
  );
};

// Worker implementation
export const bookingWorker = new Worker(
  QUEUE_NAME,
  async (job: Job) => {
    const { bookingId } = job.data;
    console.log(`[Queue] Processing timeout for booking: ${bookingId}`);

    try {
      const booking = await bookingService.getBookingById(bookingId);
      
      if (booking && booking.status === 'pending') {
        await bookingService.cancelBooking(bookingId, 'Payment timeout - System auto-cancel');
        console.log(`[Queue] Booking ${bookingId} auto-cancelled due to timeout.`);
      } else {
        console.log(`[Queue] Booking ${bookingId} is no longer pending (status: ${booking?.status}). Skipping cancellation.`);
      }
    } catch (error) {
      console.error(`[Queue] Error processing timeout for booking ${bookingId}:`, error);
      throw error;
    }
  },
  { connection }
);

bookingWorker.on('completed', (job) => {
  console.log(`[Queue] Job ${job.id} completed`);
});

bookingWorker.on('failed', (job, err) => {
  console.error(`[Queue] Job ${job?.id} failed with error: ${err.message}`);
});
