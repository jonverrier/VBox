/*! Copyright TXPCo, 2020, 2021 */

// external components
import axios from 'axios';
var logging = require('loglevel');

logging.setLevel("info");

export class ClientLoggerWrap {

   private logger: any;

   constructor () {

      // instantiate a new Winston Logger with the settings defined above
      this.logger = logging;
   }

   logError (fromClass: string, fromMethod: string, info: string, objAsJSON: string) : void {
      const msg = ' ' + fromClass + "." + fromMethod + ": " + info + (objAsJSON ? objAsJSON : "");
      this.logger.error('Error:' + msg);

      axios.post('/api/error', { params: { message: encodeURIComponent(msg) } })
         .then((response) => {
         });
   }

   logInfo(fromClass: string, fromMethod: string, info: string, objAsJSON: string) : void {
      this.logger.info('Info: ' + fromClass + "." + fromMethod + ": " + info + (objAsJSON ? objAsJSON : ""));
   }
}





