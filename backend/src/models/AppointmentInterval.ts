import { sequelize } from "@/repositories/connection.mysql.js";
import { DataTypes } from "sequelize";
import Business from "./Business.js";

const AppointmentInterval = sequelize.define(
  "AppointmentInterval",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    type: {
      type: DataTypes.ENUM("daily", "hourly"),
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME, // Only for hourly businesses
      allowNull: true, // Should be NULL for "daily" type
    },
    endTime: {
      type: DataTypes.TIME, // Only for hourly businesses
      allowNull: true, // Should be NULL for "daily" type
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    maxSlots: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    availableSlots: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER, // Stored in seconds
      allowNull: true,
    },
    booked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt & updatedAt
  }
);

export default AppointmentInterval;
