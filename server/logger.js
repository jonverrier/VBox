
const winston = require('winston');

var options = {
   file: {
      level: 'debug',
      filename: `./logs/app.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
   },
   console: {
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
   },
};

// instantiate a new Winston Logger with the settings defined above
var logger = new winston.createLogger ({
   transports: [
      new winston.transports.File(options.file),
      new winston.transports.Console(options.console)
   ],
   exitOnError: false, // do not exit on handled exceptions
});

exports.logger = logger;