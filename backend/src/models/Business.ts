import { sequelize } from "@/repositories/connection.mysql.js";
import { DataTypes } from "sequelize";
import User from "./User.js";

const Business = sequelize.define(
  "Business",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    managerId: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: "id",
      },
      unique: true,
      allowNull: true,
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    category: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING, // Changed to STRING
      allowNull: false,
      unique: true,
      validate: {
        len: [10, 15], // Basic length validation
        isNumeric: true, // Ensure only numbers
      },
    },
  },
  {
    timestamps: true,
  }
);

export default Business;
