import mongoose from "mongoose";

export const connectDatabase = async (): Promise<void> => {
  try {
    const MONGODB_URI =
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/health-checkin-task";

    await mongoose.connect(MONGODB_URI);

    console.log("✅ Connected to MongoDB successfully");

    mongoose.connection.on("error", (error) => {
      console.error("❌ MongoDB connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🔌 MongoDB connection closed through app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};
