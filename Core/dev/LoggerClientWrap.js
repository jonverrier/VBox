/*jslint white: false, indent: 3, maxerr: 1000 */
/*global exports*/
/*! Copyright TXPCo, 2020 */

var logging = require('loglevel');

logging.setLevel("info");

var ClientLogger = (function invocation() {

   function ClientLogger() {
   "use strict";


      // instantiate a new Winston Logger with the settings defined above
      this.logger = logging;
   }

   ClientLogger.prototype.logError = function (fromClass, fromMethod, info, objAsJSON) {
      const msg = ' ' + fromClass + "." + fromMethod + ": " + info + (objAsJSON ? objAsJSON : "");
      this.logger.error('Error:' + msg);

      //axios.post('/api/error', { params: { message: encodeURIComponent(msg) } })
      //   .then((response) => {
      //   });
   }

   ClientLogger.prototype.logInfo = function (fromClass, fromMethod, info, objAsJSON) {
      this.logger.info('Info: ' + fromClass + "." + fromMethod + ": " + info + (objAsJSON ? objAsJSON : ""));
   }

   return ClientLogger;
}());

exports.ClientLoggerWrap = ClientLogger;




