import sequelize from "./sequelize";

export default async function connectDB() {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Only sync in development environment
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync();
      console.log("Database synchronized successfully.");
    }
  } catch (error: any) {
    console.error("Unable to connect to the database:", error?.message);
    throw error;
  }
}
