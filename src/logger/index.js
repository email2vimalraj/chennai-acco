const winston = require('winston');
const path = require('path');
const fs = require('fs');

winston.emitErrs = true; // Don't gobble unhandled exceptions

const logsDirectory = path.join(__dirname, '..', '..', 'logs');
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}

const logger = new winston.Logger({
  exitOnError: false,
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: `${logsDirectory}/all-logs.log`,
      handleExceptions: true,
      json: false,
      maxsize: 5242880, // 5 MB
      maxFiles: 20,
      colorize: false,
      timestamp: () => (new Date().toLocaleString()),
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    }),
  ],
});

module.exports = {
  ...logger,
  stream: {
    write: (message) => {
      logger.info(message);
    },
  },
};
