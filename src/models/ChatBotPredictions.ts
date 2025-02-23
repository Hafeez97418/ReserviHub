import { sequelize } from "@/repositories/connection.mysql.js";
import { DataTypes } from "sequelize";
import Business from "./Business.js";


const AiChatbotPredictions = sequelize.define("AiChatbotPredictions", {
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
  month: {
    type: DataTypes.STRING, // Example: "February 2025"
    allowNull: false,
  },
  serviceDemand: {
    type: DataTypes.JSON, // Stores predicted demand per service
    defaultValue: {},
  },
  salesForecast: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
});

export default AiChatbotPredictions;
