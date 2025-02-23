import { sequelize } from "@/repositories/connection.mysql.js";
import { DataTypes } from "sequelize";
import User from "./User.js";
import Business from "./Business.js";
import AppointmentInterval from "./AppointmentInterval.js";


const Appointment = sequelize.define("Appointment", {
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
  businessId: {
    type: DataTypes.UUID,
    references: {
      model: Business,
      key: "id",
    },
    allowNull: false,
  },
  intervalId: {
    type: DataTypes.UUID,
    references: {
      model: AppointmentInterval,
      key: "id",
    },
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed"),
    allowNull: false,
  },
});

export default Appointment;
