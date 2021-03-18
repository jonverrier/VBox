/*jslint white: false, indent: 3, maxerr: 1000 */
/*global exports*/
/*! Copyright TXPCo, 2020, 2021 */

// External components
import axios from 'axios';

//import { ServerLoggerWrap } from './LoggerServerWrap';
import { ClientLoggerWrap } from './LoggerClientWrap';

export enum ELoggerType {
   Server,
   Client
}

export interface ILogger {
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

   createLogger(loggerType: ELoggerType, shipToSever: boolean): ILogger {
      switch (loggerType) {
         case ELoggerType.Server:
            return new ClientLogger(shipToSever);

         case ELoggerType.Client:
         default:
            return new ClientLogger(shipToSever);
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
   private shipToSever: boolean;

   constructor(shipToSever: boolean) {

      // instantiate a new Winston Logger with the settings defined above
      this.logger = new ClientLoggerWrap();
      this.shipToSever = shipToSever;
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

      // test we are in the browser before trying to log to server
      if (typeof window !== 'undefined' && window.localStorage) {
         if (this.shipToSever) {
            const msg = component + "." + method + ": " + message + (data ? JSON.stringify(data, null, 2) : "");
            axios.post('/api/error', { params: { message: msg } });
         }
      }
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
   ELoggerType: ELoggerType
};





