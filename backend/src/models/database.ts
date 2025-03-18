import Appointment from "./Appointment.js";
import AppointmentInterval from "./AppointmentInterval.js";
import Business from "./Business.js";
import BusinessAnalytics from "./BusinessAnalytics.js";
import Payment from "./Payments.js";
import Review from "./Reviews.js";
import User from "./User.js";

User.hasMany(Business, { foreignKey: "managerId" });
Business.belongsTo(User, { foreignKey: "managerId" });

Business.hasMany(AppointmentInterval, { foreignKey: "businessId" });
AppointmentInterval.belongsTo(Business, { foreignKey: "businessId" });

User.hasMany(Appointment, { foreignKey: "userId" });
Appointment.belongsTo(User, { foreignKey: "userId" });

Business.hasMany(Appointment, { foreignKey: "businessId" });
Appointment.belongsTo(Business, { foreignKey: "businessId" });

AppointmentInterval.hasMany(Appointment, { foreignKey: "intervalId" });
Appointment.belongsTo(AppointmentInterval, { foreignKey: "intervalId" });

User.hasMany(Payment, { foreignKey: "userId" });
Appointment.hasOne(Payment, { foreignKey: "appointmentId" });

User.hasMany(Review, { foreignKey: "userId" });
Business.hasMany(Review, { foreignKey: "businessId" });

Business.hasOne(BusinessAnalytics, { foreignKey: "businessId" });
BusinessAnalytics.belongsTo(Business, { foreignKey: "businessId" });



export {
  User,
  Business,
  BusinessAnalytics,
  Appointment,
  AppointmentInterval,
  Review,
  Payment,
};
