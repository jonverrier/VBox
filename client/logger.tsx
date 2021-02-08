/*! Copyright TXPCo, 2020 */

declare var require: any

import * as React from 'react';
import axios from 'axios';

var logging = require('loglevel');

logging.setLevel("info");

export class Logger {
   // member variables
   logger : any; 

   constructor() {
      this.logger = logging;
   }

   info(fromClass: string, fromMethod: string, info: string, obj: object) {
      this.logger.info('Info: ' + fromClass + "." + fromMethod + ": " + info + (obj ? JSON.stringify(obj) : ""));
   }

   error(fromClass: string, fromMethod: string, info: string, obj: object) {
      const msg = ' ' + fromClass + "." + fromMethod + ": " + info + (obj ? JSON.stringify(obj) : "");
      this.logger.error('Error:' + msg);

      axios.post('/api/error', { params: { message: encodeURIComponent(msg) } })
         .then((response) => {
         });
   }
}