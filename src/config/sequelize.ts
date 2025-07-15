import User from "@/models/User";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST as string,
    dialect: "mysql",
    dialectModule: require("mysql2"),
    port: process.env.DB_PORT as unknown as number,
  }
);

export default sequelize;
