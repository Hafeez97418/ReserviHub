import Appointment from "@/models/Appointment.js";
import BusinessAnalytics from "@/models/BusinessAnalytics.js";
import { sequelize } from "@/repositories/connection.mysql.js";
import { io } from "@/server.js";
import cron from "node-cron";
import { Op, Sequelize } from "sequelize";

const appointmentSideJobs = () => {
  cron.schedule("*/10 * * * *", async () => {
    const transaction = await sequelize.transaction();
    try {
      //  Update Appointment statuses
      await Appointment.update(
        {
          status: Sequelize.literal(`
            CASE 
              WHEN status = 'pending' AND expiresAt < NOW() THEN 'failed'
              WHEN status = 'confirmed' AND endTime < NOW() THEN 'completed'
              ELSE status
            END
          `),
          expiresAt: Sequelize.literal(`
            CASE 
              WHEN status = 'pending' AND expiresAt < NOW() THEN NULL 
              ELSE expiresAt
            END
          `),
        },
        {
          where: {
            [Op.or]: [
              { status: "pending", expiresAt: { [Op.lt]: new Date() } },
              { status: "confirmed", endTime: { [Op.lt]: new Date() } },
            ],
          },
          transaction,
        }
      );

      // Update Payment statuses using JOIN
      await sequelize.query(
        `
        UPDATE Payments 
        INNER JOIN Appointments ON Payments.appointmentId = Appointments.id
        SET Payments.status = 
          CASE 
            WHEN Appointments.status = 'failed' THEN 'failed'
            WHEN Appointments.status = 'completed' THEN 'paid'
            ELSE Payments.status
          END
        WHERE Appointments.status IN ('failed', 'completed');
        `,
        { transaction }
      );

      await transaction.commit();
    } catch (error:any) {
      await transaction.rollback();
      console.error(
        "❌ Failed to update appointments and payments:",
        error.message
      );
    }
  });
};

const updatePeakHours = async (businessId: string, startTime: Date) => {
  const analytics: any = await BusinessAnalytics.findOne({
    where: { businessId },
  });

  if (!analytics) return;

  // Ensure peakHours is an array
  if (!Array.isArray(analytics.peakHours)) {
    analytics.peakHours = [];
  }

  // Extract appointment time (e.g., "14:00" for 2 PM)
  const appointmentTime = new Date(startTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Get the day of the week
  const dayOfWeek = new Date().toLocaleString("en-US", { weekday: "long" });

  // Find if this day and time already exist in the array
  const existingEntry = analytics.peakHours.find(
    (entry: any) => entry.day === dayOfWeek && entry.time === appointmentTime
  );

  if (existingEntry) {
    // If the entry exists, increment the count
    existingEntry.count += 1;
  } else {
    // Otherwise, add a new entry
    let present = false;
    for (let i = 0; i < analytics.peakHours.length; i++) {
      const data = analytics.peakHours[i];
      if (dayOfWeek === data.day) {
        analytics.peakHours[i].count += 1;
        present = true;
        break;
      }
    }
    if (!present) {
      analytics.peakHours.push({
        day: dayOfWeek,
        time: appointmentTime,
        count: 1,
      });
    }
  }

  // Explicitly mark JSON field as changed
  analytics.changed("peakHours", true);
  // Save the updated record
};

const getAnalytics = async (businessId: string) => {
  try {
    // Count missed and completed appointments in a single query
    const appointments: any[] = await Appointment.findAll({
      where: {
        businessId,
        status: { [Op.or]: ["cancelled", "failed", "completed"] },
      },
      attributes: [
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal('status IN ("cancelled", "failed")')
          ),
          "missedAppointments",
        ],
        [
          Sequelize.fn("SUM", Sequelize.literal('status = "completed"')),
          "completedAppointments",
        ],
      ],
      raw: true,
    });

    // Find business analytics
    let analytics: any = await BusinessAnalytics.findOne({
      where: { businessId },
    });

    if (!analytics) {
      return { success: false, error: "Business analytics not found" };
    }

    // Update analytics
    analytics.missedAppointments =
      Number(appointments[0].missedAppointments) || 0;
    analytics.completedAppointments =
      Number(appointments[0].completedAppointments) || 0;
    analytics.totalAppointments =
      analytics.missedAppointments + analytics.completedAppointments;

    await analytics.save();

    return { success: true, analytics };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return { success: false, error };
  }
};

const updateRevenue = async (businessId: string, amount: number) => {
  try {    
    const analytics = (await BusinessAnalytics.findOne({
      where: { businessId },
    })) as any;
       
    if (!analytics) {
      return { success: false, error: "Business analytics not found" };
    }
    
    // Ensure proper numerical addition
    analytics.totalRevenue = (
      parseFloat(analytics.totalRevenue) + amount
    ).toFixed(2);    
    await analytics.save(); // Ensure async save is awaited

    return { success: true, analytics };
  } catch (error) {
    return { success: false, error };
  }
};


const sendEvent = (id: string, eventName: string, data: any) => {
  const ev = eventName;
  const args = data ? data : {}; 
  io.to(id).emit(ev, args);
}
export { appointmentSideJobs, getAnalytics, updatePeakHours, updateRevenue , sendEvent};
