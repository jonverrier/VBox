/*jslint white: false, indent: 3, maxerr: 1000 */
/*global exports*/
/*! Copyright TXPCo, 2020 */

//import { ServerLoggerWrap } from './LoggerServerWrap';
import { ClientLoggerWrap } from './LoggerClientWrap';

export enum LoggerType {
   Server,
   Client
}


interface ILogger {
   logError (component: string,
      method: string,
      message: string,
      data: any
   ) : void;

   logInfo (component: string,
      method: string,
      message: string,
      data: any
   ) : void;
}

export class LoggerFactory {
   constructor() {
   }

   logger(loggerType: LoggerType): ILogger {
      switch (loggerType) {
         case LoggerType.Server:
            return new ClientLogger();

         case LoggerType.Client:
            return new ClientLogger();;
      }
      
   }
}

/*
class ServerLogger implements ILogger {

   private logger: any;

   constructor() {

      // instantiate a new Winston Logger with the settings defined above
      this.logger = new ServerLoggerWrap();
   }

   logError(component: string,
      method: string,
      message: string,
      data: any
   ) : void {
      this.logger.logError (
         component,
         method,
         message,
         data ? JSON.stringify (data, null, 2) : ""
      );
   }

   logInfo(component: string,
      method: string,
      message: string,
      data: any
   ) : void {
      this.logger.logInfo (
         component,
         method,
         message,
         data ? JSON.stringify(data, null, 2) : ""
      );
   }
}
*/

class ClientLogger implements ILogger {

   private logger: any;

   constructor() {

      // instantiate a new Winston Logger with the settings defined above
      this.logger = new ClientLoggerWrap();
   }

   logError(component: string,
      method: string,
      message: string,
      data: any
   ): void {
      this.logger.logError(
         component,
         method,
         message,
         data ? JSON.stringify(data, null, 2) : ""
      );
   }

   logInfo(component: string,
      method: string,
      message: string,
      data: any
   ): void {
      this.logger.logInfo(
         component,
         method,
         message,
         data ? JSON.stringify(data, null, 2) : ""
      );
   }
}

var LoggerEntryPoints = {
   LoggerFactory: LoggerFactory,
   LoggerType: LoggerType
};





