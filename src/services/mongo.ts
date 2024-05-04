import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URI as string;

mongoose.connection.once("open", () => {
  console.log("[mongo]: MongoDB connection ready");
});

mongoose.connection.on("error", (error) => {
  console.log("[mongo]: MongoDB connection error", error);
});

mongoose.connection.on("disconnected", () => {
  console.log("[mongo]: MongoDB connection disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("[mongo]: MongoDB connection reconnected");
});

mongoose.connection.on("close", () => {
  console.log("[mongo]: MongoDB connection close");
});

mongoose.connection.on("SIGINT", () => {
  console.log("[mongo]: MongoDB connection SIGINT");
  mongoose.connection.close();
  process.exit(0);
});

export async function connectMongo() {
  await mongoose.connect(mongoUri);
}
