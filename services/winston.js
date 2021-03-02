const { createLogger, format, transports, addColors } = require('winston');
const { combine, colorize, printf, timestamp } = format;


const logFormat = printf((info) => {
  return `[${info.timestamp}] ${info.level}: ${info.message}`;
});

const rawFormat = printf((info) => {
  return `[${info.timestamp}] ${info.level}: ${info.message}`;
});

const logger = createLogger({
  level: 'debug',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat,
  ),
  transports: [
    new transports.File({
      filename: './logs/app.log',
    }),
    new transports.Console({ format: combine(timestamp(), rawFormat) }),
  ],
});

addColors({
  debug: 'white',
  error: 'red',
  info: 'green',
  warn: 'yellow',
});

logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  },
};

module.exports = logger;