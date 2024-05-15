const { addColors, transports, format, createLogger } = require("winston");
const { combine, colorize, timestamp, printf } = format;

const logLevels = {
  levels: { critical: 0, error: 1, warning: 2, debug: 3, info: 4 },
  colors: {
    critical: "bold magenta",
    error: "bold red",
    warning: "bold yellow",
    info: "bold blue",
    debug: "bold green",
  },
};

addColors(logLevels.colors);

const fileFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const consoleFormat = combine(
  colorize(),
  printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
  })
);

const logger = createLogger({
  levels: logLevels.levels,
  format: combine(
    timestamp(),
    fileFormat
  ),
  transports: [
    new transports.File({ filename: "./logs.txt" }),
    new transports.Console({ format: consoleFormat }),
  ],
});

module.exports = logger;
