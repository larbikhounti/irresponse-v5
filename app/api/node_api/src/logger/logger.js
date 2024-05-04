const { addColors, transports, format, createLogger } = require("winston");
const { combine, colorize, simple, prettyPrint } = format;

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

const transport = new transports.File({ filename: "file.log" });

const logger = createLogger({
  levels: logLevels.levels,
  format: prettyPrint(),
  transports: [transport],
});

module.exports = logger;