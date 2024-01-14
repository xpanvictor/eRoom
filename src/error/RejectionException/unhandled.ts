import * as http from "http";
import logError from "../../utils/logError";
import logger from "../../utils/logger";

const unhandledRejection = (server: http.Server) => {
  process.on("unhandledRejection", (error: Error) => {
    logger.silly("!!!Xpan, an Unhandled Rejection");
    logError(error);
    server.close(() => process.exit(1));
  });
};

const unhandledException = () => {
  process.on("uncaughtException", (error: Error) => {
    logger.silly("!!!Xpan, an Uncaught Exception");
    logError(error);
    process.exit(1);
  });
};

export { unhandledRejection, unhandledException };
