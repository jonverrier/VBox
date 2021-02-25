/*jslint white: false, indent: 3, maxerr: 1000 */
/*global exports*/
/*! Copyright TXPCo, 2020 */

const winston = require('winston');

export class ServerLoggerWrap {

   private logger: any;

   constructor () {

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
      this.logger = winston.createLogger({
         transports: [
            new winston.transports.File(options.file),
            new winston.transports.Console(options.console)
         ],
         exitOnError: false, // do not exit on handled exceptions
      });
   }

   logError (fromClass: string, fromMethod: string, info: string, objAsJSON: string) : void  {
      this.logger.log('error', {
         component: fromClass,
         method: fromMethod,
         message: info,
         data: objAsJSON
      });
   }

   logInfo (fromClass: string, fromMethod: string, info: string, objAsJSON: string) : void  {
      this.logger.log('info', {
         component: fromClass,
         method: fromMethod,
         message: info,
         data: objAsJSON
      });
   }
}





