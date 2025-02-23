import { sequelize } from "@/repositories/connection.mysql.js";
import { DataTypes } from "sequelize";
import Business from "./Business.js";


const AppointmentInterval = sequelize.define("AppointmentInterval", {
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
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.DATE,
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
});

export default AppointmentInterval;
