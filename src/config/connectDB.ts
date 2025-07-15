import sequelize from "./sequelize";

// Import all models to ensure they are registered with Sequelize
import "@/models/User";
import "@/models/Image";
import "@/models/Notification";
import "@/models/PasswordReset";
import "@/models/Settings";
import "@/models/VerificationCode";

export default async function connectDB() {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // await sequelize.sync({
    //   alter: process.env.NODE_ENV === "development",
    //   force: false,
    // });
    console.log("Database synchronized successfully.");

    return sequelize;
  } catch (error: any) {
    console.error("Unable to connect to the database:", error?.message);
    throw error;
  }
}
