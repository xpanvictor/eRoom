import { format, createLogger, transports } from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, label, prettyPrint } = format;
const CATEGORY = "Received message";

const alignColorsAndTime = format.combine(
  format.colorize({
    all: true,
  }),
  format.label({
    label: "[LOGGER]",
  }),
  format.timestamp({
    format: "YY-MM-DD HH:mm:ss",
  }),
  format.printf(
    (info) =>
      ` ${info.label}  ${info.timestamp}  ${info.level} : \n ${info.message}`
  )
);

const logger = createLogger({
  level: "debug",
  format: combine(
    label({ label: CATEGORY }),
    timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    prettyPrint()
  ),
  transports: [
    new transports.DailyRotateFile({
      filename: "logs/general-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "10D",
      maxSize: "5m",
    }),
    new transports.File({
      level: "error",
      filename: "logs/error.log",
    }),
    new transports.Console({
      format: format.combine(format.colorize(), alignColorsAndTime),
    }),
  ],
});

export default logger;
