import { sequelize } from "@/repositories/connection.mysql.js";
import { DataTypes } from "sequelize";
import User from "./User.js";
import Business from "./Business.js";
import AppointmentInterval from "./AppointmentInterval.js";

const Appointment = sequelize.define(
  "Appointment",
  {
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
      onDelete: "CASCADE",
    },
    businessId: {
      type: DataTypes.UUID,
      references: {
        model: Business,
        key: "id",
      },
      allowNull: false,
      onDelete: "CASCADE",
    },
    intervalId: {
      type: DataTypes.UUID,
      references: {
        model: AppointmentInterval,
        key: "id",
      },
      allowNull: false,
      onDelete: "CASCADE",
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed", "failed"),
      allowNull: false,
      defaultValue: "pending",
    },
    startTime: {
      type: DataTypes.TIME, // Supports both date & time
      allowNull: true, // Nullable for daily reservations
    },
    endTime: {
      type: DataTypes.TIME, // Supports both date & time
      allowNull: true, // Nullable for daily reservations
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull:true
    }
  },
  {
    timestamps: true, // Adds createdAt & updatedAt automatically
  }
);

export default Appointment;
