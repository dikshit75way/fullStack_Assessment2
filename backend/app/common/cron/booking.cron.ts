
import cron from "node-cron";
import BookingModel from "../../booking/booking.schema";
import dayjs from "dayjs";

export const initBookingCron = () => {
    // Run every minute
    cron.schedule("* * * * *", async () => {
        try {
            const expirationTime = dayjs().subtract(15, "minute").toDate();
            
            // Find pending bookings older than 15 minutes
            const result = await BookingModel.updateMany(
                {
                    status: "pending",
                    createdAt: { $lt: expirationTime }
                },
                {
                    $set: { 
                        status: "cancelled", 
                        cancellationReason: "Payment timeout - System auto-cancel" 
                    }
                }
            );

            if (result.modifiedCount > 0) {
                console.log(`[Cron] Cancelled ${result.modifiedCount} expired pending bookings.`);
            }
        } catch (error) {
            console.error("[Cron] Error running booking cleanup:", error);
        }
    });
    
    console.log("[Cron] Booking cleanup job initialized.");
};
