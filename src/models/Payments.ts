import { sequelize } from "@/repositories/connection.mysql.js";
import { DataTypes } from "sequelize";
import User from "./User.js";
import Appointment from "./Appointment.js";

const Payment = sequelize.define("Payment", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: "id",
    },
    allowNull: false,
  },
  appointmentId: {
    type: DataTypes.UUID,
    references: {
      model: Appointment,
      key: "id",
    },
    unique: true, // One payment per appointment
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "paid", "failed" , "refunded"),
    allowNull: false,
  },
  order: {
    type: DataTypes.JSON(),
    allowNull: false,
  },
});

export default Payment;
