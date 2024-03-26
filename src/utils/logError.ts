import logger from "./logger";

export default function logError(error: Error) {
  logger.error(
    `xpan@${
      process.config.variables.host_arch
    } time; ${new Date().toLocaleString()}: ${error.name}}`
  );
  logger.debug(error);
}
