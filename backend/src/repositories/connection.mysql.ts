import { Sequelize } from "sequelize";

const db = {
  name: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
};
const { username, name, password, host } = db;


if (!username || !name || !password || !host) {
  throw new Error("some database credentials are undefined");
}

export const sequelize = new Sequelize(name, username, password, {
  host: host,
  dialect: "mysql",
});

export const authenticateDB = async () => {
  try {
    await sequelize.sync();
    console.log("database successfully connected");
  } catch (error) {
    throw new Error("Unable to connect to the database: " + `${error}`);
  }
};
