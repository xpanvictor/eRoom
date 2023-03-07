import mongoose from "mongoose";
import config from "../../constants/config";
import ProgrammingError from "../../error/technical/ProgrammingError";

export default async function connectMongo() {
  if (!config.MONGO_CONN_URL)
    throw new ProgrammingError("Mongodb connection url not provided!");
  try {
    const conn = await mongoose.connect(config.MONGO_CONN_URL, {
      retryWrites: false,
      appName: "EClass database",
    });
    console.log(`${conn.connections[0].name} connected with mongoose`);
  } catch (e) {
    console.log(e);
  }
}
