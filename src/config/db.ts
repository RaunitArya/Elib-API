import mongoose from "mongoose";
import { config } from "./config.ts";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB Connected Successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.log("Error in connecting MongoDB: ", err);
    });
    await mongoose.connect(config.mongodb as string);

  } catch (err) {
    console.error("Failed to connect to MongoDB", err);

    process.exit(1);
  }
};

export default connectDB;
