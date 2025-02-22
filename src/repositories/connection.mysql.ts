import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("reservihub", "root", "p1u2b3g4Mysql", {
  host: "localhost",
  dialect: "mysql",
});

export const authenticateDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("database successfully connected");
  } catch (error) {
      console.error("Unable to connect to the database:", error);
      process.exit(1);
  }
};
