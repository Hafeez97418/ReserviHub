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
    startTime: {
      type: DataTypes.TIME, 
      allowNull: true, 
    },
    endTime: {
      type: DataTypes.TIME, 
      allowNull: true, 
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
