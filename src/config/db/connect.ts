import mongoose from "mongoose";
import slug from "mongoose-slug-generator";
import config from "../../constants/config";
import ProgrammingError from "../../error/technical/ProgrammingError";
import logger from "../../utils/logger";

export default async function connectMongo() {
  mongoose.connection.on("connected", () => {
    // Plugins connect
    mongoose.plugin(slug);
    logger.info(`${mongoose.connections[0].name} connected with mongoose`);
  });
  mongoose.connection?.on("disconnect", () => {
    logger.info(`${mongoose.connections[0].name} disconnected!`);
  });

  if (!config.MONGO_CONN_URL)
    throw new ProgrammingError("Mongodb connection url not provided!");
  try {
    await mongoose.connect(config.MONGO_CONN_URL, {
      retryWrites: false,
      appName: "EClass database",
      autoIndex: true,
    });
  } catch (e) {
    logger.error(e);
  }
}
