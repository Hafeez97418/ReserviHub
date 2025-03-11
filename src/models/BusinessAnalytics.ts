import { sequelize } from "@/repositories/connection.mysql.js";
import { DataTypes } from "sequelize";
import Business from "./Business.js";

const BusinessAnalytics = sequelize.define("BusinessAnalytics", {
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
  },
  totalAppointments: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  completedAppointments: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  missedAppointments: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalRevenue: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  peakHours: {
    type: DataTypes.JSON, // Stores peak hours data
    defaultValue: [],
  },
});

export default BusinessAnalytics;
